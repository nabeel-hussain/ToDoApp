
using MediatR;
using TD.Application.Common.Models;
using TD.Domain.SlimEntities;

namespace TD.Application.ToDoTasks.Queries.GetToDoTaskList;

public sealed record GetAllToDoTasksQuery(
    int PageNumber = 1,
    int PageSize = 10,
    string? SortBy = null,
    string? SortDirection = "asc",
    string? SearchText = null,
    bool? Status = null
   ): IRequest<PaginatedResponse<SlimToDoTask>>;
