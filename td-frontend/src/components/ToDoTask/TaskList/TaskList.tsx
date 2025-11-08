import React from 'react';
import { formatDate, isDatePassed, stringToDate } from 'utils/formatting';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
   type GridRowModesModel,
   GridRowModes,
   DataGrid,
   type GridColDef,
   GridActionsCellItem,
   type GridEventListener,
   type GridRowId,
   GridRowEditStopReasons,
   useGridApiRef,
   type GridSortModel,
} from '@mui/x-data-grid';
import classes from 'components/ToDoTask/TaskList/TaskList.module.scss';
import { 
   Backdrop, 
   Box, 
   CircularProgress, 
   Tab, 
   Tabs,
   TextField,
   InputAdornment,
   MenuItem,
   Select,
   FormControl,
   InputLabel,
   Stack,
   Pagination,
   Typography,
   SelectChangeEvent,
   Checkbox
} from '@mui/material';
import { countPendingTasks } from 'utils/utility';

// Define the Props interface for the TaskList component
interface Props {
   tasks: ToDoTask[]; // An array of ToDoTask objects
   onStatusChange: (toDoTask: ToDoTask) => Promise<void>; // Function to handle mark as done/undone functionality.
   onUpdate: (toDoTask: ToDoTask) => Promise<void>; // Function to handle task updates
   onDelete: (id: string) => Promise<void>; // Function to handle task deletion
   loading?: boolean; // Flag to indicate api call in progress.
   paginationData: PaginatedResponse<ToDoTask>; // Pagination metadata
   onPaginationChange: (params: Partial<PaginationParams>) => void; // Function to handle pagination changes
}

