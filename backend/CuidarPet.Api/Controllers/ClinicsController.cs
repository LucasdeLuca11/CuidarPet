using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CuidarPet.Api.Data;
using CuidarPet.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;


namespace CuidarPet.Api.Controllers;

/// <summary>
/// DTO para criar/atualizar clínica
/// </summary>
public class CreateClinicDto
{
    [Required(ErrorMessage = "Nome é obrigatório")]
    [StringLength(255, MinimumLength = 3, ErrorMessage = "Nome deve ter entre 3 e 255 caracteres")]
    public string Name { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Address { get; set; }

    [StringLength(100)]
    public string? City { get; set; }

    [StringLength(2)]
    public string? State { get; set; }

    [StringLength(20)]
    public string? ZipCode { get; set; }

    [Phone(ErrorMessage = "Telefone inválido")]
    [StringLength(20)]
    public string? Phone { get; set; }

    [EmailAddress(ErrorMessage = "Email inválido")]
    [StringLength(320)]
    public string? Email { get; set; }

    [StringLength(500)]
    public string? BusinessHours { get; set; }

    [StringLength(2000)]
    public string? Description { get; set; }
}

/// <summary>
/// Controller para gerenciar clínicas/petshops
/// 
/// Apenas Veterinários podem criar e gerenciar clínicas
/// Tutores podem visualizar clínicas
/// Admin pode gerenciar todas
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Veterinarian,Admin")]
public class ClinicsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<ClinicsController> _logger;

    public ClinicsController(AppDbContext context, ILogger<ClinicsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Lista todas as clínicas do usuário autenticado
    /// 
    /// - Veterinários: Veem suas próprias clínicas
    /// - Tutores: Veem clínicas onde têm agendamentos
    /// - Admin: Vê todas as clínicas
    /// </summary>
    [Authorize]
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<List<Clinic>>> GetMyClinics()
    {
        try
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            IQueryable<Clinic> query = _context.Clinics
                .Include(c => c.Services)
                .Include(c => c.Reviews);

            // Filtrar por role
            if (userRole == UserRole.Veterinarian.ToString())
            {
                // Veterinários veem apenas suas clínicas
                query = query.Where(c => c.OwnerId == userId);
            }
            else if (userRole == UserRole.Tutor.ToString())
            {
                // Tutores veem clínicas onde têm agendamentos
                var clinicIds = await _context.Appointments
                    .Where(a => _context.Pets
                        .Where(p => p.OwnerId == userId)
                        .Select(p => p.Id)
                        .Contains(a.PetId))
                    .Select(a => a.ClinicId)
                    .Distinct()
                    .ToListAsync();

                query = query.Where(c => clinicIds.Contains(c.Id));
            }
            // Admin vê todas

            var clinics = await query
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return Ok(clinics);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao listar clínicas: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao listar clínicas" });
        }
    }

    /// <summary>
    /// Obtém detalhes de uma clínica específica
    /// </summary>
    [Authorize]
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<Clinic>> GetClinicById(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            var clinic = await _context.Clinics
                .Include(c => c.Services)
                .Include(c => c.Reviews)
                .Include(c => c.Employees)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (clinic == null)
            {
                return NotFound(new { message = "Clínica não encontrada" });
            }

            // Verificar autorização
            bool isAuthorized = false;

            if (userRole == UserRole.Veterinarian.ToString())
            {
                isAuthorized = clinic.OwnerId == userId;
            }
            else if (userRole == UserRole.Tutor.ToString())
            {
                // Tutor pode ver se tem agendamento
                isAuthorized = await _context.Appointments
                    .Where(a => a.ClinicId == id)
                    .Where(a => _context.Pets
                        .Where(p => p.OwnerId == userId)
                        .Select(p => p.Id)
                        .Contains(a.PetId))
                    .AnyAsync();
            }
            else if (userRole == UserRole.Admin.ToString())
            {
                isAuthorized = true;
            }

            if (!isAuthorized)
            {
                return Forbid();
            }

            return Ok(clinic);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao obter clínica: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao obter clínica" });
        }
    }

    /// <summary>
    /// Cria uma nova clínica
    /// 
    /// Apenas Veterinários podem criar clínicas
    /// </summary>
    [Authorize(Roles = "Veterinarian")]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<Clinic>> CreateClinic([FromBody] CreateClinicDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            // Apenas Veterinários podem criar clínicas
            // if (userRole != UserRole.Veterinarian.ToString() && userRole != UserRole.Admin.ToString())
            // {
            //     return Forbid();
            // }

            var clinic = new Clinic
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Address = dto.Address,
                City = dto.City,
                State = dto.State,
                ZipCode = dto.ZipCode,
                Phone = dto.Phone,
                Email = dto.Email,
                BusinessHours = dto.BusinessHours,
                Description = dto.Description,
                OwnerId = userId,
                IsActive = true,
                IsVerified = false,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Clinics.Add(clinic);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Clínica criada: {clinic.Name} (ID: {clinic.Id}) para usuário {userId}");

            return CreatedAtAction(nameof(GetClinicById), new { id = clinic.Id }, clinic);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao criar clínica: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao criar clínica" });
        }
    }

    /// <summary>
    /// Atualiza informações de uma clínica
    /// 
    /// Apenas o proprietário da clínica pode atualizar
    /// </summary>
    [Authorize(Roles = "Veterinarian,Admin")]
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<Clinic>> UpdateClinic(Guid id, [FromBody] CreateClinicDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            var clinic = await _context.Clinics.FirstOrDefaultAsync(c => c.Id == id);

            if (clinic == null)
            {
                return NotFound(new { message = "Clínica não encontrada" });
            }

            // Verificar autorização
            if (clinic.OwnerId != userId && userRole != UserRole.Admin.ToString())
            {
                return Forbid();
            }

            clinic.Name = dto.Name;
            clinic.Address = dto.Address;
            clinic.City = dto.City;
            clinic.State = dto.State;
            clinic.ZipCode = dto.ZipCode;
            clinic.Phone = dto.Phone;
            clinic.Email = dto.Email;
            clinic.BusinessHours = dto.BusinessHours;
            clinic.Description = dto.Description;
            clinic.UpdatedAt = DateTime.UtcNow;

            _context.Clinics.Update(clinic);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Clínica atualizada: {clinic.Name} (ID: {clinic.Id})");

            return Ok(clinic);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao atualizar clínica: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao atualizar clínica" });
        }
    }

    /// <summary>
    /// Deleta uma clínica
    /// 
    /// Apenas o proprietário da clínica pode deletar
    /// </summary>
    [Authorize(Roles = "Veterinarian,Admin")]
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteClinic(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            var clinic = await _context.Clinics.FirstOrDefaultAsync(c => c.Id == id);

            if (clinic == null)
            {
                return NotFound(new { message = "Clínica não encontrada" });
            }

            // Verificar autorização
            if (clinic.OwnerId != userId && userRole != UserRole.Admin.ToString())
            {
                return Forbid();
            }

            _context.Clinics.Remove(clinic);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Clínica deletada: {clinic.Name} (ID: {clinic.Id})");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao deletar clínica: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao deletar clínica" });
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