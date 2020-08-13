import React from 'react'
import { Switch, Route, Redirect } from 'react-router'
import PactTable from './components/table_pact'

export default props => {
    return (
        <Switch>
            <Route exact path='/diretor' component={PactTable} />          
        </Switch>
    )
}