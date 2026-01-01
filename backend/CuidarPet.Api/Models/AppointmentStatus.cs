namespace CuidarPet.Api.Models;

/// <summary>
/// Enum que define os status possíveis de um agendamento
/// </summary>
public enum AppointmentStatus
{
    /// <summary>
    /// Agendamento marcado/pendente
    /// </summary>
    Scheduled = 0,

    /// <summary>
    /// Agendamento completado/realizado
    /// </summary>
    Completed = 1,

    /// <summary>
    /// Agendamento cancelado
    /// </summary>
    Cancelled = 2
}