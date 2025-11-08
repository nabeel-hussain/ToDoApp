import httpClient from 'shared/http/httpClient';
import { dateToMidnightUTCISO } from 'utils/formatting';

export const getTasks = async (params?: PaginationParams): Promise<PaginatedResponse<ToDoTask>> => {
   const queryParams = {
      pageNumber: params?.pageNumber || 1,
      pageSize: params?.pageSize || 10,
      sortBy: params?.sortBy,
      sortDirection: params?.sortDirection,
      searchText: params?.searchText,
      status: params?.status
   };
   
   const res = await httpClient.get('/api/ToDoTask/Get', { params: queryParams });
   const result: PaginatedResponse<ToDoTask> = res.data;
   return result;
};

export const addTask = async (title: string, dueDate?: Date | null): Promise<ToDoTask> => {
   const dueDateISO = dateToMidnightUTCISO(dueDate);
   const res = await httpClient.post('/api/ToDoTask/Create', { title, dueDate: dueDateISO });
   const result: ToDoTask = res.data;
   return result;
};

export const updateTask = async (toDoTask: ToDoTask): Promise<ToDoTask> => {
   // Convert dueDate to ISO string at midnight UTC to preserve the selected date
   const updatedTask = { ...toDoTask };
   updatedTask.dueDate = dateToMidnightUTCISO(updatedTask.dueDate) as any;
   
   const res = await httpClient.put('/api/ToDoTask/Update', updatedTask);
   const result: ToDoTask = res.data;
   return result;
};

export const deleteTask = async (id: string): Promise<void> => {
   await httpClient.delete('/api/ToDoTask/Delete', { params: { id } });
};
