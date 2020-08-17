import React, { useContext, useEffect, useState } from 'react'
import api from '../../services/api'
import {Table, Button, Form, Tab} from 'react-bootstrap'
import userContext from '../../context/userContext'

import './styles.css'

const TablePact = (props) => {
    const { userData } = useContext(userContext)
    const [maxDias, setMaxDias] = useState(30)
    const [ano, setAno] = useState('')
    const [mes, setMes] = useState('')
    const [showDialog, setShowDialog] = useState(false)
    const [dialogMsg, setDialogMsg] = useState('')
    
    const [listaFuncionarios, setListaFuncionarios] = useState(undefined)

    useEffect(() => {
        const fetchListaFuncionarios = async () => {
            if (userData.user) {                
                await api.get(`/pact/unidade/${userData.user.cnes}/${ano}/${mes}`)
                .then(resp => {
                    if (resp) setListaFuncionarios(resp.data)                    
                })
                .catch(e => console.log(e))                
            }
        }
        const fetchData = async () => {
            await api.get('/pact/data')
            .then(resp => {
                setAno(resp.data.ano)
                setMes(resp.data.mes + 1)
            })
            .catch(e => console.log(e))
        }
        const fetchMaxDias = async () => {
            await api.get(`/pact/dias_mes/${ano}/${mes}`)
            .then(resp => {
                setMaxDias(resp.data.dias)
            })
            .catch(e => console.log(e))
        }
        fetchData()
        fetchListaFuncionarios()
        fetchMaxDias()
    }, [userData, ano, mes])

    const faltamDias = () => {
        const date = new Date()
        const time = new Date(date.getTime())
        time.setMonth(date.getMonth() + 1)
        time.setDate(0)
        const days = time.getDate() > date.getDate() ? time.getDate() - date.getDate() : 0
        return days
    }



    const fechar = async (func) => {
        const novoFunc = {
            nome: func.nome,
            cns: func.cns,
            cbo: func.cbo,
            dias_pactuados: func.dias_pactuados,
            fechado: func.fechado,
            cnes: userData.user.cnes,
            ano: ano,
            mes: mes,
            justificativa: func.justificativa
        }
        console.log(novoFunc)
        api.post('/pact/pactuar', novoFunc)
        .then(resp => {
            
        })
    }

    const MontarTabelaLinha = (func) => { 
        
        return (
            <tr key={func.cns} className={func.fechado ? 'func-pactuado' : 'func-aberto'}>
                <td>{func.nome}</td>
                <td>{func.cargo}</td>                
                <td>
                    <Form.Control as='select' className='day-picker' id='day-picker' defaultValue={func.dias_pactuados} onChange={value => func.dias_pactuados = value}>
                        {maxDias >= 31 ? <option value='31'>31</option> : null}
                        {maxDias >= 30 ? <option value='30'>30</option> : null}
                        {maxDias >= 29 ? <option value='29'>29</option> : null}
                        {maxDias >= 28 ? <option value='28'>28</option> : null}
                        {maxDias >= 27 ? <option value='27'>27</option> : null}
                        {maxDias >= 26 ? <option value='26'>26</option> : null}
                        {maxDias >= 25 ? <option value='25'>25</option> : null}
                        {maxDias >= 24 ? <option value='24'>24</option> : null}
                        {maxDias >= 23 ? <option value='23'>23</option> : null}
                        {maxDias >= 22 ? <option value='22'>22</option> : null}
                        {maxDias >= 21 ? <option value='21'>21</option> : null}
                        {maxDias >= 20 ? <option value='20'>20</option> : null}
                        {maxDias >= 19 ? <option value='19'>19</option> : null}
                        {maxDias >= 18 ? <option value='18'>18</option> : null}
                        {maxDias >= 17 ? <option value='17'>17</option> : null}
                        {maxDias >= 16 ? <option value='16'>16</option> : null}
                        {maxDias >= 15 ? <option value='15'>15</option> : null}
                        {maxDias >= 14 ? <option value='14'>14</option> : null}
                        {maxDias >= 13 ? <option value='13'>13</option> : null}
                        {maxDias >= 12 ? <option value='12'>12</option> : null}
                        {maxDias >= 11 ? <option value='11'>11</option> : null}
                        {maxDias >= 10 ? <option value='10'>10</option> : null}
                        {maxDias >= 9 ? <option value='9'>9</option> : null}
                        {maxDias >= 8 ? <option value='8'>8</option> : null}
                        {maxDias >= 7 ? <option value='7'>7</option> : null}
                        {maxDias >= 6 ? <option value='6'>6</option> : null}
                        {maxDias >= 5 ? <option value='5'>5</option> : null}
                        {maxDias >= 4 ? <option value='4'>4</option> : null}
                        {maxDias >= 3 ? <option value='3'>3</option> : null}
                        {maxDias >= 2 ? <option value='2'>2</option> : null}
                        {maxDias >= 1 ? <option value='1'>1</option> : null}
                        {maxDias >= 0 ? <option value='0'>0</option> : null} 
                    </Form.Control>
                </td>                    
                <td>
                    
                </td>
                <td>
                    <Button variant='primary' onClick={(e) => fechar(func)}>Fechar</Button>
                    <Button variant='warning'>PDF</Button>
                </td>
            </tr>
        )
    }

    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 1 ?
                <>
                    <div className='cabeçalho-tabela'>
                        <h1>Tabela de Pactuação</h1>
                    </div>
                    

                    <Table>
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