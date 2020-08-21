import React, { useContext, useEffect, useState } from 'react'
import api from '../../services/api'
import { Table, Button } from 'react-bootstrap'
import userContext from '../../context/userContext'

import TabelaLinha from '../table_pact_linha'

import './styles.css'

const TablePact = (props) => {
    const { userData } = useContext(userContext)
    const [maxDias, setMaxDias] = useState(30)
    const [ano, setAno] = useState('')
    const [mes, setMes] = useState('')
    const [showDialog, setShowDialog] = useState(false)
    const [dialogMsg, setDialogMsg] = useState('')
    
    const [listaFuncionarios, setListaFuncionarios] = useState(undefined)

    const mesesIdx = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

    const abrirDialog = (msg) => {
        setDialogMsg(msg)
        setShowDialog(true)
    }

    const fecharDialog = () => {
        setShowDialog(false)
    }

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

    const MontarTabelaLinha = (func) => {
        return (
           <TabelaLinha func={func} ano={ano} mes={mes} cnes={userData.user.cnes} maxDias={maxDias}/>
        )
    }

    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 1 ?
                <>
                    <div className='cabeçalho-tabela'>
                        <h4>Tabela de Pactuação</h4>
                        <span />
                        <div>
                            <h4>Mês de Pactuação:</h4>
                            <h4>{mesesIdx[mes]}</h4>
                        </div>
                    </div>
                    <hr />
                    <div className='sub-menu'>
                        <div></div>
                        <div></div>
                        <div>
                            <Button variant='outline-success'>Gerar PDFs</Button>
                        </div>                        
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