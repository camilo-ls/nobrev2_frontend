import React, { useContext, useEffect, useState } from 'react'
import api from '../../services/api'
import { Table, Spinner } from 'react-bootstrap'
import userContext from '../../context/userContext'

import TabelaLinha from '../tablePactDisaLinha'

import './styles.css'

const TablePactDisa = (props) => {
    const { userData } = useContext(userContext)
    const [ano, setAno] = useState('')
    const [mes, setMes] = useState('')
    const [dia, setDia] = useState('')
    const [revisao, setRevisao] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [dialogMsg, setDialogMsg] = useState('')
    
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
            .then(async resp => {
                setAno(resp.data.ano)
                setMes(resp.data.mes + 1)
                setDia(resp.data.dia)
                await api.get(`/pact/data_revisao/${ano}/${mes}`)
                .then(resp2 => {
                    if (resp2.data.dia == dia) {
                        setRevisao(true)
                        setMes(resp.data.mes)
                    }    
                })
                .catch(e => console.log(e.message))     
            })
            .catch(e => console.log(e))
        }

        const fetchListaUnidades = async () => {
            if (props.location.state) {
                await api.get(`/pact/faltam_pactuar/${props.location.state.cnes}/${ano}/${mes}`)
                .then(resp => {
                    if (resp) setListaUnidades(resp.data)
                })
                .catch(e => console.log(e.message))
            }
            else {
                if (userData.user) {
                    await api.get(`/pact/faltam_pactuar/${userData.user.cnes}/${ano}/${mes}`)
                    .then(resp => {
                        if (resp) setListaUnidades(resp.data)
                    })
                    .catch(e => console.log(e.message))
                }
            }            
        }
        fetchData()
        fetchListaUnidades()
    }, [userData])    

    const MontarTabelaLinhaPact = (unidade) => {
        return (
           <TabelaLinha unidade={unidade} ano={ano} mes={mes} pact={true} revisao={revisao}/>
        )
    }

    const MontarTabelaLinhaNaoPact = (unidade) => {
        return (
           <TabelaLinha unidade={unidade} ano={ano} mes={mes} pact={false} revisao={revisao}/>
        )
    }

    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 2 ?
                <>
                    <div className='cabeçalho-tabela'>
                        <div>
                            <h4><u>Monitoramento por Distrito</u></h4>
                            {userData.user.cnes == 'NORTE' ? <h4>Distrito de Saúde Norte</h4> : null}
                            {userData.user.cnes == 'SUL' ? <h4>Distrito de Saúde Sul</h4> : null}
                            {userData.user.cnes == 'LESTE' ? <h4>Distrito de Saúde Leste</h4> : null}
                            {userData.user.cnes == 'OESTE' ? <h4>Distrito de Saúde Oeste</h4> : null}
                            {userData.user.cnes == 'RURAL' ? <h4>Distrito de Saúde Rural</h4> : null}
                        </div>
                        <span />
                        <div>
                            <h4><u>Mês de Pactuação:</u></h4>
                            <h4>{mesesIdx[mes]}</h4>
                        </div>
                    </div>
                    <div className='sub-menu'>
                        <div></div>
                        <div></div>
                        <div></div>                        
                    </div>
                    <div className='disa-lista-pactuados'>
                        <div className='table_nao_pactuados'>
                            <h3>Pactuação pendente</h3>
                            <Table striped bordered size='sm'>                            
                                <thead>
                                    <tr>                                    
                                        <th className='tabela-unidade'>Unidade</th>
                                        {revisao ? <th className='tabela-unidade'>Opções</th> : null}
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
                                        {revisao ? <th className='tabela-unidade'>Opções</th> : null}                                   
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaUnidades ? listaUnidades.map(MontarTabelaLinhaPact) : null}
                                </tbody>
                            </Table>                            
                        </div>                        
                    </div>
                    {listaUnidades ? null : <div className='waiting-load'> <Spinner animation="border" /> <h2>Carregando. Por favor aguarde.</h2> </div>}            
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

export default TablePactDisa