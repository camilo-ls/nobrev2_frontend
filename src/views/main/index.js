import React, { useState, useEffect } from 'react'
import { Switch, Route, BrowserRouter, useHistory } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import api from '../../services/api'

import Profissional from '../profissional'
import Diretor from '../diretor'
import Numoa from '../disas'
import Register from '../register'
import Login from '../login'

import userContext from '../../context/userContext'

const Main = () => {
    const [userData, setUserData] = useState({
        token: undefined,
        user: undefined,
    })

    let history = useHistory()

    useEffect(() => {
        const checkLogin = async () => {
            let token = localStorage.getItem('auth-token')
            if (token === null) {
                localStorage.setItem('auth-token', '')
                token = ''
            }
            try {
                let user_pkg = jwtDecode(token)
                setUserData({
                    token,
                    user_pkg
                })
                console.log(user_pkg,userData.user)
                if (userData.user.nivel) {
                    if (userData.user.nivel == 0) history.push('/profissional')
                    if (userData.user.nivel == 1) history.push('/diretor')
                    if (userData.user.nivel == 2) history.push('/numoa')
                }
                else {
                    history.push('/login')
                }              
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
                    <Switch>
                        <Route path='/profissional' component={Profissional} />
                        <Route path='/diretor' component={Diretor} />
                        <Route path='/numoa' component={Numoa} />
                        <Route path='/register' component={Register} />
                        <Route path='/login' component={Login} />
                    </Switch>
                </userContext.Provider>
            </BrowserRouter>            
        </React.Fragment>       
    )
}

export default Main