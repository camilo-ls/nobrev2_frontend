import React, { Component } from 'react'
import api from '../../services/api'
import {Table, Button, Form} from 'react-bootstrap'
import './styles.css'

const defaultPactState = {
    cnes: 3027163,
    user: {
        id: '',
        cnes: '',
        nome: '',
        cns: '',
        cbo: '',
        cbo_nome: '',
        ine: '',
        dias_pact: 22,
        fechado: 0
    },
    list: []
}

export default class TablePact extends Component {

    state = {...defaultPactState}

    componentWillMount() {
        api.get(`/cnes/${this.state.cnes}/func`)
        .then(resp => {
            this.setState({list: resp.data})
        })
    }

    confirmFunc(id) {
        var linha = document.getElementById(id)
        linha.className = 'salvo'
    }

    renderRows() {
        return this.state.list.map(user => {
            return (
                <tr id={user.id}>
                    <td>{user.id}</td>
                    <td>{user.nome}</td>
                    <td>{user.cns}</td>
                    <td>{user.cbo_nome}</td>
                    <td>{user.ine}</td>
                    <td>
                        <Form>
                            <Form.Control as="select" className="mr-sm-2"
                            id="inlineFormCustomSelect" name="dias_pact" custom>
                                <option value='22'>22</option>
                                <option value='21'>21</option>
                                <option value='20'>20</option>
                                <option value='19'>19</option>
                                <option value='18'>18</option>
                                <option value='17'>17</option>
                                <option value='16'>16</option>
                                <option value='15'>15</option>
                                <option value='14'>14</option>
                                <option value='13'>13</option>
                                <option value='12'>12</option>
                                <option value='11'>11</option>
                                <option value='10'>10</option>
                                <option value='9'>9</option>
                                <option value='8'>8</option>
                                <option value='7'>7</option>
                                <option value='6'>6</option>
                                <option value='5'>5</option>
                                <option value='4'>4</option>
                                <option value='3'>3</option>
                                <option value='2'>2</option>
                                <option value='1'>1</option>
                                <option value='0'>0</option>
                            </Form.Control>
                        </Form>
                    </td>
                    <td>
                        <Form.Group>
                            <Form.Control type='text' placeholder='Justificativa'></Form.Control>
                        </Form.Group>
                    </td>
                    <td>
                        <Button variant='success' onClick={e => this.confirmFunc(user.id)}>Salvar</Button>
                        <Button variant='warning'>PDF</Button>
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
                        <th>ID</th>
                        <th>NOME</th>
                        <th>CNS</th>
                        <th>CARGO</th>
                        <th>INE</th>
                        <th>DIAS DE TRABALHO</th>
                        <th>JUSTIFICATIVA</th>
                        <th>AÇÕES</th>
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
                    <h1> Pactuação dos Profissionais</h1>
                    <p>Esta página será utilizada com a finalidade de realizar a pactuação mensal dos dias para cada profissionais</p>    
                </div>               
                {this.renderTable()}
            </React.Fragment>
        )
    }      
}