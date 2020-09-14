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

    const [listaAnos, setListaAnos] = useState(undefined)
    const [listaMeses, setListaMeses] = useState(undefined)
    
    const [listaUnidades, setListaUnidades] = useState(undefined)
    const [listaFuncionarios, setListaFuncionarios] = useState(undefined)

    const [disa, setDisa] = useState(undefined)
    const [cnes, setCnes] = useState(undefined)
    const [cns, setCns] = useState(undefined)
    const [mat, setMat] = useState(undefined)

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
            if (ano == '' || mes == '') {
                await api.get('/pact/data')
                    .then(resp => {
                        setAno(resp.data.ano)
                        if (props.location.state) setMes(resp.data.mes + 1)
                        else setMes(resp.data.mes + 1)                       
                    })
                    .catch(e => console.log(e))
            }
        }

        const fetchAnos = async () => {
            if (!listaAnos) {
                await api.get(`/pact/semsa/anos`)
                    .then(anos => setListaAnos(anos.data))
                    .catch(e => console.log(e))
            }
        }

        const fetchMeses = async () => {
            if (!listaMeses) {
                await api.get(`/pact/semsa/meses/${ano}`)
                    .then(meses => setListaMeses(meses.data))
                    .catch(e => console.log(e))
            }
        }

        const fetchUnidades = async () => {
            await api.get(`/pact/faltam_pactuar/${ano}/${mes}/${disa}`)
                    .then(unidades => setListaUnidades(unidades.data))
                    .catch(e => console.log(e))
        }

        const fetchListaFuncionarios = async () => {
            await api.get(`/pact/unidade/${ano}/${mes}/${cnes}`)
                .then(resp => {
                    if (resp) setListaFuncionarios(resp.data)
                })
                .catch(e => console.log(e))
        }

        fetchData()
        fetchAnos()
        fetchMeses()
        fetchUnidades()
        fetchListaFuncionarios()
        console.log(disa, cnes, cns, mat)
    }, [userData, ano, mes, disa, cnes, cns, mat])    

    
    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 3 ?
                <>
                    <div className='cabeçalho-tabela'>
                        <h4>Pactuação das Unidades</h4>
                        <span />
                        <div>
                        </div>
                    </div>
                    <hr />
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
                            <Form.Control as='select' defaultValue={cnes} onChange={e => setCnes(e.target.value)}>
                                <option value='null'>Selecione...</option>
                                {listaUnidades ? listaUnidades.map(unidade => <option value={unidade.cnes}>{unidade.nome}</option>) : null}
                            </Form.Control>
                        </div>
                        <div>
                            <Form.Control as='select' defaultValue={mat} onChange={e => { setCns(e.target.value); setMat(e.target.dataset.data-mat.value); }}>
                                <option mat='' value='null'>Toda a Unidade</option>
                                {listaFuncionarios ? listaFuncionarios.map(func => <option mat={func.mat} value={func.cns}>{func.nome}</option>) : null}
                            </Form.Control>    
                        </div>                        
                    </div>
                    <hr />
                    {mat && cnes ? <MonIndividual key={mat} cnes={cnes} cns={cns} mat={mat} ano={ano} mes={mes} /> : null}
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