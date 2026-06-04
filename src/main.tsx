import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { UserProgressProvider } from './context/UserProgressContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserProgressProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </UserProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
