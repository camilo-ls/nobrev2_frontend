import React, { useContext, useEffect, useState } from 'react'
import api from '../../services/api'
import { Table, Form, Spinner } from 'react-bootstrap'
import userContext from '../../context/userContext'

import MonIndividual from '../../components/table_monitor'

import './styles.css'

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

    const [func, setFunc] = useState(undefined)
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

        const fetchFunc = async () => {
            if (ano && mes && cns && mat)
            await api.get(`/prof/id/${ano}/${mes}/${cns}/${mat}`)
            .then(func => setFunc(func.data))
            .catch(e => console.log(e))
        }

        fetchData()
        fetchAnos()
        fetchMeses()
        fetchUnidades()
        fetchListaFuncionarios()
        fetchFunc()
    }, [userData, ano, mes, disa, cnes, cns, mat])    

    const setDados = (e) => {
        const cns = e.target.value
        const mat = e.target.selectedOptions[0].getAttribute('data-mat')
        setCns(cns)
        setMat(mat)
    }  
    
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
                            <Form.Control as='select' defaultValue={mat} onChange={e => { setDados(e) }}>
                                <option mat='' value='null'>Selecione...</option>
                                {listaFuncionarios ? listaFuncionarios.map(func => <option data-func={func} data-mat={func.mat} value={func.cns}>{func.nome}</option>) : null}
                            </Form.Control>    
                        </div>                        
                    </div>                    
                    <hr />
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr className='tabela-info-prof'>
                                <th>Cargo</th>
                                <th>Matricula</th>
                                <th>Coef. ESAP</th>
                                <th>Dias Pactuados</th>                                
                                <th>Coef. Mês</th>                                
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='tabela-info-prof'>
                                {func ? <td>{func.nome}</td> : <td>...</td>}
                                {func ? <td>{func.mat}</td> : <td>...</td>}
                                {func ? <td>{func.coef_ESAP}</td> : <td>...</td>}
                                {func ? <td>{func.dias_pactuados}</td> : <td>...</td>}                                
                                {func ? <td>{func.coeficiente}</td> : <td>...</td>}                                                           
                             </tr>
                        </tbody>
                    </Table>
                    <Table striped bordered hover size="sm">
                        <thead>
                            <tr className='tabela-just-prof'>
                                <th>Justificativa</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {func && func.justificativa ? <td>{func.justificativa}</td> : <td>...</td>}
                            </tr>
                        </tbody>                                      
                    </Table>
                    {cns && mat && cnes ? <MonIndividual key={mat} func={func} cnes={cnes} cns={cns} mat={mat} ano={ano} mes={mes} /> : null}
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