import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import WagmiProvider from './providers/WagmiProvider';

// Polyfills for crypto functionality
import { Buffer } from 'buffer';
window.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider>
      <App />
    </WagmiProvider>
  </React.StrictMode>,
);
