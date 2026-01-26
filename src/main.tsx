import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

function showFatal(error: unknown) {
  const el = document.getElementById('root');
  if (!el) return;

  const msg =
    error instanceof Error ? `${error.message}\n\n${error.stack ?? ''}` : String(error);

  el.innerHTML = `
    <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; padding:16px;">
      <h2 style="margin:0 0 12px 0;">App crashed on startup</h2>
      <pre style="white-space:pre-wrap; background:#f6f8fa; padding:12px; border-radius:8px;">${msg}</pre>
    </div>
  `;
}

window.addEventListener('error', (e) => {
  showFatal(e.error ?? e.message);
});

window.addEventListener('unhandledrejection', (e) => {
  showFatal(e.reason);
});

const rootEl = document.getElementById('root');
if (!rootEl) {
  showFatal(new Error('Root element #root not found'));
} else {
  try {
    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
  } catch (e) {
    showFatal(e);
  }
}
