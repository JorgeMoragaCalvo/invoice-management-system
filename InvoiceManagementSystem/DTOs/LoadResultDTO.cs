namespace InvoiceManagementSystem.DTOs;

public class LoadResultDTO
{
    public int TotalProcessed { get; set; }
    public int Loaded { get; set; }
    public int DuplicatesSkipped { get; set; }
    public int InconsistentCount { get; set; }

    public LoadResultDTO(int totalProcessed, int loaded, int duplicatesSkipped, int inconsistentCount)
    {
        TotalProcessed = totalProcessed;
        Loaded = loaded;
        DuplicatesSkipped = duplicatesSkipped;
        InconsistentCount = inconsistentCount;
    }
}