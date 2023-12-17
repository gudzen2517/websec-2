import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Parser from './App';
import InputExample from './Input';
import reportWebVitals from './reportWebVitals';

const form = ReactDOM.createRoot(document.getElementById('inputer'));
form.render(
  <React.StrictMode>
    <InputExample />
  </React.StrictMode>
);

const table = ReactDOM.createRoot(document.getElementById('root'));
table.render(
  <React.StrictMode>
    <Parser />
  </React.StrictMode>
);

reportWebVitals();
