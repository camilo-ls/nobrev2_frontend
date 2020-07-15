import React, { Component } from 'react'
import api from '../../../../services/api'
import {Dropdown, DropdownButton, Table, ProgressBar} from 'react-bootstrap'
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
        nome: '',
        produzido: 0
    },
    list: []
}

export default class TableMonitorUnidade extends Component {

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
                    <td>{proc.nome}</td>
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

    reloadPage() {
        window.location.reload(false)
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
                        <Dropdown.Toggle>
                            Unidade de Saúde
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                Unidade de Saúde 1
                            </Dropdown.Item>
                            <Dropdown.Item>
                                Unidade de Saúde 2
                            </Dropdown.Item>
                            <Dropdown.Item>
                                Unidade de Saúde 3
                            </Dropdown.Item>
                            <Dropdown.Item>
                                Unidade de Saúde 4
                            </Dropdown.Item>
                            <Dropdown.Item>
                                Unidade de Saúde 5
                            </Dropdown.Item>
                        </Dropdown.Menu>                    
                    </Dropdown>
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