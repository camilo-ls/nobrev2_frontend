import React from 'react';
import ReactDOM from 'react-dom';
import Admin from './views/admin';
import ReactPact from './views/pactuacao'
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
    <ReactPact />
  </React.StrictMode>,
  document.getElementById('root')
);