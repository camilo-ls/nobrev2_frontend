import React, { useContext, useEffect, useState } from 'react'
import api from '../../services/api'
import { Table, Form, Spinner } from 'react-bootstrap'
import userContext from '../../context/userContext'

import TabelaLinha from '../tableMonitorSEMSALinha'

const TablePactSemsa = (props) => {
    const { userData } = useContext(userContext)
    const [ano, setAno] = useState('')
    const [mes, setMes] = useState('')    
    const [showDialog, setShowDialog] = useState(false)
    const [dialogMsg, setDialogMsg] = useState('')
    
    const [disa, setDisa] = useState('NORTE')
    const [listaUnidades, setListaUnidades] = useState(undefined)

    const mesesIdx = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

    const abrirDialog = (msg) => {
        setDialogMsg(msg)
        setShowDialog(true)
    }

    const fecharDialog = () => {
        setShowDialog(false)
    }

    useEffect(() => {        
        const fetchData = async () => {
            await api.get('/pact/data')
            .then(resp => {
                setAno(resp.data.ano)
                setMes(resp.data.mes + 1)
            })
            .catch(e => console.log(e))
        }

        const fetchListaUnidades = async () => {
            if (props.location.state) {
                await api.get(`/pact/faltam_pactuar/${disa}/${ano}/${mes}`)
                .then(resp => {
                    if (resp) setListaUnidades(resp.data)
                })
                .catch(e => console.log(e.message))
            }
            else if (userData.user) {
                await api.get(`/pact/faltam_pactuar/${disa}/${ano}/${mes}`)
                .then(resp => {
                    if (resp) setListaUnidades(resp.data)
                })
                .catch(e => console.log(e.message))
            }
            
        }
        fetchData()
        fetchListaUnidades()
    }, [userData, ano, mes])    

    const MontarTabelaLinhaPact = (unidade) => {
        return (
           <TabelaLinha unidade={unidade} ano={ano} mes={mes} pact={true}/>
        )
    }

    const MontarTabelaLinhaNaoPact = (unidade) => {
        return (
           <TabelaLinha unidade={unidade} ano={ano} mes={mes} pact={false}/>
        )
    }

    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 3 ?
                <>
                    <div className='cabeçalho-tabela'>
                        <h4>Pactuação das Unidades</h4>
                        <span />
                        <div>
                            <h4>Mês de Pactuação:</h4>
                            <h4>{mesesIdx[mes]}</h4>
                        </div>
                    </div>
                    <div className='sub-menu'>
                        <div></div>
                        <div></div>
                        <div>
                            <Form.Control as='select' defaultValue={disa} onChange={e => setDisa(e.target.value)}>
                                <option value='NORTE'>Norte</option>
                                <option value='SUL'>Sul</option>
                                <option value='LESTE'>Leste</option>
                                <option value='OESTE'>Oeste</option>
                                <option value='RURAL'>Rural</option>
                            </Form.Control>
                        </div>                        
                    </div>
                    <div className='disa-lista-pactuados'>
                        <div className='table_nao_pactuados'>
                            <h3>Pactuação pendente</h3>
                            <Table striped bordered size='sm'>                            
                                <thead>
                                    <tr>                                    
                                        <th className='tabela-unidade'>Unidade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaUnidades ? listaUnidades.map(MontarTabelaLinhaNaoPact) : null}
                                </tbody>
                            </Table>
                        </div>
                        <span />
                        <div className='table_pactuados'>
                            <h3>Pactuação finalizada</h3>
                            <Table striped bordered size='sm'>
                                <thead>
                                    <tr>
                                        <th className='tabela-unidade'>Unidade</th>                                    
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaUnidades ? listaUnidades.map(MontarTabelaLinhaPact) : null}
                                </tbody>
                            </Table>
                            {listaUnidades ? null : <div className='waiting-load'> <Spinner animation="border" /> <h2>Carregando. Por favor aguarde.</h2> </div>}
                        </div>
                    </div>                
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

export default TablePactSemsa