import React from 'react'
import { Switch, Route, BrowserRouter, Link } from 'react-router-dom'

import Profissional from '../profissional'
import Diretor from '../diretor'
import Numoa from '../disas'
import Register from '../register'

const Main = () => {
    return (
        <React.Fragment>
            <BrowserRouter>
                <Switch>
                    <Route exact path='/profissional' component={Profissional} />
                    <Route exact path='/diretor' component={Diretor} />
                    <Route exact path='/numoa' component={Numoa} />
                    <Route exact path='/register' component={Register} />
                </Switch>
            </BrowserRouter>
            <div className='inicio'>

            </div>
        </React.Fragment>        
        
    )
}

export default Main