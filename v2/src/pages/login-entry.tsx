import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from '../context/AppContext';
import { AuthModule } from '../components/auth/AuthModule';
import '../index.css';

const LoginPage: React.FC = () => {
  return (
    <AppProvider>
      <AuthModule />
    </AppProvider>
  );
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<LoginPage />);
}

export default LoginPage;
