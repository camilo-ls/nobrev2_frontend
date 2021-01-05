import React, { useState, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import api from '../../services/api'

import userContext from '../../context/userContext'

import Menubar from '../../components/MenuBar'

import Intro from '../../views/intro'
import Login from '../../components/login'
import Register from '../../components/register'

import Tabela_Pact from '../../components/table_pact'
import Tabela_Mon from '../../components/table_monitor'
import Tabela_Mon_Unidade from '../../components/table_monitor_unidade'
import Tabela_Disa from '../../components/tablePactDisa'
import Tabela_Mon_Disa from '../../components/tableMonitorDisa'
import TabelaMonSemsa from '../../components/tableMonitorSEMSA'
import Diretor_EscolherUnidade from '../../components/Diretor_EscolherUnidade'
import Profissional_EscolherMatricula from '../../components/Profissional_EscolherMatricula'

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
            <userContext.Provider value={{userData, setUserData}}>
                <Menubar />
                <Switch>
                    <Route exact path='/' component={Intro} />
                    <Route path='/login' component={Login} />
                    <Route path='/register' component={Register} />
                    <Route exact path='/semsa' component={TabelaMonSemsa} />
                    <Route exact path='/disa' component={Tabela_Disa} />
                    <Route path='/disa/monitoramento' component={Tabela_Mon_Disa} />
                    <Route path='/disa/revisao' component={Diretor_EscolherUnidade} />
                    <Route exact path='/diretor' component={Diretor_EscolherUnidade} />
                    <Route path='/diretor/monitoramento' component={Tabela_Mon_Unidade} />
                    <Route exact path='/profissional' component={Profissional_EscolherMatricula} />
                </Switch>
            </userContext.Provider>
        </React.Fragment>       
    )
}

export default Home