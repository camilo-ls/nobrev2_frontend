import React, { Component } from 'react'
import api from '../../../services/api'
import {Dropdown, Table, ProgressBar} from 'react-bootstrap'
import './styles.css'

const defaultPactState = {
    cns: 980016002044693,
    proc: {
        cod: '',
        nome: '',
        quantidade: 0,
    },
    list: []
}

export default class TableMonitor extends Component {

    state = {...defaultPactState}

    componentWillMount() {
        api.get(`/prof/pmp/${this.state.cns}`)
        .then(resp => {
            this.setState({list: resp.data})
        })
    }

    generateProd(max) {
        return Math.floor(Math.random() * max) + 1
    }

    renderRows() {
        return this.state.list.map(proc => {
            return (
                <tr>
                    <td>{proc.cod}</td>
                    <td>{proc.nome}</td>
                    <td>{proc.quantidade}</td>
                    <td>{this.generateProd(proc.quantidade)}</td>
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
                <div className='filtros'>
                    <Dropdown>
                        <Dropdown.Toggle variant='secondary'>
                            Ano
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                2020
                            </Dropdown.Item>                            
                        </Dropdown.Menu>                    
                    </Dropdown>
                    <Dropdown>
                        <Dropdown.Toggle variant='success'>
                            Mês
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                Junho
                            </Dropdown.Item>
                            <Dropdown.Item>
                                Maio
                            </Dropdown.Item>   
                            <Dropdown.Item>
                                Abril
                            </Dropdown.Item>   
                            <Dropdown.Item>
                                Março
                            </Dropdown.Item>   
                            <Dropdown.Item>
                                Fevereiro
                            </Dropdown.Item>   
                            <Dropdown.Item>
                                Janeiro
                            </Dropdown.Item>                       
                        </Dropdown.Menu>                    
                    </Dropdown>
                </div>             
                {this.renderTable()}
            </React.Fragment>
        )
    }      
}