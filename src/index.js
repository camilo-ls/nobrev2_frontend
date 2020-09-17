import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import Home from './views/home'
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename={'/nobre'}>
      <Home />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);