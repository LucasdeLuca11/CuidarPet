using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CuidarPet.Api.Models;

/// <summary>
/// Modelo de funcionário de clínica/petshop
/// 
/// Permite que veterinários gerenciem seus funcionários
/// Ex: Recepcionista, Auxiliar, Tosador, etc
/// </summary>
[Table("employees")]
public class Employee
{
    /// <summary>
    /// Identificador único do funcionário
    /// </summary>
    [Key]
    public Guid Id { get; set; }

    /// <summary>
    /// ID do usuário associado ao funcionário
    /// </summary>
    [Required]
    [ForeignKey("User")]
    public Guid UserId { get; set; }

    /// <summary>
    /// ID da clínica/petshop onde trabalha
    /// </summary>
    [Required]
    [ForeignKey("Clinic")]
    public Guid ClinicId { get; set; }

    /// <summary>
    /// Cargo/função do funcionário
    /// Ex: "Veterinário", "Recepcionista", "Tosador", "Auxiliar"
    /// </summary>
    [Required]
    [StringLength(100)]
    public string Position { get; set; } = string.Empty;

    /// <summary>
    /// Descrição das responsabilidades
    /// </summary>
    [StringLength(500)]
    public string? Description { get; set; }

    /// <summary>
    /// Indica se o funcionário está ativo
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Data de contratação
    /// </summary>
    public DateTime HiredAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Data de demissão (se aplicável)
    /// </summary>
    public DateTime? FiredAt { get; set; }

    /// <summary>
    /// Data de criação do registro
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Data da última atualização
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // ========================================================================
    // RELACIONAMENTOS
    // ========================================================================

    /// <summary>
    /// Usuário associado ao funcionário
    /// </summary>
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;

    /// <summary>
    /// Clínica onde o funcionário trabalha
    /// </summary>
    [ForeignKey("ClinicId")]
    public virtual Clinic Clinic { get; set; } = null!;
}