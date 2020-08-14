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
                    console.log(resp)
                    if (resp) {
                        setUserData({
                            token,
                            user
                        })
                        if (user.nivel == 0) setUserProf(true)
                        if (user.nivel == 1) setUserDir(true)
                        if (user.nivel == 2) setUserNumoa(true)
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
                    </Switch>
                </userContext.Provider>
            </BrowserRouter>            
        </React.Fragment>       
    )
}

export default Home