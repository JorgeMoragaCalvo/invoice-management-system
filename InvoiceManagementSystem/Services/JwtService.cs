using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace InvoiceManagementSystem.Services;

public class JwtService
{
    private readonly string _secret;
    private readonly long _expirationMs;

    public JwtService(IConfiguration configuration)
    {
        _secret = configuration["Jwt:Secret"]!;
        _expirationMs = long.Parse(configuration["Jwt:ExpirationMs"]!);
    }

    public string GenerateToken(string username)
    {
        var keyBytes = Convert.FromBase64String(_secret);
        var securityKey = new SymmetricSecurityKey(keyBytes);
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, username),
            new Claim(JwtRegisteredClaimNames.Iat,
                DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
                ClaimValueTypes.Integer64)
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddMilliseconds(_expirationMs),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string? ExtractUsername(string token)
    {
        try
        {
            var handler = new JwtSecurityTokenHandler();
            var keyBytes = Convert.FromBase64String(_secret);
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
                ClockSkew = TimeSpan.Zero
            };

            var principal = handler.ValidateToken(token, validationParameters, out _);
            return principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        }
        catch
        {
            return null;
        }
    }

    public bool IsTokenValid(string token, string username)
    {
        var extractedUsername = ExtractUsername(token);
        return extractedUsername != null && extractedUsername == username;
    }
}