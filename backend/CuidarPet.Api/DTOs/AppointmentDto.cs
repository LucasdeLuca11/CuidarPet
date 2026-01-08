using CuidarPet.Api.Models;
/// <summary>
/// DTO para retornar agendamentos com dados relacionados
/// Adicione em: DTOs/AppointmentDto.cs
/// </summary>
public class AppointmentDto
{
    public Guid Id { get; set; }
    public Guid PetId { get; set; }
    public Guid ClinicId { get; set; }
    public Guid ServiceId { get; set; }
    public DateTime AppointmentDate { get; set; }
    public AppointmentStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Dados relacionados (para não fazer N+1 queries)
    public string? ServiceName { get; set; }
    public string? ClinicName { get; set; }
    public decimal ServicePrice { get; set; }
}