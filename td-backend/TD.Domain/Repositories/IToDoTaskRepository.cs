using TD.Domain.Entities;

namespace TD.Domain.Repositories;

public interface IToDoTaskRepository
{
    Task AddAsync(ToDoTask toDoTask);
    Task UpdateAsync(ToDoTask toDoTask);
    Task<ToDoTask?> GetByIdAsync(Guid id);
    Task<IEnumerable<ToDoTask>> GetAllToDoTasksAsync();
    Task<(IEnumerable<ToDoTask> tasks, int totalCount)> GetPagedToDoTasksAsync(
        int pageNumber, 
        int pageSize, 
        string? sortBy, 
        string? sortDirection, 
        string? searchText, 
        bool? status);
}
