using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using TD.Domain.Entities;
using TD.Domain.Repositories;

namespace TD.Infrastructure.Repositories;

internal sealed class ToDoTaskRepository : IToDoTaskRepository
{
    private readonly ToDoDbContext _toDoDbContext;
    public ToDoTaskRepository(ToDoDbContext toDoDbContext)
    {
        _toDoDbContext = toDoDbContext;
    }
    public async Task AddAsync(ToDoTask toDoTask)
    {
        await _toDoDbContext.ToDoTasks.AddAsync(toDoTask);
        await _toDoDbContext.SaveChangesAsync();
    }

    public async Task<IEnumerable<ToDoTask>> GetAllToDoTasksAsync()
    {
        return await _toDoDbContext.ToDoTasks.ToListAsync();
    }

    public async Task<ToDoTask?> GetByIdAsync(Guid id)
    {
        return await _toDoDbContext.ToDoTasks.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task UpdateAsync(ToDoTask toDoTask)
    {
         _toDoDbContext.Update(toDoTask);
        await _toDoDbContext.SaveChangesAsync();
    }

    public async Task<(IEnumerable<ToDoTask> tasks, int totalCount)> GetPagedToDoTasksAsync(
        int pageNumber, 
        int pageSize, 
        string? sortBy, 
        string? sortDirection, 
        string? searchText, 
        bool? status)
    {
        var query = _toDoDbContext.ToDoTasks.AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(t => t.IsDone == status.Value);
        }

        if (!string.IsNullOrWhiteSpace(searchText))
        {
            query = query.Where(t => t.Title.Contains(searchText) || 
                                   (t.Description != null && t.Description.Contains(searchText)));
        }

        var totalCount = await query.CountAsync();

        if (!string.IsNullOrWhiteSpace(sortBy))
        {
            var sortDirection_lower = sortDirection?.ToLower() ?? "asc";
            query = sortBy.ToLower() switch
            {
                "title" => sortDirection_lower == "desc" 
                    ? query.OrderByDescending(t => t.Title)
                    : query.OrderBy(t => t.Title),
                "duedate" => sortDirection_lower == "desc"
                    ? query.OrderByDescending(t => t.DueDate)
                    : query.OrderBy(t => t.DueDate),
                "isdone" => sortDirection_lower == "desc"
                    ? query.OrderByDescending(t => t.IsDone)
                    : query.OrderBy(t => t.IsDone),
                "creationdate" => sortDirection_lower == "desc"
                    ? query.OrderByDescending(t => t.CreationDate)
                    : query.OrderBy(t => t.CreationDate),
                _ => query.OrderByDescending(t => t.CreationDate)
            };
        }
        else
        {
            query = query.OrderByDescending(t => t.CreationDate);
        }

        var tasks = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (tasks, totalCount);
    }
}
