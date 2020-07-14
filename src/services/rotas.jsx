import React from 'react'
import { Switch, Route, Redirect } from 'react-router'
import PactTable from '../components/table_pact'
import DiretorHome from '../views/diretor/diretor_home'
import TableMonitor from '../components/table_monitor'


export default props => {
    return (
        <Switch>
            <Route exact path='/' component={DiretorHome} />
            <Route path='/pact' component={PactTable} />
            <Route path='/monitor' component={TableMonitor} />
            <Redirect from='*' to='/' />
        </Switch>
    )
}