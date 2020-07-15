import React from 'react'
import Header from './headerProf'
import Routes from './profissional_routes'
import { HashRouter } from 'react-router-dom'
import './styles.css'

function Profissional() {
    return (
        <HashRouter>
            <React.Fragment>
                <Header />
                <Routes />
            </React.Fragment>
        </HashRouter>        
    );
}

export default Profissional