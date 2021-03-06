import React, { useContext, useEffect, useState} from 'react'
import api from '../../services/api'
import { Table, Form, Spinner, Button } from 'react-bootstrap'
import userContext from '../../context/userContext'

import jspdf from 'jspdf'
import 'jspdf-autotable'
import logoNobre64 from '../../img/nobrebase64'
import logoCid64 from '../../img/cidbase64'

import TabelaLinha from '../table_monitor_linha'

import './styles.css'

const TableMonitor = (props) => {
    const { userData } = useContext(userContext)
    const [cnes, setCnes] = useState(undefined)
    const [nomeUnidade, setNomeUnidade] = useState(undefined)
    const [ano, setAno] = useState(undefined)
    const [mes, setMes] = useState(undefined)
    const [maxAno, setMaxAno] = useState(undefined)
    const [maxMes, setMaxMes] = useState(undefined)
    const [showDialog, setShowDialog] = useState(false)
    const [dialogMsg, setDialogMsg] = useState('')
    
    const [listaProfissionais, setListaProfissionais] = useState(undefined)
    const [listaProcedimentos, setListaProcedimentos] = useState(undefined)
    const [listaAnos, setListaAnos] = useState(undefined)
    const [listaMeses, setListaMeses] = useState(undefined)

    const mesesIdx = ['Selecione...', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

    const abrirDialog = (msg) => {
        setDialogMsg(msg)
        setShowDialog(true)
    }

    const fecharDialog = () => {
        setShowDialog(false)
    }

    useEffect(() => {
        const fetchDados = async () => {
            if (props.cnes) {               
                setCnes(props.cnes)
            }
            else if (props.location && props.location.state) {                
                setCnes(props.location.state.cnes)
            }
            else {
                if (userData.user) {
                    setCnes(userData.user.cnes)
                }
            }
        }

        const fetchListaProcedimentos = async () => {
            await api.get(`/pact/unidade_pact/${ano}/${mes}/${cnes}`)
                .then(resp => {
                    if (resp) setListaProcedimentos(resp.data)
                })
                .catch(e => console.log(e))
        }

        const fetchData = async () => {
            await api.get('/pact/data')
            .then(resp => {
                setMes(resp.data.mes)
                setMaxMes(resp.data.mes)
                setAno(resp.data.ano)
                setMaxAno(resp.data.ano)
            })
            .catch(e => console.log(e))
        }
        const fetchNomeUnidade = async () => {
            if (props.cnes) {
                await api.get(`/cnes/${props.cnes}`)
                    .then(resp => {
                        setNomeUnidade(resp.data.NOME_UNIDADE)
                    })
                    .catch(e => console.log(e))
            }
            else if (props.location && props.location.state) {
                await api.get(`/cnes/${props.location.state.cnes}`)
                    .then(resp => {
                        setNomeUnidade(resp.data.NOME_UNIDADE)
                    })
                    .catch(e => console.log(e))
            }
            else {
                if (userData.user) {
                    await api.get(`/cnes/${userData.user.cnes}`)
                    .then(resp => {
                        setNomeUnidade(resp.data.NOME_UNIDADE)
                    })
                    .catch(e => console.log(e))
                }
            }
        }
        const fetchAnos = async () => {
            if (cnes) {
                await api.get(`/pact/anos/${cnes}`)
                .then(resp => {
                    setListaAnos(resp.data)
                })
                .catch(e => console.log(e))
            }
        }
        const fetchMeses = async () => {
            if (cnes && ano) {
                await api.get(`/pact/meses/${ano}/${cnes}`)
                .then(resp => {
                    setListaMeses(resp.data)
                })
                .catch(e => console.log(e))
            }
        }
        if (mes === undefined || ano === undefined) {
            fetchData()
        }
        fetchDados()
        fetchAnos()
        fetchMeses()
        fetchListaProcedimentos()
        fetchNomeUnidade()
    }, [userData, (ano, mes), cnes, listaProcedimentos])   

    const MontarTabelaLinha = (proc) => {
        return (
           <TabelaLinha proc={proc} ano={ano} mes={mes} />
        )
    }

    const imprimirPDF = async () => {
        var doc = new jspdf('p', 'pt', 'a4')
        doc.addImage(logoNobre64, 'PNG', 50, 20, 200, 75)
        doc.addImage(logoCid64, 'PNG', 450, 20, 100, 75)
        if (listaProcedimentos) {            
            doc.autoTable({                
                head: [['Unidade de Saúde', 'Ano', 'Mês']],
                body: [[nomeUnidade, ano, mesesIdx[mes]]],
                margin: {top: 100}
            })
            doc.autoTable({
                head: [['Código', 'Nome do procedimento', 'Quantidade']],
                body: listaProcedimentos.map(proc => {
                    return [proc.COD_PROCED, proc.NOME_PROCED, proc.QUANTIDADE]
                }),
                margin: { top: 100 },
                font: 'helvetica',
                fontStyle: 'normal'
            })
            doc.save('Meta da Unidade - ' + nomeUnidade + '.pdf')
        }
    }

    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 1 ?
                <>
                    <div className='cabeçalho-tabela'>
                        <div>
                            <h3>Tabela de Metas</h3>
                            <h5>{nomeUnidade}</h5>
                        </div>                       
                        <span />
                        <div>
                            <h3>Mês de Monitoramento:</h3>
                            <Form className='mes-select'>
                                <Form.Control as='select' size='sm' defaultValue={mes} onChange={e => setMes(e.target.value)}>
                                    <option value=''>Selecione...</option>
                                    {listaMeses ? listaMeses.map(retorno => <option value={retorno.MES}>{mesesIdx[retorno.MES]}</option>) : null}
                                </Form.Control>
                                <Form.Control as='select' size='sm' custom onChange={e => setAno(e.target.value)}>
                                    {listaAnos ? listaAnos.map(retorno => <option value={retorno.ANO}>{retorno.ANO}</option>) : null}
                                </Form.Control>
                            </Form>
                        </div>
                    </div>
                    <div className='sub-menu'>
                        <Button variant='outline-success' onClick={imprimirPDF}>Gerar PDF</Button>
                        <div />
                        <div />
                    </div>
                    <Table key={mes} striped bordered hover>
                        <thead>
                            <tr key={mes}>
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