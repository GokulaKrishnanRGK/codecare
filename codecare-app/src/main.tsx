import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {RouterProvider} from 'react-router-dom';
import router from './router.ts';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}>
        <App />
    </RouterProvider>
  </React.StrictMode>,
)
