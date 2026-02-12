namespace InvoiceManagementSystem.DTOs;

public class AuthResponseDTO
{
    public string Token { get; set; }

    public AuthResponseDTO(string token)
    {
        Token = token;
    }
}