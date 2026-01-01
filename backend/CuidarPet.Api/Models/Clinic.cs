using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CuidarPet.Api.Models;

/// <summary>
/// Modelo de clínica veterinária ou petshop
/// 
/// Representa um provedor de serviço na plataforma CuidarPet
/// Pode ser uma clínica, petshop, consultório, grooming, etc
/// </summary>
[Table("clinics")]
public class Clinic
{
    /// <summary>
    /// Identificador único da clínica
    /// </summary>
    [Key]
    public Guid Id { get; set; }

    /// <summary>
    /// ID do veterinário/proprietário da clínica
    /// </summary>
    [Required]
    [ForeignKey("Owner")]
    public Guid OwnerId { get; set; }

    /// <summary>
    /// Nome da clínica/petshop
    /// </summary>
    [Required]
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Endereço da clínica
    /// </summary>
    [StringLength(500)]
    public string? Address { get; set; }

    /// <summary>
    /// Cidade
    /// </summary>
    [StringLength(100)]
    public string? City { get; set; }

    /// <summary>
    /// Estado/Província
    /// </summary>
    [StringLength(2)]
    public string? State { get; set; }

    /// <summary>
    /// CEP/Código postal
    /// </summary>
    [StringLength(20)]
    public string? ZipCode { get; set; }

    /// <summary>
    /// Telefone de contato
    /// </summary>
    [StringLength(20)]
    public string? Phone { get; set; }

    /// <summary>
    /// Email de contato
    /// </summary>
    [EmailAddress]
    [StringLength(320)]
    public string? Email { get; set; }

    /// <summary>
    /// Horário de funcionamento (ex: "Seg-Sex: 8h-18h, Sab: 8h-12h")
    /// </summary>
    [StringLength(500)]
    public string? BusinessHours { get; set; }

    /// <summary>
    /// Descrição da clínica/serviços
    /// </summary>
    [StringLength(2000)]
    public string? Description { get; set; }

    /// <summary>
    /// URL da foto/logo da clínica
    /// </summary>
    [StringLength(500)]
    public string? PhotoUrl { get; set; }

    /// <summary>
    /// Avaliação média da clínica (1-5 estrelas)
    /// Calculada a partir das reviews
    /// </summary>
    public double? AverageRating { get; set; }

    /// <summary>
    /// Número total de avaliações
    /// </summary>
    public int TotalReviews { get; set; } = 0;

    /// <summary>
    /// Indica se a clínica está ativa
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Indica se a clínica foi verificada (validada pelo admin)
    /// </summary>
    public bool IsVerified { get; set; } = false;

    /// <summary>
    /// Data de criação
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
    /// Proprietário/Veterinário da clínica
    /// </summary>
    [ForeignKey("OwnerId")]
    public virtual User Owner { get; set; } = null!;

    /// <summary>
    /// Lista de serviços oferecidos pela clínica
    /// </summary>
    public virtual List<Service> Services { get; set; } = new();

    /// <summary>
    /// Lista de agendamentos da clínica
    /// </summary>
    public virtual List<Appointment> Appointments { get; set; } = new();

    /// <summary>
    /// Lista de funcionários da clínica (NOVO)
    /// </summary>
    public virtual List<Employee> Employees { get; set; } = new();

    /// <summary>
    /// Lista de avaliações da clínica (NOVO)
    /// </summary>
    public virtual List<Review> Reviews { get; set; } = new();
}