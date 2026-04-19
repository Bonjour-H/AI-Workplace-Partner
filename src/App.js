import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { router } from './router';
import Toast from './components/Common/Toast';

function App() {
  return (
    <AppProvider>
      <div id="app" className="h-screen w-screen">
        <Toast />
        <RouterProvider router={router} />
      </div>
    </AppProvider>
  );
}

export default App; 