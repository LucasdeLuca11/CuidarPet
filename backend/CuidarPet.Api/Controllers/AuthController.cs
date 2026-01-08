using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using CuidarPet.Api.Data;
using CuidarPet.Api.DTOs;
using CuidarPet.Api.Models;
using CuidarPet.Api.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using System.Security.Claims;


namespace CuidarPet.Api.Controllers;

/// <summary>
/// Controller para autenticação e autorização
/// 
/// Endpoints:
/// - POST /api/auth/register: Registrar novo usuário
/// - POST /api/auth/login: Fazer login
/// - POST /api/auth/logout: Fazer logout
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<AuthController> _logger;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthController(
        AppDbContext context,
        IJwtTokenService jwtTokenService,
        ILogger<AuthController> logger)
    {
        _context = context;
        _jwtTokenService = jwtTokenService;
        _logger = logger;
    }

    [HttpGet("google")]
    [AllowAnonymous]
    public IActionResult GoogleLogin()
    {
        var properties = new AuthenticationProperties
        {
            RedirectUri = Url.Action("GoogleCallback")
        };

        return Challenge(properties, "Google");
    }

    [HttpGet("google-callback")]
    [AllowAnonymous]
    public async Task<IActionResult> GoogleCallback()
    {
        var authenticateResult = await HttpContext.AuthenticateAsync("Google");

        if (!authenticateResult.Succeeded)
            return Unauthorized();

        var claims = authenticateResult.Principal!.Claims;

        var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        var name = claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

        if (email == null)
            return BadRequest("Email não encontrado no Google");

        // 🔍 Buscar usuário
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        // ❗ Usuário NÃO existe → completar cadastro
        if (user == null)
        {
            var redirectRegisterUrl =
                $"http://localhost:5173/register/google?email={email}&name={Uri.EscapeDataString(name ?? "")}";

            return Redirect(redirectRegisterUrl);
        }

        // 🔐 Usuário existe → login normal
        var token = _jwtTokenService.GenerateToken(user);

        var frontendUrl = $"http://localhost:5173/auth/callback?token={token}";
        return Redirect(frontendUrl);
    }


    /// <summary>
    /// Registra um novo usuário no sistema
    /// 
    /// Suporta 3 tipos:
    /// - Tutor (role: 0): Dono de pets
    /// - Veterinário (role: 1): Provedor de serviço
    /// - Admin (role: 2): Não permitido via API
    /// </summary>
    [Authorize]
    [HttpPost("register")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterDto dto)
    {
        try
        {
            // Validar DTO
            if (!ModelState.IsValid)
            {
                return BadRequest(new { errors = ModelState.Values.SelectMany(v => v.Errors) });
            }

            // Validar regras de negócio
            if (!dto.IsValid(out var validationErrors))
            {
                return BadRequest(new { errors = validationErrors });
            }

            // Verificar se email já existe
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (existingUser != null)
            {
                return Conflict(new { message = "Email já registrado" });
            }

            // Criar novo usuário
            var user = new User
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password),
                Role = (UserRole)dto.Role,
                Phone = dto.Phone,
                IsEmailVerified = true,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                LastSignedIn = DateTime.UtcNow
            };

            // Salvar no banco
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Novo usuário registrado: {user.Email} (Role: {user.Role})");

            // Gerar token JWT
            var token = _jwtTokenService.GenerateToken(user);

            return CreatedAtAction(nameof(Register), new AuthResponse
            {
                Token = token,
                User = new UserResponse
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role.ToString(),
                    // CompanyName = user.CompanyName,
                    Phone = user.Phone,
                    CreatedAt = user.CreatedAt
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao registrar usuário: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao registrar usuário" });
        }
    }

    /// <summary>
    /// Faz login de um usuário e retorna token JWT
    /// </summary>
    [Authorize]
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginDto dto)
    {
        try
        {
            // Validar DTO
            if (!ModelState.IsValid)
            {
                return BadRequest(new { errors = ModelState.Values.SelectMany(v => v.Errors) });
            }

            // Buscar usuário por email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || !VerifyPassword(dto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Email ou senha inválidos" });
            }

            // Verificar se conta está ativa
            if (!user.IsActive)
            {
                return Unauthorized(new { message = "Conta desativada" });
            }

            // Verificar se conta está bloqueada
            if (user.IsBlocked)
            {
                return Unauthorized(new { message = $"Conta bloqueada: {user.BlockReason}" });
            }

            // Atualizar último login
            user.LastSignedIn = DateTime.UtcNow;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Login bem-sucedido: {user.Email}");

            // Gerar token JWT
            var token = _jwtTokenService.GenerateToken(user);

            return Ok(new AuthResponse
            {
                Token = token,
                User = new UserResponse
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role.ToString(),
                    // CompanyName = user.CompanyName,
                    Phone = user.Phone,
                    CreatedAt = user.CreatedAt
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao fazer login: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao fazer login" });
        }
    }

    /// <summary>
    /// Faz logout do usuário (apenas revoga o token no frontend)
    /// </summary>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public ActionResult Logout()
    {
        try
        {
            _logger.LogInformation("Logout realizado");
            return Ok(new { message = "Logout realizado com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao fazer logout: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao fazer logout" });
        }
    }

    // ========================================================================
    // MÉTODOS AUXILIARES
    // ========================================================================

    /// <summary>
    /// Gera hash SHA256 da senha
    /// </summary>
    private string HashPassword(string password)
    {
        using (var sha256 = SHA256.Create())
        {
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }

    /// <summary>
    /// Verifica se a senha corresponde ao hash
    /// </summary>
    private bool VerifyPassword(string password, string hash)
    {
        var hashOfInput = HashPassword(password);
        return hashOfInput == hash;
    }
}

/// <summary>
/// DTO de resposta de autenticação
/// </summary>
public class AuthResponse
{
    /// <summary>
    /// Token JWT para autenticação
    /// </summary>
    public string Token { get; set; } = string.Empty;

    /// <summary>
    /// Dados do usuário autenticado
    /// </summary>
    public UserResponse User { get; set; } = null!;
}

/// <summary>
/// DTO de resposta de usuário
/// </summary>
public class UserResponse
{
    /// <summary>
    /// ID do usuário
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Nome do usuário
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Email do usuário
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Papel do usuário (Tutor, Veterinarian, Admin)
    /// </summary>
    public string Role { get; set; } = string.Empty;

    /// <summary>
    /// Telefone do usuário
    /// </summary>
    public string? Phone { get; set; }

    /// <summary>
    /// Data de criação da conta
    /// </summary>
    public DateTime CreatedAt { get; set; }
}