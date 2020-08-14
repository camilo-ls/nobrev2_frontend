import React, { useContext, useEffect, useState } from 'react'
import api from '../../services/api'
import {Table, Button, Form} from 'react-bootstrap'
import userContext from '../../context/userContext'

import './styles.css'

const TablePact = () => {
   const [cnes, setCnes] = useState('')
   const [list, setList] = useState(undefined)
   const [user, setUser] = useState({
       id: '',
       cns: '',
       cbo: '',
       cbo_nome: '',
       ine: '',
       dias_pact: '',
       fechado: '',
       justificativa: ''
   })

   const { userData, setUserData } = useContext(userContext)   

    useEffect(() => {
        const updateCnes = async () => {
            setCnes(userData.user.cnes)
        }
        const updateList = async () => {
            const cnes = userData.cnes
            api.get(`/cnes/${cnes}/func`)
            .then(resp => {
                setList(resp.data)
                console.log(resp.data)
            }
        )}
        updateCnes()  
        updateList()
        
    }, [])

    const confirmFunc = (id) => {
        var linha = document.getElementById(id)
        linha.className = 'salvo'
    }

    const updateState = (user, event) => {
        user[event.target.name] = event.target.value      
    }

    const getJustificativa = (user) => {
        const cns = user.cns
        api.get(`/cnes/pact/${cns}`)
        .then(justificativa => {
            if (justificativa) {
                console.log(justificativa)
            }
        })
    }

    const salvarPact = (user) => {
        this.confirmFunc(user.id)
        if (!user.dias_pact) user.dias_pact = 22
        if (!user.justificativa) user.justificativa = ''
        let data = new Date()
        user.mes = data.getMonth()
        user.ano = data.getFullYear()
        console.log(user)
        api.post(`/cnes/pact`, user)
        .then(resp => {
            this.confirmFunc(user.id)
            console.log(resp)
        })
    }   

    const gerarPDF = (user) => {
        
    }

    const renderRow = (user) => {
        return (
            <tr id={user.id}>
                <td>{user.id}</td>
                <td>{user.nome}</td>
                <td>{user.cns}</td>
                <td>{user.cbo_nome}</td>
                <td>{user.ine}</td>
                <td>
                    <Form>
                        <Form.Control as="select" defaultValue='22' className="mr-sm-2" name="dias_pact" onChange={e => updateState(user, e)} custom>
                            <option value='31'>31</option>
                            <option value='30'>30</option>
                            <option value='29'>29</option>
                            <option value='28'>28</option>
                            <option value='27'>27</option>
                            <option value='26'>26</option>
                            <option value='25'>25</option>
                            <option value='24'>24</option>
                            <option value='23'>23</option>
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
                        <Form.Control type='text' name='just' placeholder='Justificativa' onChange={e => this.updateState(user, e)} />
                    </Form.Group>
                </td>
                <td>
                    <Button variant='success' onClick={e => this.salvarPact(user)}>Salvar</Button>
                    <Button variant='warning' onClick={e => this.gerarPDF(user)}>PDF</Button>
                </td>
            </tr>
        )
    }

    const renderRows = () => {
        return list.map(user => {
            renderRow(user)
        })
    }

    const renderTable = () => {
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
                    {renderRows()}
                </tbody>
            </Table>
        )
    }
    
    return (
        <React.Fragment>
            <div className='pact-header'>
                <h1> Pactuação dos Profissionais</h1>
                <p>Esta página será utilizada com a finalidade de realizar a pactuação mensal dos dias para cada profissionais</p>    
            </div>               
            {renderTable()}
        </React.Fragment>
    )    
}

export default TablePact