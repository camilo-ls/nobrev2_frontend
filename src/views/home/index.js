import React, { useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import api from '../../services/api'

import userContext from '../../context/userContext'

import Menubar from '../../components/MenuBar'

import Intro from '../../views/intro'
import Login from '../../components/login'
import Register from '../../components/register'

import Tabela_Pact from '../../components/table_pact'
import Tabela_Mon from '../../components/table_monitor'

import gerarPDF from '../../components/pdfProcedimento'

const Home = () => {
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined
    })

    const [userProf, setUserProf] = useState(false)
    const [userDir, setUserDir] = useState(false)
    const [userNumoa, setUserNumoa] = useState(false)
    
    useEffect(() => {
        const checkLogin = async () => {
            let token = localStorage.getItem('auth-token')
            if (token === null) {
                localStorage.setItem('auth-token', '')
                token = ''
            }
            try {
                const user = jwtDecode(token)
                api.post('/auth/verifyToken', {"token": token})
                .then(resp => {
                    if (resp) {
                        setUserData({
                            token,
                            user
                        })
                    }
                })
                .catch(erro => {
                    console.log(erro)
                })                   
            }
            catch(e) {            
                console.log(e)
            }         
        }
        checkLogin()
    }, [])

    return (        
        <React.Fragment>         
            <BrowserRouter>
                <userContext.Provider value={{userData, setUserData}}>
                    <Menubar />
                    <Switch>
                        <Route exact path='/' component={Intro} />
                        <Route path='/login' component={Login} />
                        <Route path='/register' component={Register} />
                        <Route path='/diretor' component={Tabela_Pact} />
                        <Route path='/profissional' component={Tabela_Mon} />
                        <Route path='/gerarPDF' component={gerarPDF} /> 
                    </Switch>
                </userContext.Provider>
            </BrowserRouter>            
        </React.Fragment>       
    )
}

export default Home