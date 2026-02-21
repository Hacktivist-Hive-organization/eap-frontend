import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from '@/App';
import { GlobalErrorBoundary } from '@/components/common/GlobalErrorBoundary';
import { QueryProvider } from '@/context/query-context';
import { store } from '@/store';

import './index.css';

const root = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <QueryProvider>
      <Provider store={store}>
        <BrowserRouter>
          <GlobalErrorBoundary>
            <App />
          </GlobalErrorBoundary>
          <Toaster richColors position="top-right" />
        </BrowserRouter>
      </Provider>
    </QueryProvider>
  </React.StrictMode>,
);
