import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';

import ChatApp from './ChatApp';

console.log('Hi');

ReactDOM.render(
  <React.StrictMode>
    <ChatApp />
  </React.StrictMode>,
  document.getElementById('root'),
);
