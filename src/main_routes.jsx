import React from 'react'
import { Switch, Route} from 'react-router'
import ProfissionalHome from './views/profissional'
import DiretorHome from './views/diretor'
import NumoaHome from './views/disas'

import Landing from './views/landing'
import Register from './views/register'
import Login from './views/login'
import Redirect from './views/redirect'


export default props => {
    return (
        <Switch>
            <Route exact path='/profissional' component={ProfissionalHome} />
            <Route exact path='/diretor' component={DiretorHome} />
            <Route exact path='/numoa' component={NumoaHome} />
        </Switch>
    )
}