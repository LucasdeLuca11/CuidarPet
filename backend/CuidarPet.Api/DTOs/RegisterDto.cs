using System.ComponentModel.DataAnnotations;
using CuidarPet.Api.Models;

namespace CuidarPet.Api.DTOs;

/// <summary>
/// DTO para registro de novo usuário
/// 
/// Suporta 3 tipos de usuários:
/// 1. Tutor (role: 0) - Dono de pets
/// 2. Veterinário (role: 1) - Provedor de serviço
/// 3. Admin (role: 2) - Gerenciador da plataforma
/// </summary>
public class RegisterDto
{
    /// <summary>
    /// Nome completo do usuário ou nome da empresa
    /// </summary>
    [Required(ErrorMessage = "Nome é obrigatório")]
    [StringLength(255, MinimumLength = 3, ErrorMessage = "Nome deve ter entre 3 e 255 caracteres")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Email do usuário
    /// </summary>
    [Required(ErrorMessage = "Email é obrigatório")]
    [EmailAddress(ErrorMessage = "Email inválido")]
    [StringLength(320)]
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Senha do usuário
    /// </summary>
    [Required(ErrorMessage = "Senha é obrigatória")]
    [StringLength(255, MinimumLength = 8, ErrorMessage = "Senha deve ter no mínimo 8 caracteres")]
    [RegularExpression(
        @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]{8,}$",
        ErrorMessage = "Senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais"
    )]
    public string Password { get; set; } = string.Empty;

    /// <summary>
    /// Confirmação de senha
    /// </summary>
    [Required(ErrorMessage = "Confirmação de senha é obrigatória")]
    [Compare("Password", ErrorMessage = "As senhas não conferem")]
    public string ConfirmPassword { get; set; } = string.Empty;

    /// <summary>
    /// Papel do usuário (0: Tutor, 1: Veterinário, 2: Admin)
    /// </summary>
    [Required(ErrorMessage = "Papel é obrigatório")]
    [Range(0, 2, ErrorMessage = "Papel inválido (0: Tutor, 1: Veterinário, 2: Admin)")]
    public int Role { get; set; }

    /// <summary>
    /// Telefone do usuário (opcional)
    /// </summary>
    [Phone(ErrorMessage = "Telefone inválido")]
    [StringLength(20)]
    public string? Phone { get; set; }

    // ========================================================================
    // CAMPOS ESPECÍFICOS PARA VETERINÁRIOS (role: 1)
    // ========================================================================

    /// <summary>
    /// Nome da empresa/clínica/petshop (obrigatório para Veterinários)
    /// </summary>
    [StringLength(255, MinimumLength = 3, ErrorMessage = "Nome da empresa deve ter entre 3 e 255 caracteres")]
    public string? CompanyName { get; set; }

    /// <summary>
    /// CNPJ da empresa (obrigatório para Veterinários)
    /// Formato: XX.XXX.XXX/XXXX-XX
    /// </summary>
    [StringLength(18)]
    [RegularExpression(@"^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$", ErrorMessage = "CNPJ inválido")]
    public string? CompanyDocument { get; set; }

    /// <summary>
    /// Tipo de empresa (obrigatório para Veterinários)
    /// </summary>
    public CompanyType? CompanyType { get; set; }

    /// <summary>
    /// Descrição da empresa/serviços oferecidos (opcional)
    /// </summary>
    [StringLength(1000)]
    public string? CompanyDescription { get; set; }

    // ========================================================================
    // VALIDAÇÃO CUSTOMIZADA
    // ========================================================================

    /// <summary>
    /// Valida os dados de registro
    /// </summary>
    public bool IsValid(out List<string> errors)
    {
        errors = new List<string>();

        // Validar campos obrigatórios para Veterinários
        if (Role == (int)UserRole.Veterinarian)
        {
            if (string.IsNullOrWhiteSpace(CompanyName))
                errors.Add("Nome da empresa é obrigatório para Veterinários");

            if (string.IsNullOrWhiteSpace(CompanyDocument))
                errors.Add("CNPJ é obrigatório para Veterinários");

            if (!CompanyType.HasValue)
                errors.Add("Tipo de empresa é obrigatório para Veterinários");
        }

        // Admin não pode ser registrado via API (apenas pelo sistema)
        if (Role == (int)UserRole.Admin)
            errors.Add("Não é permitido registrar Admin via API");

        return errors.Count == 0;
    }
}