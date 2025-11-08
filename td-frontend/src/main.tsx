import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-toastify/dist/ReactToastify.css';

import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement !== null) {
   ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
         <App />
      </React.StrictMode>,
   );
} else {
   console.error("Element with ID 'root' not found.");
}
