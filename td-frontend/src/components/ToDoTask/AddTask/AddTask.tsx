import React, { useState, useRef } from 'react';
import { Button, Card, CardContent, Tooltip, IconButton, TextField, Box, Stack, Popover } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReactDatePicker from 'react-datepicker';
import { dateToMidnightUTC } from 'utils/formatting';

// Define the Props interface for the AddTask component
interface Props {
   onAdd: (title: string, dueDate?: Date | null) => Promise<void>; // Callback to add a new task
}

const AddTask: React.FC<Props> = ({ onAdd }: Props) => {
   const [dueDate, setdueDate] = useState<Date | null>(null); // Due date for the task
   const [showDatePicker, setShowDatePicker] = useState(false); // Controls the visibility of the date picker
   const [title, setTitle] = useState(''); // Title of the new task
   const anchorRef = useRef<HTMLButtonElement>(null);

   // Handler for changing the due date
   const handleDueDateChange = (date: Date | null): void => {
      if (date) {
         setdueDate(date);
         setShowDatePicker(false);
      }
   };

   // Handler for adding a new task
   const handleAddToDoTask = async (): Promise<void> => {
      // Convert selected date to midnight UTC, or use today's date if no date selected
      const taskDueDate = dueDate 
         ? dateToMidnightUTC(dueDate) 
         : dateToMidnightUTC(new Date());
      
      // Call the provided onAdd callback with the title and dueDate
      await onAdd(title, taskDueDate).then().catch();
      
      // Clear the title and reset the dueDate
      setTitle('');
      setdueDate(null);
   };

   return (
      <Box sx={{ pb: 2 }}>
         <Card elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 2 }}>
            <CardContent>
               <Stack direction="row" spacing={1.5} alignItems="center">
                  {/* Input field for entering task title */}
                  <TextField
                     fullWidth
                     variant="outlined"
                     placeholder="Add new..."
                     value={title}
                     onChange={(e) => {
                        setTitle(e.target.value);
                     }}
                     onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                           handleAddToDoTask();
                        }
                     }}
                     sx={{
                        '& .MuiOutlinedInput-root': {
                           borderRadius: 2,
                           backgroundColor: '#f9fafb',
                           '&:hover': {
                              backgroundColor: '#f3f4f6',
                           },
                           '&.Mui-focused': {
                              backgroundColor: 'white',
                           },
                        },
                     }}
                  />
                  
                  {/* Tooltip and icon for setting a due date */}
                  <Tooltip title={dueDate ? `Due: ${dueDate.toLocaleDateString()}` : 'Set due date'}>
                     <IconButton
                        ref={anchorRef}
                        onClick={() => {
                           setShowDatePicker(!showDatePicker);
                        }}
                        sx={{
                           border: '1px solid #e5e7eb',
                           backgroundColor: dueDate ? '#eff6ff' : '#f9fafb',
                           '&:hover': {
                              backgroundColor: '#f3f4f6',
                           },
                        }}
                     >
                        <CalendarTodayIcon />
                     </IconButton>
                  </Tooltip>

                  {/* Date picker popover */}
                  <Popover
                     open={showDatePicker}
                     anchorEl={anchorRef.current}
                     onClose={() => setShowDatePicker(false)}
                     anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                     }}
                     transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                     }}
                  >
                     <Box sx={{ p: 2 }}>
                        <ReactDatePicker
                           selected={dueDate}
                           onChange={handleDueDateChange}
                           inline
                        />
                     </Box>
                  </Popover>

                  {/* Button for adding the task */}
                  <Button 
                     variant="contained" 
                     onClick={handleAddToDoTask}
                     sx={{
                        borderRadius: 2,
                        px: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                     }}
                  >
                     Add
                  </Button>
               </Stack>
            </CardContent>
         </Card>
      </Box>
   );
};

export default AddTask;
