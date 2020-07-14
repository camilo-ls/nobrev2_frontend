import React, { Component } from 'react'
import api from '../../services/api'
import {Table, ProgressBar} from 'react-bootstrap'
import './styles.css'

const defaultPactState = {
    cnes: 3027163,
    proc: {
        procedimento: '',
        pactuado: 0
    },
    list: []
}

const defaultProdState = {
    proc: {
        procedimento: '',
        produzido: 0
    },
    list: []
}

export default class TableMonitor extends Component {

    state = {...defaultPactState}
    prod = {...defaultProdState}

    componentWillMount() {
        api.get(`/cnes/${this.state.cnes}/monitoramento`)
        .then(resp => {
            this.setState({list: resp.data})
        })
    }

    confirmFunc(id) {
        var linha = document.getElementById(id)
        linha.className = 'salvo'
    }

    generateProd(max) {
        return Math.floor(Math.random() * max) + 1
    }

    renderRows() {
        return this.state.list.map(proc => {
            return (
                <tr>
                    <td>{proc.procedimento}</td>
                    <td>nome_procedimento</td>
                    <td>{proc.pactuado}</td>
                    <td>{this.generateProd(proc.pactuado)}</td>
                    <td>
                        <ProgressBar now={this.generateProd(100)} />
                    </td>
                </tr>
            )
        })                    
    }

    renderTable() {
        return (
            <Table className='form-pact'>
                <thead>
                    <tr>
                        <th>CÓDIGO</th>
                        <th>PROCEDIMENTO</th>
                        <th>QT. PACTUADA</th>
                        <th>QT. PRODUZIDA</th>
                        <th>ALCANCE (%)</th>                      
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </Table>
        )
    }

    render() {
        return (
            <React.Fragment>
                <div className='pact-header'>
                    <h1>Monitoramento da Produção</h1>
                    <p>Esta página será utilizada com a finalidade de realizar o monitoramento do alcance da produção por procedimento</p>    
                </div>               
                {this.renderTable()}
            </React.Fragment>
        )
    }      
}