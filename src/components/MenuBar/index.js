import React, { useContext } from 'react'
import './styles.css'
import logo from '../../img/nobre.png'

import userContext from '../../context/userContext'

function MenuBar(props) {
    const { userData } = useContext(userContext)

    const logout = () => {
        localStorage.removeItem('auth-token')
        window.location.reload(false)
    }

    return (
      <header className='header-menu'>
          <div className='header-logo'>
              <img className='header-img' src={logo} alt='Logo do Nobre'/>
          </div>
          <div className='menu-nav'>
          {userData.user && userData.user.nivel == 0 ? (
                <>                    
                    <a className='menu-link' href="/nobre/profissional">Minhas Metas</a>                   
                </>
            ) : null}
            {userData.user && userData.user.nivel == 1 ? (
                <>
                    <a className='menu-link' href="/nobre/diretor">Pactuação</a>             
                    <a className='menu-link' href="/nobre/diretor/monitoramento">Monitoramento</a>                        
                </>
            ) : null}
            {userData.user && userData.user.nivel == 2 ? (
                <>
                    <a className='menu-link' href="/nobre/disa">Pactuação</a>                               
                    <a className='menu-link' href="/nobre/disa/monitoramento">Monitoramento</a>           
                </>
            ) : null}
            {userData.user && userData.user.nivel >= 3 ? (
                <>
                    <a className='menu-link' href="/nobre/semsa">Monitoramento de Metas</a>
                </>
            ) : null}
            {!userData.user ? (
                <>
                    <a className='menu-link' href="/nobre/login">Entrar</a>             
                    <a className='menu-link' href="/nobre/register">Solicitar Acesso</a>                        
                </>
            ) : null}
          </div>
          <div className='user-panel'>          
              {userData.user ? (
                <>
                    <span>Logado(a) como:</span><br/>              
                    <span className='user-name'>{userData.user.nome}</span><br />
                    <a className='link-logout' href="#" onClick={logout}>SAIR</a>
                </>
              ) : null}
          </div>
      </header>
    );
  }
  
  export default MenuBar;