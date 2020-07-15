import React from 'react'
import { Switch, Route, Redirect } from 'react-router'
import ProfissionalHome from '.'
import ProfissionalMonitor from './table_monitor_prof'


export default props => {
    return (
        <Switch>
            <Route exact path='/' component={ProfissionalMonitor} />           
        </Switch>
    )
}