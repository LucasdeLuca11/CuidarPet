using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CuidarPet.Api.Models;

/// <summary>
/// Modelo que representa um serviço oferecido por uma clínica
/// </summary>
[Table("services")]
public class Service
{
    /// <summary>
    /// ID único do serviço
    /// </summary>
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public Guid Id { get; set; }

    /// <summary>
    /// Nome do serviço (ex: Consulta, Vacinação, Banho)
    /// </summary>
    [Required(ErrorMessage = "Nome do serviço é obrigatório")]
    [StringLength(255, MinimumLength = 3, ErrorMessage = "Nome deve ter entre 3 e 255 caracteres")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Descrição detalhada do serviço
    /// </summary>
    [StringLength(2000)]
    public string? Description { get; set; }

    /// <summary>
    /// Preço do serviço em reais
    /// </summary>
    [Required(ErrorMessage = "Preço é obrigatório")]
    [Range(0.01, 100000, ErrorMessage = "Preço deve estar entre 0.01 e 100000")]
    public decimal Price { get; set; }

    /// <summary>
    /// Duração do serviço em minutos
    /// </summary>
    [Range(5, 480, ErrorMessage = "Duração deve estar entre 5 e 480 minutos")]
    public int? Duration { get; set; }

    /// <summary>
    /// Indica se o serviço está ativo
    /// </summary>
    [Required]
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// ID da clínica que oferece o serviço
    /// </summary>
    [Required(ErrorMessage = "Clínica é obrigatória")]
    public Guid ClinicId { get; set; }

    /// <summary>
    /// Data de criação do serviço
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
    /// Clínica que oferece este serviço
    /// </summary>
    [ForeignKey("ClinicId")]
    public Clinic? Clinic { get; set; }

    /// <summary>
    /// Agendamentos deste serviço
    /// </summary>
    public List<Appointment> Appointments { get; set; } = new();
}