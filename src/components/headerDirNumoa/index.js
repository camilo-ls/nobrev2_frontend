import React from 'react'
import './styles.css'
import logo from '../../img/nobre.png'

function HeaderDirNumoa() {
    return (
      <header className='header'>
          <div className='header-logo'>
              <img className='header-img' src={logo} alt='Logo do Nobre'/>
          </div>
          <div className='menu-nav'>
              <a href="#/">Início</a>
              <a href="#/pact">Pactuação</a>
              <a href="#/monitor">Monitoramento</a>
          </div>
          <div className='user-panel'>

          </div>
      </header>
    );
  }
  
  export default HeaderDirNumoa;