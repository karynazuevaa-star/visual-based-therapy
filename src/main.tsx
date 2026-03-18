import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

function showFatal(err: unknown) {
  const message =
    err instanceof Error ? `${err.name}: ${err.message}\n${err.stack ?? ''}` : String(err);

  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; padding: 24px;">
        <h2 style="margin:0 0 12px 0;">❌ Runtime error</h2>
        <pre style="white-space: pre-wrap; background:#111; color:#0f0; padding:16px; border-radius:12px;">${escapeHtml(
          message
        )}</pre>
      </div>
    `;
  }
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return c;
    }
  });
}

window.addEventListener('error', (e) => showFatal(e.error ?? e.message));
window.addEventListener('unhandledrejection', (e) => showFatal(e.reason));

try {
  const el = document.getElementById('root');
  if (!el) throw new Error('No #root element found in index.html');

  ReactDOM.createRoot(el).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} catch (err) {
  showFatal(err);
}
