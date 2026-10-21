import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from '../context/AppContext';
import { BookPrintView } from '../components/print/BookPrintView';
import '../index.css';

const CetakBukuPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 p-2 sm:p-6">
      <BookPrintView
        onBack={() => {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            window.location.href = 'mutasi.html';
          }
        }}
      />
    </div>
  );
};

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <AppProvider>
        <CetakBukuPage />
      </AppProvider>
    </React.StrictMode>
  );
}
