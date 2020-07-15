import React from 'react'
import './styles.css'
import logo from '../../../../img/nobre.png'

function HeaderDir() {
    return (
      <header className='header'>
          <div className='header-logo'>
              <img className='header-img' src={logo} alt='Logo do Nobre'/>
          </div>
          <div className='menu-nav'>
              <a className='menu-link' href="#/diretor">Início</a>
              <a className='menu-link' href="#/diretor/pact">Pactuação</a>
              <a className='menu-link' href="#/diretor/monitor">Monitoramento</a>
          </div>
          <div className='user-panel'>
              <h2>Visão do Diretor</h2>            
          </div>
      </header>
    );
  }
  
  export default HeaderDir;