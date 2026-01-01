using CuidarPet.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CuidarPet.Api.Data;

/// <summary>
/// Contexto do banco de dados para CuidarPet
/// 
/// Gerencia todas as entidades:
/// - Users (Tutores, Veterinários, Admin)
/// - Pets
/// - Clinics
/// - Services
/// - Appointments
/// - Employees
/// - Reviews
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // ========================================================================
    // DBSETS - TABELAS DO BANCO DE DADOS
    // ========================================================================

    /// <summary>
    /// Tabela de usuários (Tutores, Veterinários, Admin)
    /// </summary>
    public DbSet<User> Users { get; set; } = null!;

    /// <summary>
    /// Tabela de pets
    /// </summary>
    public DbSet<Pet> Pets { get; set; } = null!;

    /// <summary>
    /// Tabela de clínicas/petshops
    /// </summary>
    public DbSet<Clinic> Clinics { get; set; } = null!;

    /// <summary>
    /// Tabela de serviços
    /// </summary>
    public DbSet<Service> Services { get; set; } = null!;

    /// <summary>
    /// Tabela de agendamentos
    /// </summary>
    public DbSet<Appointment> Appointments { get; set; } = null!;

    /// <summary>
    /// Tabela de funcionários (NOVO)
    /// </summary>
    public DbSet<Employee> Employees { get; set; } = null!;

    /// <summary>
    /// Tabela de avaliações (NOVO)
    /// </summary>
    public DbSet<Review> Reviews { get; set; } = null!;

    // ========================================================================
    // CONFIGURAÇÃO DO MODELO
    // ========================================================================

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ====================================================================
        // CONFIGURAÇÃO: USER
        // ====================================================================

        modelBuilder.Entity<User>(entity =>
        {
            // Índices
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Role);
            entity.HasIndex(e => e.IsActive);
            entity.HasIndex(e => e.IsBlocked);

            // Relacionamentos
            entity.HasMany(e => e.Pets)
                .WithOne(p => p.Owner)
                .HasForeignKey(p => p.OwnerId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Clinics)
                .WithOne(c => c.Owner)
                .HasForeignKey(c => c.OwnerId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Appointments)
                .WithOne()
                .HasForeignKey("UserId")
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Reviews)
                .WithOne(r => r.Tutor)
                .HasForeignKey(r => r.TutorId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ====================================================================
        // CONFIGURAÇÃO: PET
        // ====================================================================

        modelBuilder.Entity<Pet>(entity =>
        {
            // Índices
            entity.HasIndex(e => e.OwnerId);
            entity.HasIndex(e => e.Species);

            // Relacionamentos
            entity.HasMany(e => e.Appointments)
                .WithOne(a => a.Pet)
                .HasForeignKey(a => a.PetId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ====================================================================
        // CONFIGURAÇÃO: CLINIC
        // ====================================================================

        modelBuilder.Entity<Clinic>(entity =>
        {
            // Índices
            entity.HasIndex(e => e.OwnerId);
            entity.HasIndex(e => e.IsActive);
            entity.HasIndex(e => e.IsVerified);
            entity.HasIndex(e => e.City);

            // Relacionamentos
            entity.HasMany(e => e.Services)
                .WithOne(s => s.Clinic)
                .HasForeignKey(s => s.ClinicId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Appointments)
                .WithOne(a => a.Clinic)
                .HasForeignKey(a => a.ClinicId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Employees)
                .WithOne(emp => emp.Clinic)
                .HasForeignKey(emp => emp.ClinicId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Reviews)
                .WithOne(r => r.Clinic)
                .HasForeignKey(r => r.ClinicId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ====================================================================
        // CONFIGURAÇÃO: SERVICE
        // ====================================================================

        modelBuilder.Entity<Service>(entity =>
        {
            // Índices
            entity.HasIndex(e => e.ClinicId);
            entity.HasIndex(e => e.IsActive);

            // Relacionamentos
            entity.HasMany(e => e.Appointments)
                .WithOne(a => a.Service)
                .HasForeignKey(a => a.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ====================================================================
        // CONFIGURAÇÃO: APPOINTMENT
        // ====================================================================

        modelBuilder.Entity<Appointment>(entity =>
        {
            // Índices
            entity.HasIndex(e => e.PetId);
            entity.HasIndex(e => e.ClinicId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.ScheduledDate);

            // Relacionamentos
            entity.HasOne(e => e.Review)
                .WithOne(r => r.Appointment)
                .HasForeignKey<Review>(r => r.AppointmentId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ====================================================================
        // CONFIGURAÇÃO: EMPLOYEE
        // ====================================================================

        modelBuilder.Entity<Employee>(entity =>
        {
            // Índices
            entity.HasIndex(e => e.ClinicId);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => e.IsActive);

            // Relacionamentos
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Clinic)
                .WithMany(c => c.Employees)
                .HasForeignKey(e => e.ClinicId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ====================================================================
        // CONFIGURAÇÃO: REVIEW
        // ====================================================================

        modelBuilder.Entity<Review>(entity =>
        {
            // Índices
            entity.HasIndex(e => e.ClinicId);
            entity.HasIndex(e => e.TutorId);
            entity.HasIndex(e => e.Rating);
            entity.HasIndex(e => e.IsApproved);

            // Relacionamentos
            entity.HasOne(e => e.Tutor)
                .WithMany(u => u.Reviews)
                .HasForeignKey(e => e.TutorId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Clinic)
                .WithMany(c => c.Reviews)
                .HasForeignKey(e => e.ClinicId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Appointment)
                .WithOne(a => a.Review)
                .HasForeignKey<Review>(e => e.AppointmentId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ====================================================================
        // SEED DATA (DADOS INICIAIS)
        // ====================================================================

        // Você pode adicionar dados iniciais aqui se necessário
        // Exemplo:
        // modelBuilder.Entity<UserRole>().HasData(
        //     new UserRole { Id = 0, Name = "Tutor" },
        //     new UserRole { Id = 1, Name = "Veterinarian" },
        //     new UserRole { Id = 2, Name = "Admin" }
        // );
    }
}