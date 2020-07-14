import React from 'react'
import HeaderDirNumoa from '../../components/headerDirNumoa'
import Routes from '../../services/rotas'
import { HashRouter } from 'react-router-dom'
import './styles.css'

function Diretor() {
    return (
        <HashRouter>
            <React.Fragment>
                <HeaderDirNumoa />
                <Routes />
            </React.Fragment>
        </HashRouter>
        
      );
}

export default Diretor