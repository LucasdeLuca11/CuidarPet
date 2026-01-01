using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CuidarPet.Api.Data;
using CuidarPet.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace CuidarPet.Api.Controllers;

/// <summary>
/// DTO para criar/atualizar pet
/// </summary>
public class CreatePetDto
{
    [Required(ErrorMessage = "Nome é obrigatório")]
    [StringLength(255, MinimumLength = 2, ErrorMessage = "Nome deve ter entre 2 e 255 caracteres")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Espécie é obrigatória")]
    [StringLength(100)]
    public string Species { get; set; } = string.Empty;

    [Required(ErrorMessage = "Raça é obrigatória")]
    [StringLength(100)]
    public string Breed { get; set; } = string.Empty;

    [Required(ErrorMessage = "Data de nascimento é obrigatória")]
    public DateTime DateOfBirth { get; set; }

    [Range(0.1, 500, ErrorMessage = "Peso deve estar entre 0.1 e 500 kg")]
    public decimal Weight { get; set; }

    [StringLength(1000)]
    public string? Notes { get; set; }
}

/// <summary>
/// Controller para gerenciar pets
/// 
/// Apenas Tutores podem criar e gerenciar seus próprios pets
/// Veterinários podem visualizar pets de seus clientes
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PetsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<PetsController> _logger;

    public PetsController(AppDbContext context, ILogger<PetsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Lista todos os pets do usuário autenticado
    /// 
    /// - Tutores: Veem seus próprios pets
    /// - Veterinários: Veem pets de seus clientes
    /// - Admin: Vê todos os pets
    /// </summary>
    [Authorize]
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<List<Pet>>> GetMyPets()
    {
        try
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            IQueryable<Pet> query = _context.Pets.Include(p => p.Owner);

            // Filtrar por role
            if (userRole == UserRole.Tutor.ToString())
            {
                // Tutores veem apenas seus pets
                query = query.Where(p => p.OwnerId == userId);
            }
            else if (userRole == UserRole.Veterinarian.ToString())
            {
                // Veterinários veem pets de seus clientes
                var clinicIds = await _context.Clinics
                    .Where(c => c.OwnerId == userId)
                    .Select(c => c.Id)
                    .ToListAsync();

                query = query.Where(p => _context.Appointments
                    .Where(a => clinicIds.Contains(a.ClinicId))
                    .Select(a => a.PetId)
                    .Contains(p.Id));
            }
            // Admin vê todos

            var pets = await query
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(pets);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao listar pets: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao listar pets" });
        }
    }

    /// <summary>
    /// Obtém detalhes de um pet específico
    /// </summary>
    [Authorize]
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<Pet>> GetPetById(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            var pet = await _context.Pets
                .Include(p => p.Owner)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (pet == null)
            {
                return NotFound(new { message = "Pet não encontrado" });
            }

            // Verificar autorização
            bool isAuthorized = false;

            if (userRole == UserRole.Tutor.ToString())
            {
                isAuthorized = pet.OwnerId == userId;
            }
            else if (userRole == UserRole.Veterinarian.ToString())
            {
                // Veterinário pode ver se tem agendamento com este pet
                isAuthorized = await _context.Appointments
                    .Where(a => a.PetId == id)
                    .Where(a => _context.Clinics
                        .Where(c => c.OwnerId == userId)
                        .Select(c => c.Id)
                        .Contains(a.ClinicId))
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

            return Ok(pet);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao obter pet: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao obter pet" });
        }
    }

    /// <summary>
    /// Cria um novo pet
    /// 
    /// Apenas Tutores podem criar pets
    /// </summary>
    [Authorize(Roles = "Tutor")]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<Pet>> CreatePet([FromBody] CreatePetDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            // Apenas Tutores podem criar pets
            // if (userRole != UserRole.Tutor.ToString() && userRole != UserRole.Admin.ToString())
            // {
            //     return Forbid();
            // }

            // Validar data de nascimento
            if (dto.DateOfBirth > DateTime.UtcNow)
            {
                return BadRequest(new { message = "Data de nascimento não pode ser no futuro" });
            }

            var pet = new Pet
            {
                Id = Guid.NewGuid(),
                Name = dto.Name,
                Species = dto.Species,
                Breed = dto.Breed,
                DateOfBirth = dto.DateOfBirth,
                Weight = dto.Weight,
                Notes = dto.Notes,
                OwnerId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Pets.Add(pet);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Pet criado: {pet.Name} (ID: {pet.Id}) para usuário {userId}");

            return CreatedAtAction(nameof(GetPetById), new { id = pet.Id }, pet);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao criar pet: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao criar pet" });
        }
    }

    /// <summary>
    /// Atualiza informações de um pet
    /// 
    /// Apenas o dono do pet pode atualizar
    /// </summary>
    [Authorize(Roles = "Tutor")]
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<Pet>> UpdatePet(Guid id, [FromBody] CreatePetDto dto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            var pet = await _context.Pets.FirstOrDefaultAsync(p => p.Id == id);

            if (pet == null)
            {
                return NotFound(new { message = "Pet não encontrado" });
            }

            // Verificar autorização
            if (pet.OwnerId != userId && userRole != UserRole.Admin.ToString())
            {
                return Forbid();
            }

            pet.Name = dto.Name;
            pet.Species = dto.Species;
            pet.Breed = dto.Breed;
            pet.DateOfBirth = dto.DateOfBirth;
            pet.Weight = dto.Weight;
            pet.Notes = dto.Notes;
            pet.UpdatedAt = DateTime.UtcNow;

            _context.Pets.Update(pet);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Pet atualizado: {pet.Name} (ID: {pet.Id})");

            return Ok(pet);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao atualizar pet: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao atualizar pet" });
        }
    }

    /// <summary>
    /// Deleta um pet
    /// 
    /// Apenas o dono do pet pode deletar
    /// </summary>
    [Authorize(Roles = "Tutor")]
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> DeletePet(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var userRole = GetCurrentUserRole();

            var pet = await _context.Pets.FirstOrDefaultAsync(p => p.Id == id);

            if (pet == null)
            {
                return NotFound(new { message = "Pet não encontrado" });
            }

            // Verificar autorização
            if (pet.OwnerId != userId && userRole != UserRole.Admin.ToString())
            {
                return Forbid();
            }

            _context.Pets.Remove(pet);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Pet deletado: {pet.Name} (ID: {pet.Id})");

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Erro ao deletar pet: {ex.Message}");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Erro ao deletar pet" });
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