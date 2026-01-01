using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CuidarPet.Api.Models;

/// <summary>
/// Modelo de usuário do sistema CuidarPet
/// 
/// Suporta 3 tipos de usuários:
/// 1. Tutor: Dono de pets (cliente)
/// 2. Veterinário: Provedor de serviço (clínica/petshop)
/// 3. Admin: Gerenciador da plataforma
/// </summary>
[Table("users")]
public class User
{
    /// <summary>
    /// Identificador único do usuário
    /// </summary>
    [Key]
    public Guid Id { get; set; }

    /// <summary>
    /// Nome completo do usuário ou nome da empresa
    /// </summary>
    [Required]
    [StringLength(255)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Email do usuário (único)
    /// </summary>
    [Required]
    [EmailAddress]
    [StringLength(320)]
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Hash da senha do usuário (SHA256 ou bcrypt)
    /// </summary>
    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    /// <summary>
    /// Papel do usuário no sistema (Tutor, Veterinário, Admin)
    /// </summary>
    [Required]
    public UserRole Role { get; set; } = UserRole.Tutor;

    /// <summary>
    /// Telefone do usuário (opcional)
    /// </summary>
    [StringLength(20)]
    public string? Phone { get; set; }

    /// <summary>
    /// Método de login (ex: "email", "google", "facebook")
    /// </summary>
    [StringLength(64)]
    public string? LoginMethod { get; set; }

    // ========================================================================
    // CAMPOS ESPECÍFICOS PARA VETERINÁRIOS/PETSHOPS
    // ========================================================================

    /// <summary>
    /// Nome da empresa/clínica/petshop (apenas para Veterinários)
    /// </summary>
    [StringLength(255)]
    public string? CompanyName { get; set; }

    /// <summary>
    /// CNPJ da empresa (apenas para Veterinários)
    /// Formato: XX.XXX.XXX/XXXX-XX
    /// </summary>
    [StringLength(18)]
    public string? CompanyDocument { get; set; }

    /// <summary>
    /// Tipo de empresa (apenas para Veterinários)
    /// Ex: "Clínica", "PetShop", "Consultório", "Grooming"
    /// </summary>
    [StringLength(100)]
    public string? CompanyType { get; set; }

    /// <summary>
    /// Descrição da empresa/serviços oferecidos
    /// </summary>
    [StringLength(1000)]
    public string? CompanyDescription { get; set; }

    /// <summary>
    /// URL da logo/foto da empresa
    /// </summary>
    [StringLength(500)]
    public string? CompanyLogo { get; set; }

    // ========================================================================
    // CAMPOS DE STATUS E VERIFICAÇÃO
    // ========================================================================

    /// <summary>
    /// Indica se o email foi verificado
    /// </summary>
    public bool IsEmailVerified { get; set; } = false;

    /// <summary>
    /// Indica se a conta está ativa na plataforma
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Indica se a conta foi bloqueada (por violação de termos)
    /// </summary>
    public bool IsBlocked { get; set; } = false;

    /// <summary>
    /// Motivo do bloqueio (se aplicável)
    /// </summary>
    [StringLength(500)]
    public string? BlockReason { get; set; }

    /// <summary>
    /// Data em que a conta foi criada
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Data da última atualização
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Data do último login
    /// </summary>
    public DateTime? LastSignedIn { get; set; }

    // ========================================================================
    // RELACIONAMENTOS
    // ========================================================================

    /// <summary>
    /// Lista de pets do usuário (apenas se Tutor)
    /// </summary>
    public virtual List<Pet> Pets { get; set; } = new();

    /// <summary>
    /// Lista de clínicas/petshops do usuário (apenas se Veterinário)
    /// </summary>
    public virtual List<Clinic> Clinics { get; set; } = new();

    /// <summary>
    /// Lista de agendamentos do usuário
    /// </summary>
    public virtual List<Appointment> Appointments { get; set; } = new();

    /// <summary>
    /// Lista de avaliações feitas pelo usuário (apenas se Tutor)
    /// </summary>
    public virtual List<Review> Reviews { get; set; } = new();
}