import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';
import './index.scss';
import 'dread-ui/style.scss';
import { BoardProvider } from './providers/board-context';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BoardProvider>
      <App />
    </BoardProvider>
  </React.StrictMode>,
);
