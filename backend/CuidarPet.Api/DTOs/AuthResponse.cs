using CuidarPet.Api.Models;

namespace CuidarPet.Api.DTOs;

/// <summary>
/// DTO para resposta de autenticação (login/registro)
/// </summary>
public class AuthResponse
{
    /// <summary>
    /// Token JWT para autenticação em requisições subsequentes
    /// </summary>
    public string Token { get; set; } = string.Empty;

    /// <summary>
    /// Tempo de expiração do token em segundos
    /// </summary>
    public int ExpiresIn { get; set; }

    /// <summary>
    /// Informações do usuário autenticado
    /// </summary>
    public UserDto User { get; set; } = null!;
}

/// <summary>
/// DTO com informações do usuário
/// </summary>
public class UserDto
{
    /// <summary>
    /// ID do usuário
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Nome do usuário
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Email do usuário
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Papel do usuário no sistema
    /// </summary>
    public UserRole Role { get; set; }

    /// <summary>
    /// Data de criação da conta
    /// </summary>
    public DateTime CreatedAt { get; set; }
}