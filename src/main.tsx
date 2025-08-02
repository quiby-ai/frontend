import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { init, bindThemeParamsCssVars } from '@telegram-apps/sdk';
import App from './App.tsx';
import './index.css';

init();

try {
  bindThemeParamsCssVars();
} catch (error) {
  console.warn('Failed to bind Telegram theme parameters:', error);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
