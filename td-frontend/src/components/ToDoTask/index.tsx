import React, { useEffect, useState } from 'react';
import AddTask from 'components/ToDoTask/AddTask';
import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import TaskList from 'components/ToDoTask/TaskList';
import { addTask, deleteTask, getTasks, updateTask } from 'api/todotask';
import { ToastContainer, toast } from 'react-toastify';

const ToDoTask: React.FC = () => {

   const [taskList, setTaskList] = useState<ToDoTask[]>([]); 
   const [loading, setLoading] = useState<boolean>(false);
   const [paginationData, setPaginationData] = useState<PaginatedResponse<ToDoTask>>({
      data: [],
      pageNumber: 1,
      pageSize: 10,
      totalRecords: 0,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false
   });
   const [paginationParams, setPaginationParams] = useState<PaginationParams>({
      pageNumber: 1,
      pageSize: 10,
      sortBy: undefined,
      sortDirection: 'asc',
      searchText: undefined,
      status: undefined
   });

   // useEffect hook to fetch tasks when the component mounts or pagination params change
   useEffect(() => {
      getToDoAllTasks().then().catch();
   }, [paginationParams]);

   // Function to add a new task
   const AddNewTask = async (title: string, dueDate?: Date | null): Promise<void> => {
      setLoading(true);
      await addTask(title, dueDate).then(()=>toast.success('The task has been successfully added.')).catch(()=>{ setLoading(false); });
      setLoading(false);
      // Refresh the task list
      await getToDoAllTasks().then().catch();
   };

   // Function to fetch all tasks with pagination
   const getToDoAllTasks = async (): Promise<void> => {
      setLoading(true);
      const response = await getTasks(paginationParams).then().catch();
      if (response) {
         setPaginationData(response);
         setTaskList(response.data); // Update the task list with fetched tasks
      }
      setLoading(false);
   };

   // Function to handle task deletion
   const handleDeleteToDoTask = async (id: string): Promise<void> => {
      setLoading(true);
      await deleteTask(id).then(()=>toast.success('The task has been successfully deleted.')).catch(()=>{ setLoading(false); });
      setLoading(false);
      // Refresh the task list
      await getToDoAllTasks();
   };

   // Function to handle task status change
   const handleToDoTaskStatusChange = async (toDoTask: ToDoTask): Promise<void> => {
      setLoading(true);
      await updateTask({ ...toDoTask, isDone: !toDoTask.isDone }).then(()=>!toDoTask.isDone && toast.success('Great! The task has been marked as done.')).catch(()=>{ setLoading(false); });
      setLoading(false);
      // Refresh the task list
      await getToDoAllTasks().then().catch();
   };

   // Function to handle task update
   const handleToDoTaskUpdate = async (toDoTask: ToDoTask): Promise<void> => {
      setLoading(true);
      await updateTask(toDoTask).then(()=> toast.success('Success! The task has been updated.')).catch(()=>{ setLoading(false); });
      setLoading(false);
     
      // Refresh the task list
      await getToDoAllTasks().then().catch();
   };

   // Function to handle pagination change
   const handlePaginationChange = (params: Partial<PaginationParams>): void => {
      setPaginationParams((prev: PaginationParams) => ({ ...prev, ...params }));
   };

   return (
      <>
         <Card 
            id="list1" 
            className="mdbcard-style"
            sx={{
               borderRadius: 4,
               boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
               border: '1px solid #e5e7eb',
               margin: { xs: 2, md: '30px auto' },
               maxWidth: 1400,
               backgroundColor: 'white',
            }}
         >
            <CardContent 
               sx={{
                  py: { xs: 3, md: 4 },
                  px: { xs: 3, md: 5 },
               }}
            >
               <Box
                  sx={{
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     gap: 1,
                     mb: 4,
                     mt: 3,
                  }}
               >
                  <CheckBoxIcon sx={{ color: '#3b82f6', fontSize: 32 }} />
                  <Typography
                     variant="h4"
                     component="h1"
                     sx={{
                        color: '#1f2937',
                        fontWeight: 700,
                        fontSize: { xs: 24, md: 28 },
                        letterSpacing: '-0.5px',
                     }}
                  >
                     Tasks
                  </Typography>
               </Box>
               <AddTask onAdd={AddNewTask} />
               <Divider sx={{ my: 4 }} />
               <TaskList
                  loading={loading}
                  onUpdate={handleToDoTaskUpdate}
                  tasks={taskList}
                  onStatusChange={handleToDoTaskStatusChange}
                  onDelete={handleDeleteToDoTask}
                  paginationData={paginationData}
                  onPaginationChange={handlePaginationChange}
               />
            </CardContent>
         </Card>
         <ToastContainer />
      </>
   );
};

export default ToDoTask;
