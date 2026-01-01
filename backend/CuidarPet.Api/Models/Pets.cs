using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CuidarPet.Api.Models;

/// <summary>
/// Modelo que representa um pet (animal de estimação)
/// </summary>
[Table("pets")]
public class Pet
{
    /// <summary>
    /// ID único do pet
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    /// <summary>
    /// Nome do pet
    /// </summary>
    [Required(ErrorMessage = "Nome é obrigatório")]
    [StringLength(255, MinimumLength = 2, ErrorMessage = "Nome deve ter entre 2 e 255 caracteres")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Espécie do pet (Cão, Gato, Coelho, etc)
    /// </summary>
    [Required(ErrorMessage = "Espécie é obrigatória")]
    [StringLength(100)]
    public string Species { get; set; } = string.Empty;

    /// <summary>
    /// Raça do pet
    /// </summary>
    [Required(ErrorMessage = "Raça é obrigatória")]
    [StringLength(100)]
    public string Breed { get; set; } = string.Empty;

    /// <summary>
    /// Data de nascimento do pet
    /// </summary>
    [Required(ErrorMessage = "Data de nascimento é obrigatória")]
    public DateTime DateOfBirth { get; set; }

    /// <summary>
    /// Peso do pet em quilogramas
    /// </summary>
    [Range(0.1, 500, ErrorMessage = "Peso deve estar entre 0.1 e 500 kg")]
    public decimal Weight { get; set; }

    /// <summary>
    /// Notas adicionais sobre o pet
    /// </summary>
    [StringLength(1000)]
    public string? Notes { get; set; }

    /// <summary>
    /// ID do proprietário (Tutor)
    /// </summary>
    [Required(ErrorMessage = "Proprietário é obrigatório")]
    public Guid OwnerId { get; set; }

    /// <summary>
    /// Data de criação do registro
    /// </summary>
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Data da última atualização
    /// </summary>
    [Required]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ========================================================================
    // RELACIONAMENTOS
    // ========================================================================

    /// <summary>
    /// Proprietário do pet (Tutor)
    /// </summary>
    [ForeignKey("OwnerId")]
    public User? Owner { get; set; }

    /// <summary>
    /// Agendamentos deste pet
    /// </summary>
    public List<Appointment> Appointments { get; set; } = new();
}