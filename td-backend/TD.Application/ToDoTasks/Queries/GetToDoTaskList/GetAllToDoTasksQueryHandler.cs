using AutoMapper;
using MediatR;
using TD.Application.Common.Models;
using TD.Domain.Entities;
using TD.Domain.Repositories;
using TD.Domain.SlimEntities;

namespace TD.Application.ToDoTasks.Queries.GetToDoTaskList;

public sealed class GetAllToDoTasksQueryHandler : IRequestHandler<GetAllToDoTasksQuery, PaginatedResponse<SlimToDoTask>>
{
    private readonly IToDoTaskRepository _toDoTaskRepository;
    private readonly IMapper _mapper;

    public GetAllToDoTasksQueryHandler(IToDoTaskRepository toDoTaskRepository, IMapper mapper)
    {
        _toDoTaskRepository = toDoTaskRepository;
        _mapper = mapper;
    }
    public async Task<PaginatedResponse<SlimToDoTask>> Handle(GetAllToDoTasksQuery request, CancellationToken cancellationToken)
    {
        var (toDoTasks, totalCount) = await _toDoTaskRepository.GetPagedToDoTasksAsync(
            request.PageNumber,
            request.PageSize,
            request.SortBy,
            request.SortDirection,
            request.SearchText,
            request.Status
        );
        
        var mappedTasks = _mapper.Map<List<SlimToDoTask>>(toDoTasks);
        
        var totalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize);
        
        var response = new PaginatedResponse<SlimToDoTask>
        {
            Data = mappedTasks,
            PageNumber = request.PageNumber,
            PageSize = request.PageSize,
            TotalRecords = totalCount,
            TotalPages = totalPages
        };
        
        return response;
    }
}
