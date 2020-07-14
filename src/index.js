import React from 'react';
import ReactDOM from 'react-dom';
import HeaderDirNumoa from './components/headerDirNumoa'
import 'bootstrap/dist/css/bootstrap.min.css';
import Diretor from './views/diretor'

ReactDOM.render(
  <React.StrictMode>
    <Diretor />
  </React.StrictMode>,
  document.getElementById('root')
);