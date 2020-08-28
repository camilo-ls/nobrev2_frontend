import React, { useContext, useEffect, useState } from 'react'
import api from '../../services/api'
import { Table, Spinner } from 'react-bootstrap'
import userContext from '../../context/userContext'

import TabelaLinha from '../table_pact_linha'

import './styles.css'

const TablePact = (props) => {
    const { userData } = useContext(userContext)
    const [nomeUnidade, setNomeUnidade] = useState('')
    const [cnes, setCnes] = useState('')
    const [maxDias, setMaxDias] = useState(30)
    const [ano, setAno] = useState('')
    const [mes, setMes] = useState('')
    //const [showDialog, setShowDialog] = useState(false)
    //const [dialogMsg, setDialogMsg] = useState('')
    
    const [listaFuncionarios, setListaFuncionarios] = useState(undefined)

    const mesesIdx = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

    /* const abrirDialog = (msg) => {
        setDialogMsg(msg)
        setShowDialog(true)
    }

    const fecharDialog = () => {
        setShowDialog(false)
    } */

    useEffect(() => {
        const fetchListaFuncionarios = async () => {
            if (props.location && props.location.state) {
                await api.get(`/pact/unidade/${props.location.state.cnes}/${props.location.state.ano}/${props.location.state.mes}`)
                .then(resp => {
                    if (resp) setListaFuncionarios(resp.data)
                    setCnes(props.location.state.cnes)                  
                })
                .catch(e => console.log(e))
            }
            else {
                if (userData.user) {                
                    await api.get(`/pact/unidade/${userData.user.cnes}/${ano}/${mes}`)
                    .then(resp => {
                        if (resp) setListaFuncionarios(resp.data)
                        setCnes(userData.user.cnes)                
                    })
                    .catch(e => console.log(e))                
                }
            }
        }

        const fetchData = async () => {
            if (props.location && props.location.state) {
                setAno(props.location.state.ano)
                setMes(props.location.state.mes)
            }
            else {
                await api.get('/pact/data')
                .then(resp => {
                    setAno(resp.data.ano)
                    setMes(resp.data.mes + 1)
                })
            .catch(e => console.log(e))
            }            
        }

        const fetchMaxDias = async () => {
            if (props.location && props.location.state) {
                await api.get(`/pact/dias_mes/${props.location.state.ano}/${props.location.state.mes}`)
                .then(resp => {
                    setMaxDias(resp.data.dias)
                })
                .catch(e => console.log(e))
            }
            else {
                await api.get(`/pact/dias_mes/${ano}/${mes}`)
                .then(resp => {
                    setMaxDias(resp.data.dias)
                })
                .catch(e => console.log(e))
            }
        }

        const fetchNomeUnidade = async () => {
            if (props.location && props.location.state) {
                await api.get(`/cnes/${props.location.state.cnes}`)
                    .then(resp => {
                        setNomeUnidade(resp.data.nome)
                    })
                    .catch(e => console.log(e))
            }
            else {
                if (userData.user) {
                    await api.get(`/cnes/${userData.user.cnes}`)
                    .then(resp => {
                        setNomeUnidade(resp.data.nome)
                    })
                    .catch(e => console.log(e))
                }
            }
        }

        fetchData()
        fetchListaFuncionarios()
        fetchMaxDias()
        fetchNomeUnidade()
    }, [userData, ano, mes])
    
    const MontarTabelaLinha = (func) => {
        return (
           <TabelaLinha func={func} ano={ano} mes={mes} cnes={cnes} maxDias={maxDias}/>
        )
    }   

    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 1 ?
                <>
                    <div className='cabeçalho-tabela'>
                        <div>
                            <h3>Tabela de Pactuação</h3>
                            <h5>{nomeUnidade}</h5>
                        </div>                        
                        <span />
                        <div>
                            <h3>Mês de Pactuação:</h3>
                            <h5>{mesesIdx[mes]}</h5>
                        </div>
                    </div>
                    <hr />
                    <div className='sub-menu'>
                        <div></div>
                        <div></div>
                        <div></div>                        
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
                    {listaFuncionarios ? null : <div className='waiting-load'> <Spinner animation="border" /> <h2>Carregando. Por favor aguarde.</h2> </div>}                    
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