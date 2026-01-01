using System.ComponentModel.DataAnnotations;

namespace CuidarPet.Api.DTOs;

/// <summary>
/// DTO para criar um novo animal de estimação
/// </summary>
public class CreatePetDto
{
    /// <summary>
    /// Nome do animal
    /// </summary>
    [Required(ErrorMessage = "Nome do pet é obrigatório")]
    [StringLength(255, MinimumLength = 1, ErrorMessage = "Nome deve ter entre 1 e 255 caracteres")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Espécie do animal (Cão, Gato, Coelho, etc)
    /// </summary>
    [Required(ErrorMessage = "Espécie é obrigatória")]
    [StringLength(100)]
    public string Species { get; set; } = string.Empty;

    /// <summary>
    /// Raça do animal (opcional)
    /// </summary>
    [StringLength(100)]
    public string? Breed { get; set; }

    /// <summary>
    /// Data de nascimento do animal (opcional)
    /// </summary>
    public DateTime? DateOfBirth { get; set; }

    /// <summary>
    /// Peso do animal em kg (opcional)
    /// </summary>
    [Range(0.1, 500, ErrorMessage = "Peso deve estar entre 0.1 e 500 kg")]
    public decimal? Weight { get; set; }

    /// <summary>
    /// Notas adicionais sobre o animal
    /// </summary>
    [StringLength(1000)]
    public string? Notes { get; set; }
}