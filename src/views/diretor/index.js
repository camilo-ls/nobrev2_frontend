import React from 'react'
import HeaderDir from '../../components/MenuBar'
import Routes from './diretor_routes'
import { HashRouter } from 'react-router-dom'
import './styles.css'

function Diretor() {
    return (
        <HashRouter>
            <React.Fragment>
                <HeaderDir />
                <Routes />
            </React.Fragment>
        </HashRouter>        
      );
}

export default Diretor