const TaskList: React.FC<Props> = ({
   tasks,
   onStatusChange,
   onDelete,
   onUpdate,
   loading,
   paginationData,
   onPaginationChange,
}: Props) => {
   // State to manage row modes (edit/view)
   const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

   // Reference to the DataGrid API
   const apiRef = useGridApiRef();

   // State to manage the selected tab (All, Pending, Completed and Overdue)
   const [selectedTab, setSelectedTab] = React.useState(0);

   // State for search text
   const [localSearchText, setLocalSearchText] = React.useState('');

   // State for status filter
   const [statusFilter, setStatusFilter] = React.useState<string>('all');

   // Debounce search to avoid too many API calls
   React.useEffect(() => {
      const timer = setTimeout(() => {
         onPaginationChange({
            pageNumber: 1,
            searchText: localSearchText || undefined,
         });
      }, 500);
      return () => clearTimeout(timer);
   }, [localSearchText]);

   // Handle row edit stop event
   const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
      if (params.reason === GridRowEditStopReasons.rowFocusOut) {
         event.defaultMuiPrevented = true;
      }
   };

   // Handle click event for editing a task
   const handleEditClick = (id: GridRowId) => (): void => {
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
   };

   // Handle click event for saving changes to a task
   const handleSaveClick = (task: ToDoTask): void => {
      setRowModesModel({ ...rowModesModel, [task.id]: { mode: GridRowModes.View } });
   };

   // Handle click event for cancelling changes to a task
   const handleCancelClick = (id: GridRowId) => (): void => {
      setRowModesModel({
         ...rowModesModel,
         [id]: { mode: GridRowModes.View, ignoreModifications: true },
      });
   };

   // update the data in the database when user clicks on save button
   const processRowUpdate = async (newRow: ToDoTask): Promise<ToDoTask> => {
      const updatedRow = { ...newRow, isNew: false };
      if (newRow !== null) {
         await onUpdate(newRow);
      }
      return updatedRow;
   };

   // Handle changes in row modes model
   const handleRowModesModelChange = (newRowModesModel: GridRowModesModel): void => {
      setRowModesModel(newRowModesModel);
   };

   // Define the columns for the DataGrid
   const columns: GridColDef[] = [
      // Column for allowing user to mark task as done or undone
      {
         field: '',
         headerName: '',
         width: 30,
         sortable: false,
         type: 'actions',
         renderCell: (params) => (
            <Checkbox
               onChange={() => {
                  onStatusChange(params.row);
               }}
               checked={params.row.isDone}
            />
         ),
      },
      {
         field: 'title',
         headerName: 'Task',
         flex: 1,
         editable: true,
         hideable: false,
      },
      {
         field: 'dueDate',
         headerName: 'Due Date',
         type: 'date',
         flex: 1,
         editable: true,
         valueGetter: (params: any) => {
            return params.row?.dueDate ? stringToDate(params.row.dueDate) : null;
         },
         renderCell: (params) => {
            const dueDate = params.row?.dueDate ? stringToDate(params.row.dueDate) : null;
            return <>{formatDate(dueDate)}</>;
         },
      },
      {
         field: 'isDone',
         headerName: 'Status',
         flex: 1,
         editable: true,
         type: 'boolean',
      },
      {
         field: 'actions',
         type: 'actions',
         headerName: 'Actions',
         width: 100,
         cellClassName: 'actions',
         getActions: ({ id, row }) => {
            const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

            if (isInEditMode) {
               return [
                  <GridActionsCellItem
                     key={1}
                     icon={<SaveIcon />}
                     label="Save"
                     onClick={() => {
                        handleSaveClick(row);
                     }}
                  />,
                  <GridActionsCellItem
                     key={1}
                     icon={<CancelIcon />}
                     label="Cancel"
                     className="textPrimary"
                     onClick={handleCancelClick(id)}
                     color="inherit"
                  />,
               ];
            }

            return [
               <GridActionsCellItem
                  key={1}
                  icon={<EditIcon />}
                  label="Edit"
                  className="textPrimary"
                  onClick={handleEditClick(id)}
                  color="inherit"
               />,
               <GridActionsCellItem
                  key={1}
                  icon={<DeleteIcon />}
                  label="Delete"
                  onClick={() => {
                     onDelete(row.id);
                  }}
                  color="inherit"
               />,
            ];
         },
      },
   ];

   // When the Tab (All, Pending, Completed) is clicked
   const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
      setSelectedTab(newValue);
      let status: boolean | null | undefined = null;
      
      if (newValue === 1) {
         status = false; // Pending
         setStatusFilter('pending');
      } else if (newValue === 2) {
         status = true; // Completed
         setStatusFilter('completed');
      } else {
         status = null; // All
         setStatusFilter('all');
      }
      
      onPaginationChange({
         pageNumber: 1,
         status: status,
      });
   };

   // Handle status filter change
   const handleStatusFilterChange = (event: SelectChangeEvent<string>): void => {
      const value = event.target.value;
      setStatusFilter(value);
      
      let status: boolean | null | undefined = null;
      if (value === 'pending') {
         status = false;
         setSelectedTab(1);
      } else if (value === 'completed') {
         status = true;
         setSelectedTab(2);
      } else {
         status = null;
         setSelectedTab(0);
      }
      
      onPaginationChange({
         pageNumber: 1,
         status: status,
      });
   };

   // Handle page change
   const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number): void => {
      onPaginationChange({ pageNumber: page });
   };

   // Handle page size change
   const handlePageSizeChange = (event: SelectChangeEvent<number>): void => {
      onPaginationChange({ 
         pageNumber: 1, 
         pageSize: Number(event.target.value) 
      });
   };

   // Handle sort model change
   const handleSortModelChange = (model: GridSortModel): void => {
      if (model.length > 0) {
         onPaginationChange({
            sortBy: model[0].field,
            sortDirection: model[0].sort || 'asc',
         });
      }
   };

   // Custom footer component
   const CustomFooter = (): React.ReactElement => {
      return (
         <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(224, 224, 224, 1)' }}>
            <Box>
               <Typography variant="body2">
                  <strong>Total:</strong> {paginationData.totalRecords} | <strong>Pending:</strong> {countPendingTasks(tasks)}
               </Typography>
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
               <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel id="page-size-label">Rows</InputLabel>
                  <Select
                     labelId="page-size-label"
                     value={paginationData.pageSize}
                     label="Rows"
                     onChange={handlePageSizeChange}
                  >
                     <MenuItem value={5}>5</MenuItem>
                     <MenuItem value={10}>10</MenuItem>
                     <MenuItem value={25}>25</MenuItem>
                     <MenuItem value={50}>50</MenuItem>
                  </Select>
               </FormControl>
               <Pagination 
                  count={paginationData.totalPages} 
                  page={paginationData.pageNumber}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
               />
            </Stack>
         </Box>
      );
   };

   // Render the TaskList component
   return (
      <>
         <Box className={classes.customBox}>
            <Backdrop
               sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
               open={loading === true ? loading : false}
            >
               <CircularProgress color="inherit" title="Loading...." />
            </Backdrop>
            
            {/* Search and Filter Controls */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
               <TextField
                  placeholder="Search tasks..."
                  value={localSearchText}
                  onChange={(e) => setLocalSearchText(e.target.value)}
                  size="small"
                  sx={{ flexGrow: 1 }}
                  InputProps={{
                     startAdornment: (
                        <InputAdornment position="start">
                           <SearchIcon />
                        </InputAdornment>
                     ),
                  }}
               />
               <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                     labelId="status-filter-label"
                     value={statusFilter}
                     label="Status"
                     onChange={handleStatusFilterChange}
                  >
                     <MenuItem value="all">All Tasks</MenuItem>
                     <MenuItem value="pending">Pending</MenuItem>
                     <MenuItem value="completed">Completed</MenuItem>
                  </Select>
               </FormControl>
            </Stack>

            {/* Tabs for quick filtering */}
            <Tabs
               value={selectedTab}
               onChange={handleTabChange}
               scrollButtons
               aria-label="task status tabs"
               sx={{ mb: 2 }}
            >
               <Tab label="All" />
               <Tab label="Pending" />
               <Tab label="Completed" />
            </Tabs>

            {/* DataGrid */}
            <DataGrid
               slots={{
                  footer: CustomFooter,
               }}
               initialState={{
                  columns: {
                     columnVisibilityModel: {
                        isDone: false,
                     },
                  },
               }}
               apiRef={apiRef}
               rowSelection={false}
               rows={tasks}
               columns={columns}
               editMode="row"
               rowModesModel={rowModesModel}
               onRowModesModelChange={handleRowModesModelChange}
               onRowEditStop={handleRowEditStop}
               processRowUpdate={processRowUpdate}
               onSortModelChange={handleSortModelChange}
               sortingMode="server"
               paginationMode="server"
               hideFooterPagination={true}
               getRowClassName={(params) => {
                  if (params.row.isDone) {
                     return classes.doneTask;
                  } else if (params.row.dueDate && isDatePassed(stringToDate(params.row.dueDate))) {
                     return classes.overDueTask;
                  }
                  return '';
               }}
               sx={{
                  '& .MuiDataGrid-cell:focus': {
                     outline: 'none',
                  },
                  '& .MuiDataGrid-row:hover': {
                     backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
               }}
            />
         </Box>
      </>
   );
};

export default TaskList;
