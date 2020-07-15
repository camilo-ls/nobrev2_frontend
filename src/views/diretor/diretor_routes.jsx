import React from 'react'
import { Switch, Route, Redirect } from 'react-router'
import PactTable from './components/table_pact'
import DiretorHome from './diretor_home'
import TableMonitorUnidade from './components/table_monitor_unidade'


export default props => {
    return (
        <Switch>
            <Route exact path='/diretor' component={DiretorHome} />
            
            <Route path='/diretor/pact' component={PactTable} />
            
            <Route path='/diretor/monitor/' component={TableMonitorUnidade} />
        </Switch>
    )
}