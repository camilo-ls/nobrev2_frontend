import React from 'react'
import './styles.css'
import logo from '../../../img/nobre.png'

function Header() {
    return (
      <header className='header'>
          <div className='header-logo'>
              <img className='header-img' src={logo} alt='Logo do Nobre'/>
          </div>
          <div className='menu-nav'>
              <a href="#/">Monitoramento</a>
          </div>
          <div className='user-panel'>
              <h2>Visão do Profissional</h2>            
          </div>
      </header>
    );
  }
  
  export default Header;