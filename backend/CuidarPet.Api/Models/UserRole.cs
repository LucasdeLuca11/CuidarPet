namespace CuidarPet.Api.Models;

/// <summary>
/// Enum que define os papéis de usuário no sistema CuidarPet
/// 
/// CuidarPet é uma plataforma tipo iFood para serviços veterinários:
/// - Tutores: Donos de pets que procuram serviços
/// - Veterinários: Provedores de serviço (clínicas, petshops)
/// - Admin: Gerenciador da plataforma (você)
/// </summary>
public enum UserRole
{
    /// <summary>
    /// Tutor - Dono de animal de estimação (Cliente Final)
    /// 
    /// Permissões:
    /// - Criar e gerenciar seus pets
    /// - Buscar veterinários e serviços
    /// - Marcar agendamentos
    /// - Avaliar serviços
    /// - Ver histórico de atendimentos
    /// </summary>
    Tutor = 0,

    /// <summary>
    /// Veterinário - Provedor de serviço (Clínica, PetShop, Profissional)
    /// 
    /// Permissões:
    /// - Criar e gerenciar clínica/petshop
    /// - Criar e gerenciar serviços
    /// - Gerenciar agendamentos
    /// - Gerenciar funcionários
    /// - Ver avaliações e relatórios
    /// </summary>
    Veterinarian = 1,

    /// <summary>
    /// Admin - Administrador da plataforma (Você)
    /// 
    /// Permissões:
    /// - Acesso total ao sistema
    /// - Gerenciar usuários
    /// - Moderar conteúdo
    /// - Ver analytics e relatórios
    /// - Bloquear/desbloquear usuários
    /// </summary>
    Admin = 2
}