import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import SolanaWalletProvider from './SolanaWalletProvider';

// Polyfills for crypto functionality
import { Buffer } from 'buffer';
window.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SolanaWalletProvider>
      <App />
    </SolanaWalletProvider>
  </React.StrictMode>,
);
