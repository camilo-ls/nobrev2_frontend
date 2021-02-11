import React, { useContext, useEffect, useState } from 'react'
import api from '../../services/api'
import { Table, Spinner } from 'react-bootstrap'
import userContext from '../../context/userContext'

import TabelaLinha from '../tablePactDisaLinha'

import './styles.css'

const TablePactDisa = (props) => {
    const { userData } = useContext(userContext)
    const [ano, setAno] = useState(undefined)
    const [mes, setMes] = useState(undefined)
    const [mesAnt, setMesAnt] = useState(undefined)
    const [dia, setDia] = useState(undefined)
    const [revisao, setRevisao] = useState(undefined)
    const [showDialog, setShowDialog] = useState(false)
    const [dialogMsg, setDialogMsg] = useState('')
    
    const [listaUnidadesPact, setListaUnidadesPact] = useState(undefined)
    const [listaUnidadesNPact, setListaUnidadesNPact] = useState(undefined)

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
            if (ano === undefined || mes === undefined) {
                await api.get('/pact/data')
                .then(async resp => {
                    if (resp.data.mes + 1 > 12) {
                        setMesAnt(12)
                        setMes(1)
                        setAno(resp.data.ano + 1)
                    }
                    else {
                        setAno(resp.data.ano)
                        setMes(resp.data.mes + 1)
                        setMesAnt(resp.data.mes)  
                    }      
                    setDia(resp.data.dia)
                })
                .catch(e => console.log(e))
            }
        }

        const fetchRevisao = async () => {
            if (ano && mes && (revisao === undefined)) {        
                await api.get(`/pact/data_revisao/${ano}/${mes}`)
                .then(resp => {
                    if (resp.data.DIA == dia) {
                        setRevisao(true)
                        if (mes == 1) {
                            setMes(12)
                            setAno(ano - 1)
                        }
                        else {
                            setMes(mes - 1)
                        }
                    }
                    else {
                        setRevisao(false)
                    }
                })
                .catch(e => console.log(e))     
            }         
        }

        const fetchListaUnidades = async () => {
            if (props.location.state && (listaUnidadesNPact === undefined)) {
                await api.get(`/pact/faltam_pactuar/${ano}/${mes}/${props.location.state.cnes}`)
                .then(resp => {
                    if (resp) {
                        let pactuaram = []
                        let n_pactuaram = []
                        for (let unidade of resp.data) {
                            if (unidade.fechou) pactuaram.push(unidade)
                            else n_pactuaram.push(unidade)
                        }
                        setListaUnidadesPact(pactuaram)
                        setListaUnidadesNPact(n_pactuaram)
                    }
                })
                .catch(e => console.log(e.message))
            }
            else {
                if (userData.user && listaUnidadesNPact === undefined) {
                    await api.get(`/pact/faltam_pactuar/${ano}/${mes}/${userData.user.cnes}`)
                    .then(resp => {
                        let pactuaram = []
                        let n_pactuaram = []
                        for (let unidade of resp.data) {
                            if (unidade.fechou) pactuaram.push(unidade)
                            else n_pactuaram.push(unidade)
                        }
                        setListaUnidadesPact(pactuaram)
                        setListaUnidadesNPact(n_pactuaram)
                    })
                    .catch(e => console.log(e.message))
                }
            }            
        }
        fetchData()
        fetchRevisao()
        fetchListaUnidades()
    }, [userData, listaUnidadesPact, listaUnidadesNPact, revisao])    

    const MontarTabelaLinha = (unidade) => {
        return (
           <TabelaLinha key={unidade.cnes} unidade={unidade} ano={ano} mes={mes} revisao={revisao}/>
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
                                        {revisao ? <th className='tabela-opcoes'>Opções</th> : null}
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaUnidadesNPact ? listaUnidadesNPact.map(MontarTabelaLinha) : null}
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
                                        {revisao ? <th className='tabela-opcoes'>Opções</th> : null}                                   
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaUnidadesPact ? listaUnidadesPact.map(MontarTabelaLinha) : null}
                                </tbody>
                            </Table>                            
                        </div>                        
                    </div>
                    {listaUnidadesPact && listaUnidadesNPact ? null : <div className='waiting-load'> <Spinner animation="border" /> <h2>Carregando. Por favor aguarde.</h2> </div>}            
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