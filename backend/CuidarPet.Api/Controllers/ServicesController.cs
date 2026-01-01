using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CuidarPet.Api.Data;
using CuidarPet.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CuidarPet.Api.Controllers;

/// <summary>
/// DTO para criar/atualizar serviço
/// </summary>
public class CreateServiceDto
{
    [Required(ErrorMessage = "Nome é obrigatório")]
    [StringLength(255, MinimumLength = 3, ErrorMessage = "Nome deve ter entre 3 e 255 caracteres")]
    public string Name { get; set; } = string.Empty;

    [StringLength(2000)]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Preço é obrigatório")]
    [Range(0.01, 100000, ErrorMessage = "Preço deve estar entre 0.01 e 100000")]
    public decimal Price { get; set; }

    [Range(5, 480, ErrorMessage = "Duração deve estar entre 5 e 480 minutos")]
    public int? Duration { get; set; }
}

/// <summary>
/// Controller para gerenciar serviços
/// 
/// Apenas Veterinários podem criar e gerenciar serviços de suas clínicas
/// Admin pode gerenciar todos os serviços
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ServicesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<ServicesController> _logger;

    public ServicesController(AppDbContext context, ILogger<ServicesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Lista todos os serviços da clínica
    /// </summary>
    [Authorize]
    [HttpGet("clinic/{clinicId}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<List<Service>>> GetServicesByClinic(Guid clinicId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            // Verificar se a clínica existe
            var clinic = await _context.Clinics.FirstOrDefaultAsync(c => c.Id == clinicId);
            if (clinic == null)
            {
                return NotFound(new { message = "Clínica não encontrada" });
            }

            // Verificar autorização
            if (userRole == UserRole.Veterinarian.ToString() && clinic.OwnerId != userId)
            {
                return Forbid();
            }

            var services = await _context.Services
                .Where(s => s.ClinicId == clinicId && s.IsActive)
                .OrderBy(s => s.Name)
                .ToListAsync();

            return Ok(services);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao listar serviços: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao listar serviços" });
        }
    }

    /// <summary>
    /// Obtém detalhes de um serviço específico
    /// </summary>
    [Authorize]
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<Service>> GetServiceById(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            var service = await _context.Services
                .Include(s => s.Clinic)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (service == null)
            {
                return NotFound(new { message = "Serviço não encontrado" });
            }

            // Verificar autorização
            if (userRole == UserRole.Veterinarian.ToString() && service.Clinic?.OwnerId != userId)
            {
                return Forbid();
            }

            return Ok(service);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao obter serviço: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao obter serviço" });
        }
    }

    /// <summary>
    /// Cria um novo serviço
    /// 
    /// Apenas Veterinários podem criar serviços
    /// </summary>
    [Authorize(Roles = "Veterinarian,Admin")]
    [HttpPost("clinic/{clinicId}")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<Service>> CreateService(Guid clinicId, [FromBody] CreateServiceDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            // Apenas Veterinários podem criar serviços
            // if (userRole != UserRole.Veterinarian.ToString() && userRole != UserRole.Admin.ToString())
            // {
            //     return Forbid();
            // }

            // Verificar se a clínica existe
            var clinic = await _context.Clinics.FirstOrDefaultAsync(c => c.Id == clinicId);
            if (clinic == null)
            {
                return NotFound(new { message = "Clínica não encontrada" });
            }

            // Verificar se o usuário é o proprietário da clínica
            if (userRole == UserRole.Veterinarian.ToString() && clinic.OwnerId != userId)
            {
                return Forbid();
            }

            var service = new Service
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Duration = dto.Duration,
                IsActive = true,
                ClinicId = clinicId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Serviço criado: {service.Name} (ID: {service.Id}) para clínica {clinicId}");

            return CreatedAtAction(nameof(GetServiceById), new { id = service.Id }, service);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao criar serviço: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao criar serviço" });
        }
    }

    /// <summary>
    /// Atualiza informações de um serviço
    /// 
    /// Apenas o proprietário da clínica pode atualizar
    /// </summary>
    [Authorize(Roles = "Veterinarian,Admin")]
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<Service>> UpdateService(Guid id, [FromBody] CreateServiceDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            var service = await _context.Services
                .Include(s => s.Clinic)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (service == null)
            {
                return NotFound(new { message = "Serviço não encontrado" });
            }

            // Verificar autorização
            if (userRole == UserRole.Veterinarian.ToString() && service.Clinic?.OwnerId != userId)
            {
                return Forbid();
            }

            service.Name = dto.Name;
            service.Description = dto.Description;
            service.Price = dto.Price;
            service.Duration = dto.Duration;
            service.UpdatedAt = DateTime.UtcNow;

            _context.Services.Update(service);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Serviço atualizado: {service.Name} (ID: {service.Id})");

            return Ok(service);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao atualizar serviço: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao atualizar serviço" });
        }
    }

    /// <summary>
    /// Deleta um serviço (soft delete - apenas marca como inativo)
    /// 
    /// Apenas o proprietário da clínica pode deletar
    /// </summary>
    [Authorize(Roles = "Veterinarian,Admin")]
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteService(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            var service = await _context.Services
                .Include(s => s.Clinic)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (service == null)
            {
                return NotFound(new { message = "Serviço não encontrado" });
            }

            // Verificar autorização
            if (userRole == UserRole.Veterinarian.ToString() && service.Clinic?.OwnerId != userId)
            {
                return Forbid();
            }

            // Soft delete - apenas marca como inativo
            service.IsActive = false;
            service.UpdatedAt = DateTime.UtcNow;

            _context.Services.Update(service);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Serviço deletado (soft delete): {service.Name} (ID: {service.Id})");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao deletar serviço: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao deletar serviço" });
        }
    }

    // ========================================================================
    // MÉTODOS AUXILIARES
    // ========================================================================

    /// <summary>
    /// Obtém o ID do usuário autenticado
    /// </summary>
    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            throw new UnauthorizedAccessException("Usuário não autenticado");
        }
        return userId;
    }

    /// <summary>
    /// Obtém o papel do usuário autenticado
    /// </summary>
    private string GetCurrentUserRole()
    {
        return User.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;
    }
}