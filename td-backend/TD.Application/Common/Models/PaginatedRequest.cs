namespace TD.Application.Common.Models;

public class PaginatedRequest
{
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; }
    public string? SortDirection { get; set; } = "asc";
    public string? SearchText { get; set; }
    public bool? Status { get; set; } // null = all, true = done, false = pending
}
