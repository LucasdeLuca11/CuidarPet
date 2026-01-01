using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CuidarPet.Api.Models;

/// <summary>
/// Modelo de agendamento de serviço veterinário
/// 
/// Conecta um pet, um serviço e uma clínica
/// Rastreia o status do agendamento (Scheduled, Completed, Cancelled)
/// </summary>
[Table("appointments")]
public class Appointment
{
    /// <summary>
    /// Identificador único do agendamento
    /// </summary>
    [Key]
    public Guid Id { get; set; }

    /// <summary>
    /// ID do pet sendo atendido
    /// </summary>
    [Required]
    [ForeignKey("Pet")]
    public Guid PetId { get; set; }

    /// <summary>
    /// ID do serviço sendo realizado
    /// </summary>
    [Required]
    [ForeignKey("Service")]
    public Guid ServiceId { get; set; }

    /// <summary>
    /// ID da clínica realizando o serviço
    /// </summary>
    [Required]
    [ForeignKey("Clinic")]
    public Guid ClinicId { get; set; }

    /// <summary>
    /// Data e hora agendada do serviço
    /// </summary>
    [Required]
    public DateTime ScheduledDate { get; set; }

    /// <summary>
    /// Data e hora de conclusão (se realizado)
    /// </summary>
    public DateTime? CompletedDate { get; set; }

    /// <summary>
    /// Status do agendamento (Scheduled, Completed, Cancelled)
    /// </summary>
    [Required]
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;

    /// <summary>
    /// Resultado/observações do atendimento
    /// Preenchido após conclusão do serviço
    /// </summary>
    [StringLength(2000)]
    public string? Result { get; set; }

    /// <summary>
    /// Notas/observações do agendamento
    /// </summary>
    [StringLength(1000)]
    public string? Notes { get; set; }

    /// <summary>
    /// Valor cobrado pelo serviço
    /// </summary>
    public decimal? PriceCharged { get; set; }

    /// <summary>
    /// Data de criação do agendamento
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
    /// Pet sendo atendido
    /// </summary>
    [ForeignKey("PetId")]
    public virtual Pet Pet { get; set; } = null!;

    /// <summary>
    /// Serviço sendo realizado
    /// </summary>
    [ForeignKey("ServiceId")]
    public virtual Service Service { get; set; } = null!;

    /// <summary>
    /// Clínica realizando o serviço
    /// </summary>
    [ForeignKey("ClinicId")]
    public virtual Clinic Clinic { get; set; } = null!;

    /// <summary>
    /// Avaliação do agendamento (se houver) (NOVO)
    /// </summary>
    public virtual Review? Review { get; set; }
}