import React, { useContext, useEffect, useState } from 'react'
import api from '../../services/api'
import { Table, Form, Spinner } from 'react-bootstrap'
import userContext from '../../context/userContext'

import MonIndividual from '../../components/table_monitor'

const TablePactSemsa = (props) => {
    const { userData } = useContext(userContext)
    const [ano, setAno] = useState('')
    const [mes, setMes] = useState('')    
    const [showDialog, setShowDialog] = useState(false)
    const [dialogMsg, setDialogMsg] = useState('')
    
    const [listaUnidades, setListaUnidades] = useState(undefined)
    const [listaFuncionarios, setListaFuncionarios] = useState(undefined)

    const [disa, setDisa] = useState(undefined)
    const [unidade, setUnidade] = useState(undefined)
    const [funcionario, setFuncionario] = useState(undefined)

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
        const fetchListaFuncionarios = async () => {                
            if (unidade) {                
                await api.get(`/pact/unidade/${unidade}/${ano}/${mes}`)
                .then(resp => {
                    if (resp) setListaFuncionarios(resp.data)                    
                })
                .catch(e => console.log(e))                
            }
        }
        fetchData()
        fetchListaUnidades()
        fetchListaFuncionarios()
    }, [userData, ano, mes, disa, unidade, funcionario])    

    
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
                        <div>
                            <Form.Control as='select' value={disa} onChange={e => setDisa(e.target.value)}>
                                <option>Selecione...</option>
                                <option value='NORTE'>NORTE</option>
                                <option value='SUL'>SUL</option>
                                <option value='LESTE'>LESTE</option>
                                <option value='OESTE'>OESTE</option>
                                <option value='RURAL'>RURAL</option>
                            </Form.Control>
                        </div>
                        <div>
                            <Form.Control as='select' defaultValue={unidade} onChange={e => setUnidade(e.target.value)}>
                                {listaUnidades ? listaUnidades.map(unidade => <option value={unidade.cnes}>{unidade.nome}</option>) : null}
                            </Form.Control>
                        </div>
                        <div>
                            <Form.Control as='select' defaultValue={funcionario} onChange={e => setFuncionario(e.target.value) }>
                                <option value='null'>Toda a Unidade</option>
                                {listaFuncionarios ? listaFuncionarios.map(func => <option value={func.cns}>{func.nome}</option>) : null}
                            </Form.Control>    
                        </div>                        
                    </div>
                    {funcionario ? <MonIndividual key={funcionario} cnes={unidade} cns={funcionario} ano={ano} mes={mes} /> : null}
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