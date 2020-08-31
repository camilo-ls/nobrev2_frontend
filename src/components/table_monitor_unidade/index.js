import React, { useContext, useEffect, useState} from 'react'
import api from '../../services/api'
import { Table, Form, Spinner } from 'react-bootstrap'
import userContext from '../../context/userContext'

import TabelaLinha from '../table_monitor_linha'

import './styles.css'

const TableMonitor = (props) => {
    const { userData } = useContext(userContext)
    const [cnes, setCnes] = useState('')
    const [ano, setAno] = useState('')
    const [mes, setMes] = useState('')
    const [maxAno, setMaxAno] = useState('')
    const [maxMes, setMaxMes] = useState('')
    const [showDialog, setShowDialog] = useState(false)
    const [dialogMsg, setDialogMsg] = useState('')
    
    const [listaProcedimentos, setListaProcedimentos] = useState(undefined)

    const mesesIdx = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

    const abrirDialog = (msg) => {
        setDialogMsg(msg)
        setShowDialog(true)
    }

    const fecharDialog = () => {
        setShowDialog(false)
    }

    useEffect(() => {
        const fetchListaProcedimentos = async () => {
            if (props.cnes) {
                if (props.cnes != cnes) setCnes(props.cnes)
                setMes(props.mes)
                setAno(props.ano)
                await api.get(`/pact/unidade_pact/${props.ano}/${props.mes}/${props.cnes}`)
                .then(resp => {
                    if (resp) setListaProcedimentos(resp.data)
                })
                .catch(e => console.log(e))
            }
            else if (props.location && props.location.state) {
                await api.get(`/pact/unidade_pact/${ano}/${mes}/${props.location.state.cnes}`)
                .then(resp => {
                    if (resp) setListaProcedimentos(resp.data)
                })
                .catch(e => console.log(e))
            }
            else {
                if (userData.user) {
                    console.log(userData)          
                    await api.get(`/pact/unidade_pact/${ano}/${mes}/${userData.user.cnes}`)
                    .then(resp => {
                        if (resp) setListaProcedimentos(resp.data)                    
                    })
                    .catch(e => console.log(e))                
                }
            }            
        }
        const fetchData = async () => {
            await api.get('/pact/data')
            .then(resp => {
                setAno(resp.data.ano)
                if (props.location.state) setMes(resp.data.mes + 1)
                else setMes(resp.data.mes + 1)
                setMaxAno(resp.data.ano)
                setMaxMes(resp.data.mes + 1)                
            })
            .catch(e => console.log(e))
        }
        if (mes == '' || ano == '') fetchData()
        fetchListaProcedimentos()        
    }, [userData, ano, mes])   

    const MontarTabelaLinha = (proc) => {
        return (
           <TabelaLinha proc={proc} ano={ano} mes={mes} />
        )
    }

    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 1 ?
                <>
                    <div className='cabeçalho-tabela'>
                        <h4>Tabela de Metas</h4>
                        <span />
                        <div>
                            <span>MÊS DE PACTUAÇÃO:</span>
                            <Form className='mes-select'>
                                <Form.Control as='select' size='sm' defaultValue={mes} onChange={e => setMes(e.target.value)}>
                                    {maxMes >= 1 ? <option value='1'>Janeiro</option> : null}
                                    {maxMes >= 2 ? <option value='2'>Fevereiro</option> : null}
                                    {maxMes >= 3 ? <option value='3'>Março</option> : null}
                                    {maxMes >= 4 ? <option value='4'>Abril</option> : null}
                                    {maxMes >= 5 ? <option value='5'>Maio</option> : null}
                                    {maxMes >= 6 ? <option value='6'>Junho</option> : null}
                                    {maxMes >= 7 ? <option value='7'>Julho</option> : null}
                                    {maxMes >= 8 ? <option value='8'>Agosto</option> : null}
                                    {maxMes >= 9 ? <option value='9'>Setembro</option> : null}
                                    {maxMes >= 10 ? <option value='10'>Outubro</option> : null}
                                    {maxMes >= 11 ? <option value='11'>Novembro</option> : null}
                                    {maxMes >= 12 ? <option value='12'>Dezembro</option> : null}
                                </Form.Control>
                                <Form.Control as='select' size='sm' custom>
                                    <option value='2020'>2020</option>
                                </Form.Control>
                            </Form>
                        </div>
                    </div>
                    <div className='sub-menu'>
                        
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th className='tabela-cod'>Código</th>
                                <th className='tabela-nome'>Procedimento</th>
                                <th className='tabela-qt'>Meta</th>                                
                            </tr>
                        </thead>
                        <tbody>
                            {listaProcedimentos ? listaProcedimentos.map(MontarTabelaLinha) : null}
                        </tbody>
                    </Table>
                    {listaProcedimentos ? null : <div className='waiting-load'> <Spinner animation="border" /> <h2>Carregando. Por favor aguarde.</h2> </div>}                    
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

export default TableMonitor