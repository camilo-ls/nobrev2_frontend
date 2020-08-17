import React, { useContext, useEffect, useState } from 'react'
import api from '../../services/api'
import {Table, Button, Form, Tab} from 'react-bootstrap'
import userContext from '../../context/userContext'

import './styles.css'

const TablePact = (props) => {
    const { userData } = useContext(userContext)

    const [ano, setAno] = useState(new Date().getFullYear().toString())
    const [mes, setMes] = useState(new Date().getMonth().toString())
    const [funcionario, setFuncionario] = useState({
        nome: '',
        ano: '',
        mes: '',
        cnes: '',
        cns: '',
        coeficiente: '',
        dias_pactuados: '',
        fechado: '',
        justificativa: ''
    })
    const [listaFuncionarios, setListaFuncionarios] = useState(undefined)

    useEffect(() => {
        const fetchListaFuncionarios = async () => {
            if (userData.user) {
                const ano_ = new Date().getFullYear().toString()
                const mes_ = new Date().getMonth().toString()
                await api.get(`/pact/unidade/${userData.user.cnes}/${ano_}/${mes_}`)
                .then(resp => {
                    if (resp) setListaFuncionarios(resp.data)                    
                })
                .catch(e => console.log(e))                
            }
        }
        const fetchData = async () => {

        }
        fetchListaFuncionarios()
    }, [userData])

    const faltamDias = () => {
        const date = new Date()
        const time = new Date(date.getTime())
        time.setMonth(date.getMonth() + 1)
        time.setDate(0)
        const days = time.getDate() > date.getDate() ? time.getDate() - date.getDate() : 0
        return days
    }

    const fechar = (func) => {
        console.log(func)
    }
    
    const MontarTabelaLinha = (func) => {
        return (
            <tr key={func.cns}>
                <td>{func.nome}</td>
                <td>{func.cargo}</td>                
                <td>
                    <Form.Control as='select' className='day-picker' id='day-picker' defaultValue={func.dias_pactuados}>
                        <option value='0'>0</option>
                    </Form.Control>
                </td>                    
                <td>{func.justificativa}</td>
                <td>
                    <Button variant='primary' onClick={() => fechar(func)}>Fechar</Button>
                    <Button variant='warning'>PDF</Button>
                </td>
            </tr>
        )
    }


    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 1 ?
                <>
                    <h1>Tabela de Pactuação</h1>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th className='tabela-nome'>Nome</th>
                                <th className='tabela-cargo'>Cargo</th>
                                <th className='tabela-dias'>Dias Pactuados</th>
                                <th className='tabela-justificativa'>Justificativa</th>
                                <th className='tabela-opcoes'>Opções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaFuncionarios ? listaFuncionarios.map(MontarTabelaLinha) : null}
                        </tbody>
                    </Table>
                </>
            :
                <>
                    <h1>ERRO!</h1>
                    <h3>Você não possui as permissões necessárias para acessar esta página.</h3>
                </>
            }            
        </div>
    )
}

export default TablePact