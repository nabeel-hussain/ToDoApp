interface ToDoTask {
   title: string;
   id: string;
   isDone: boolean;
   dueDate?: Date;
   creationDate: Date;
}

interface PaginationParams {
   pageNumber: number;
   pageSize: number;
   sortBy?: string;
   sortDirection?: 'asc' | 'desc';
   searchText?: string;
   status?: boolean | null;
}

interface PaginatedResponse<T> {
   data: T[];
   pageNumber: number;
   pageSize: number;
   totalRecords: number;
   totalPages: number;
   hasPreviousPage: boolean;
   hasNextPage: boolean;
}
