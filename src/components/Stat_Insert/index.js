import React, {useContext, useEffect, useState} from 'react'
import api from '../../services/api'
import {Table, Form, Button} from 'react-bootstrap'
import userContext from '../../context/userContext'
import StatLinha from './Stat_Insert_Linha'

import './styles.css'

const TableStat = props => {
    const { userData } = useContext(userContext)
    
    const mesesIdx = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    
    const [ano, setAno] = useState(undefined)
    const [mes, setMes] = useState(undefined)
    const [dia, setDia] = useState(undefined)

    const [cns, setCns] = useState(undefined)

    const [agravo, setAgravo] = useState(undefined)
    const [proced, setProced] = useState(undefined)
    const [qt, setQt] = useState(undefined)

    const [listaAgravos, set_listaAgravos] = useState(undefined)
    const [listaProced, set_listaProced] = useState(undefined)

    const [listaStat, setListaStat] = useState(undefined)
    
    useEffect(() => {
        const fetchData = async () => {
            if (!mes|| !ano) {                
                await api.get('/pact/data')
                .then(resp => {
                    setAno(resp.data.ano)
                    setMes(resp.data.mes + 1)
                    setDia(resp.data.dia)
                })
                .catch(e => console.log(e))
            }
        }

        const fetchDados = async () => {
            if (!cns) {
                if (userData.user) setCns(userData.user.cns)
            }
        }
        
        const fetchAgravos = async () => {
            if (!listaAgravos) {
                await api.get('/stat/list/agravo')
                .then(resp => set_listaAgravos(resp.data))
                .catch(e => console.log(e))
            }
        }

        const fetchProcedimentos = async () => {
            await api.get(`/stat/list/cod/${agravo}`)
                .then(resp => set_listaProced(resp.data))
                .catch(e => console.log(e))
        }

        const fetchStats = async () => {
            if (cns) {
                await api.get(`/stat/list/own/${userData.user.cns}`)
                .then(resp => setListaStat(resp.data))
                .catch(e => console.log(e))
            }
        }
        fetchDados()
        fetchData()
        fetchAgravos()
        fetchProcedimentos()
        fetchStats()
    }, [userData, ano, mes, dia, cns, agravo, listaStat])
    
    const montarLinha = props => {
        return (
            <StatLinha stat={props} />
        )
    }

    const addRegistro = async (props) => {
        await api.post('/stat', {'ano': ano, 'mes': mes, 'dia': dia, 'cnes': userData.user.cnes, 'cns': userData.user.cns, 'mat': userData.user.mat, 'procedimento': proced, 'quantidade': qt})
        .then(resp => console.log(resp))
        .catch(e => console.log(e))
    }

    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 0 ?
                <>
                    <h4>Adicionar registro</h4>
                    <div className='cabeçalho-tabela-add'>
                        <Form.Control as='select' placeholder="Agravo" onChange={e => setAgravo(e.target.value)}>
                            <option>Agravo</option>
                            {listaAgravos ? listaAgravos.map(agravo => <option value={agravo.agravo}>{agravo.agravo}</option>) : null}
                        </Form.Control>
                        <Form.Control as='select' placeholder="Procedimento" onChange={e => setProced(e.target.value)}>
                            <option>Procedimento</option>
                            {listaProced ? listaProced.map(proced => <option value={proced.cod}>{proced.nome}</option>) : null}
                        </Form.Control>                        
                        <Form.Control type='number' placeholder='Quant.' onChange={e => setQt(e.target.value)} />
                        <Button variant='outline-success' onClick={e => addRegistro(e)}>Adicionar</Button>
                    </div>
                    <h4>Histórico</h4>
                    <Table stripered bordered hover>
                        <thead>
                            <tr className='cabeçalho-tabela-registro'>
                                <th className='table-stat-id'>ID</th>
                                <th className='table-stat-agravo'>Agravo</th>
                                <th className='table-stat-proc'>Procedimento</th>
                                <th className='table-stat-data'>Data</th>
                                <th className='table-stat-qt'>Quantidade</th>
                                <th className='table-stat-opcoes'>Opções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaStat && listaStat.length > 0 ? listaStat.map(montarLinha)
                            :
                            <h3>Não existem registros para serem exibidos.</h3>}
                        </tbody>
                    </Table>
                </>
            :
                null
            }
        </div>
    )
}

export default TableStat