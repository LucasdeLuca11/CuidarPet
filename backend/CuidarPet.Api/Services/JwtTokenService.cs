using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CuidarPet.Api.Models;
using Microsoft.IdentityModel.Tokens;

namespace CuidarPet.Api.Services;

/// <summary>
/// Serviço para gerar e validar tokens JWT
/// </summary>
public interface IJwtTokenService
{
    /// <summary>
    /// Gera um token JWT para o usuário
    /// </summary>
    string GenerateToken(User user);

    /// <summary>
    /// Valida um token JWT
    /// </summary>
    ClaimsPrincipal? ValidateToken(string token);
}

/// <summary>
/// Implementação do serviço de tokens JWT
/// </summary>
public class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _configuration;
    private readonly string _secretKey;
    private readonly string _issuer;
    private readonly string _audience;
    private readonly int _expirationMinutes;

    public JwtTokenService(IConfiguration configuration)
    {
        _configuration = configuration;
        _secretKey = configuration["Jwt:SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey não configurado");
        _issuer = configuration["Jwt:Issuer"] ?? "CuidarPet";
        _audience = configuration["Jwt:Audience"] ?? "CuidarPetUsers";
        _expirationMinutes = int.Parse(configuration["Jwt:ExpirationMinutes"] ?? "1440"); // 24 horas por padrão
    }

    /// <summary>
    /// Gera um token JWT com claims do usuário
    /// </summary>
    public string GenerateToken(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            // new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim("role", user.Role.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_expirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    /// <summary>
    /// Valida um token JWT e retorna os claims
    /// </summary>
    public ClaimsPrincipal? ValidateToken(string token)
    {
        try
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = securityKey,
                ValidateIssuer = true,
                ValidIssuer = _issuer,
                ValidateAudience = true,
                ValidAudience = _audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return principal;
        }
        catch
        {
            return null;
        }
    }
}