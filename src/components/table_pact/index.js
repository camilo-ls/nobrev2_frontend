import React, { Component } from 'react'
import api from '../../services/api'
import { Table, Button } from 'antd'

const defaultState = {
    cnes: 2015285,
    funcionario: {
        // informações do funcionário:
        id: '',
        cnes: '',
        nome: '',
        cns: '',
        cbo: '',
        cbo_nome: '',
        ine: '',
        // informação da pactuação:
        dias_pact: '',
        justificativa: ''
    },
    lista: []
}

export default class TablePact extends Component {
    
    state = {...defaultState}

    componentWillMount() {
        api.get(`/cnes/${this.state.cnes}/func`)
        .then(resp => this.setState({lista: resp}))
    }

    setCnes(nCnes) {
        this.setState({cnes: nCnes})
    }

    renderTable() {
        return (
            
        )
    }


    render() {
        return (
            <React.Fragment>
                {this.renderTable()}
            </React.Fragment>
        )
    }


}