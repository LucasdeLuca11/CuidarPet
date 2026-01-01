using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CuidarPet.Api.Data;
using CuidarPet.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CuidarPet.Api.Controllers;

/// <summary>
/// DTO para criar/atualizar agendamento
/// </summary>
public class CreateAppointmentDto
{
    [Required(ErrorMessage = "Pet é obrigatório")]
    public Guid PetId { get; set; }

    [Required(ErrorMessage = "Serviço é obrigatório")]
    public Guid ServiceId { get; set; }

    [Required(ErrorMessage = "Clínica é obrigatória")]
    public Guid ClinicId { get; set; }

    [Required(ErrorMessage = "Data do agendamento é obrigatória")]
    public DateTime ScheduledDate { get; set; }

    [StringLength(1000)]
    public string? Notes { get; set; }
}

/// <summary>
/// DTO para atualizar status de agendamento
/// </summary>
public class UpdateAppointmentStatusDto
{
    [Required(ErrorMessage = "Status é obrigatório")]
    [Range(0, 2, ErrorMessage = "Status inválido (0: Scheduled, 1: Completed, 2: Cancelled)")]
    public int Status { get; set; }

    [StringLength(500)]
    public string? Result { get; set; }

    [Range(0.01, 100000, ErrorMessage = "Preço deve ser maior que 0")]
    public decimal? PriceCharged { get; set; }
}

/// <summary>
/// Controller para gerenciar agendamentos
/// 
/// Tutores podem criar agendamentos para seus pets
/// Veterinários podem gerenciar agendamentos de suas clínicas
/// Admin pode gerenciar todos os agendamentos
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AppointmentsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<AppointmentsController> _logger;

    public AppointmentsController(AppDbContext context, ILogger<AppointmentsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Obtém detalhes de um agendamento específico
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<Appointment>> GetAppointmentById(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            var appointment = await _context.Appointments
                .Include(a => a.Pet)
                .Include(a => a.Service)
                .Include(a => a.Clinic)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
            {
                return NotFound(new { message = "Agendamento não encontrado" });
            }

            // Verificar autorização
            bool isAuthorized = false;

            if (userRole == UserRole.Tutor.ToString())
            {
                // Tutor pode ver seus próprios agendamentos
                isAuthorized = appointment.Pet?.OwnerId == userId;
            }
            else if (userRole == UserRole.Veterinarian.ToString())
            {
                // Veterinário pode ver agendamentos de suas clínicas
                isAuthorized = appointment.Clinic?.OwnerId == userId;
            }
            else if (userRole == UserRole.Admin.ToString())
            {
                isAuthorized = true;
            }

            if (!isAuthorized)
            {
                return Forbid();
            }

            return Ok(appointment);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao obter agendamento: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao obter agendamento" });
        }
    }

    /// <summary>
    /// Cria um novo agendamento
    /// 
    /// Apenas Tutores podem criar agendamentos
    /// </summary>
    [Authorize(Roles = "Tutor")]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<Appointment>> CreateAppointment([FromBody] CreateAppointmentDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            // Apenas Tutores podem criar agendamentos
            // if (userRole != UserRole.Tutor.ToString() && userRole != UserRole.Admin.ToString())
            // {
            //     return Forbid();
            // }

            // Validar se o pet existe e pertence ao usuário
            var pet = await _context.Pets.FirstOrDefaultAsync(p => p.Id == dto.PetId);
            if (pet == null)
            {
                return BadRequest(new { message = "Pet não encontrado" });
            }

            if (pet.OwnerId != userId && userRole != UserRole.Admin.ToString())
            {
                return BadRequest(new { message = "Pet não pertence ao usuário" });
            }

            // Validar se o serviço existe
            var service = await _context.Services.FirstOrDefaultAsync(s => s.Id == dto.ServiceId);
            if (service == null)
            {
                return BadRequest(new { message = "Serviço não encontrado" });
            }

            // Validar se a clínica existe
            var clinic = await _context.Clinics.FirstOrDefaultAsync(c => c.Id == dto.ClinicId);
            if (clinic == null)
            {
                return BadRequest(new { message = "Clínica não encontrada" });
            }

            // Validar se o serviço pertence à clínica
            if (service.ClinicId != dto.ClinicId)
            {
                return BadRequest(new { message = "Serviço não pertence à clínica selecionada" });
            }

            // Validar data do agendamento
            if (dto.ScheduledDate < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Data do agendamento não pode ser no passado" });
            }

            var appointment = new Appointment
            {
                Id = Guid.NewGuid(),
                PetId = dto.PetId,
                ServiceId = dto.ServiceId,
                ClinicId = dto.ClinicId,
                ScheduledDate = dto.ScheduledDate,
                Status = AppointmentStatus.Scheduled,
                Notes = dto.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Agendamento criado: {appointment.Id} para pet {dto.PetId}");

            return CreatedAtAction(nameof(GetAppointmentById), new { id = appointment.Id }, appointment);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao criar agendamento: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao criar agendamento" });
        }
    }

    /// <summary>
    /// Atualiza o status de um agendamento
    /// 
    /// Apenas Veterinários podem atualizar status
    /// </summary>
    [Authorize(Roles = "Veterinarian,Admin")]
    [HttpPut("{id}/status")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<Appointment>> UpdateAppointmentStatus(Guid id, [FromBody] UpdateAppointmentStatusDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            var appointment = await _context.Appointments
                .Include(a => a.Clinic)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
            {
                return NotFound(new { message = "Agendamento não encontrado" });
            }

            // Apenas Veterinários e Admin podem atualizar status
            // if (userRole != UserRole.Veterinarian.ToString() && userRole != UserRole.Admin.ToString())
            // {
            //     return Forbid();
            // }

            // Veterinário só pode atualizar agendamentos de suas clínicas
            if (userRole == UserRole.Veterinarian.ToString() && appointment.Clinic?.OwnerId != userId)
            {
                return Forbid();
            }

            appointment.Status = (AppointmentStatus)dto.Status;
            appointment.Result = dto.Result;
            appointment.PriceCharged = dto.PriceCharged;

            if (dto.Status == (int)AppointmentStatus.Completed)
            {
                appointment.CompletedDate = DateTime.UtcNow;
            }

            appointment.UpdatedAt = DateTime.UtcNow;

            _context.Appointments.Update(appointment);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Status do agendamento {id} atualizado para {dto.Status}");

            return Ok(appointment);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao atualizar status do agendamento: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao atualizar status do agendamento" });
        }
    }

    /// <summary>
    /// Deleta um agendamento
    /// 
    /// Apenas Tutores podem deletar seus agendamentos (se ainda não foram completados)
    /// </summary>
    [Authorize(Roles = "Tutor,Admin")]
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeleteAppointment(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            var appointment = await _context.Appointments
                .Include(a => a.Pet)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
            {
                return NotFound(new { message = "Agendamento não encontrado" });
            }

            // Verificar autorização
            bool isAuthorized = false;

            if (userRole == UserRole.Tutor.ToString())
            {
                // Tutor só pode deletar seus próprios agendamentos que ainda não foram completados
                isAuthorized = appointment.Pet?.OwnerId == userId && 
                              appointment.Status != AppointmentStatus.Completed;
            }
            else if (userRole == UserRole.Admin.ToString())
            {
                isAuthorized = true;
            }

            if (!isAuthorized)
            {
                return Forbid();
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Agendamento deletado: {id}");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao deletar agendamento: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao deletar agendamento" });
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