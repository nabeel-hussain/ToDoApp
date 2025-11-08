import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const PageLoading: React.FC = () => {
   return (
      <Box
         sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            width: '100%',
         }}
      >
         <CircularProgress role="status" aria-label="Loading..." />
         <span className="visually-hidden">Loading...</span>
      </Box>
   );
};

export default PageLoading;
