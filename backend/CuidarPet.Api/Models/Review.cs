using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CuidarPet.Api.Models;

/// <summary>
/// Modelo de avaliação de serviço
/// 
/// Permite que tutores avaliem clínicas/petshops
/// Sistema similar ao Uber/iFood (1-5 estrelas + comentário)
/// </summary>
[Table("reviews")]
public class Review
{
    /// <summary>
    /// Identificador único da avaliação
    /// </summary>
    [Key]
    public Guid Id { get; set; }

    /// <summary>
    /// ID do tutor que fez a avaliação
    /// </summary>
    [Required]
    [ForeignKey("Tutor")]
    public Guid TutorId { get; set; }

    /// <summary>
    /// ID da clínica/petshop sendo avaliada
    /// </summary>
    [Required]
    [ForeignKey("Clinic")]
    public Guid ClinicId { get; set; }

    /// <summary>
    /// ID do agendamento relacionado (opcional)
    /// </summary>
    [ForeignKey("Appointment")]
    public Guid? AppointmentId { get; set; }

    /// <summary>
    /// Classificação em estrelas (1-5)
    /// </summary>
    [Required]
    [Range(1, 5, ErrorMessage = "A classificação deve estar entre 1 e 5 estrelas")]
    public int Rating { get; set; }

    /// <summary>
    /// Título da avaliação
    /// </summary>
    [StringLength(200)]
    public string? Title { get; set; }

    /// <summary>
    /// Comentário/descrição da avaliação
    /// </summary>
    [StringLength(2000)]
    public string? Comment { get; set; }

    /// <summary>
    /// Indica se a avaliação foi verificada (compra confirmada)
    /// </summary>
    public bool IsVerified { get; set; } = true;

    /// <summary>
    /// Indica se a avaliação foi moderada/aprovada
    /// </summary>
    public bool IsApproved { get; set; } = true;

    /// <summary>
    /// Motivo de rejeição (se aplicável)
    /// </summary>
    [StringLength(500)]
    public string? RejectionReason { get; set; }

    /// <summary>
    /// Data de criação da avaliação
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
    /// Tutor que fez a avaliação
    /// </summary>
    [ForeignKey("TutorId")]
    public virtual User Tutor { get; set; } = null!;

    /// <summary>
    /// Clínica/petshop sendo avaliada
    /// </summary>
    [ForeignKey("ClinicId")]
    public virtual Clinic Clinic { get; set; } = null!;

    /// <summary>
    /// Agendamento relacionado (se houver)
    /// </summary>
    [ForeignKey("AppointmentId")]
    public virtual Appointment? Appointment { get; set; }
}