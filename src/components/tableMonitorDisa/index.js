import React, { useContext, useEffect, useState} from 'react'
import api from '../../services/api'
import { Table, Form, Spinner, Button } from 'react-bootstrap'
import userContext from '../../context/userContext'

import TabelaLinha from '../table_monitor_linha'

import './styles.css'

import jspdf from 'jspdf'
import 'jspdf-autotable'

const TableMonitor = (props) => {
    const { userData } = useContext(userContext)
    const [ano, setAno] = useState('')
    const [mes, setMes] = useState('')
    const [disa, setDisa] = useState(undefined)
    const [cnes, setCnes] = useState('')
    const [nome, setNome] = useState('')
    const [maxAno, setMaxAno] = useState('')
    const [maxMes, setMaxMes] = useState('')
    
    const [showDialog, setShowDialog] = useState(false)
    const [dialogMsg, setDialogMsg] = useState('')
    
    const [listaAnos, setListaAnos] = useState(undefined)
    const [listaMeses, setListaMeses] = useState(undefined)
    const [listaProcedimentos, setListaProcedimentos] = useState(undefined)
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
        const fetchDisa = async () => {
            if (props.location && props.location.state) {
                setDisa(props.location.state.disa)
            }
            else {
                if (userData.user) {
                    setDisa(userData.user.cnes)
                }
            }
        }

        const fetchNome = async () => {
            if (disa) {
                if (!cnes) setNome(disa)
                else await api.get(`/cnes/${cnes}`)
                .then(unidade => setNome(unidade.data.nome))
                .catch(e => console.log(e))
            }
        }

        const fetchUnidades = async () => {
            if (!listaUnidades) {
                await api.get(`/pact/faltam_pactuar/${ano}/${mes}/${disa}`)
                .then(unidades => setListaUnidades(unidades.data))
                .catch(e => console.log(e))
            }
        }

        const fetchListaProcedimentos = async () => {
            if (cnes == '') await api.get(`/pact/disa_pact/${ano}/${mes}/${disa}`).then(procs => setListaProcedimentos(procs.data)).catch(e => console.log(e))
            else await api.get(`/pact/unidade_pact/${ano}/${mes}/${cnes}`).then(procs => setListaProcedimentos(procs.data)).catch(e => console.log(e))
        }

        const fetchData = async () => {
            if (ano == '' || mes == '') {
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
        }

        const fetchAnos = async () => {
            if (!listaAnos) {
                await api.get(`/pact/disa/anos/${disa}`)
                .then(anos => setListaAnos(anos.data))
                .catch(e => console.log(e))
            }
        }

        const fetchMeses = async () => {
            if (!listaMeses) {
                await api.get(`/pact/disa/meses/${ano}/${disa}`)
                .then(meses => setListaMeses(meses.data))
                .catch(e => console.log(e))
            }
        }
        fetchData()
        fetchAnos()
        fetchMeses()
        fetchDisa()
        fetchUnidades()
        fetchNome()
        fetchListaProcedimentos()
    }, [userData, ano, mes, disa, cnes])   

    const MontarTabelaLinha = (proc) => {
        return (
           <TabelaLinha proc={proc} ano={ano} mes={mes} />
        )
    }

    const imprimirPDF = async () => {
        var doc = new jspdf('p', 'pt', 'a4')
        const cabeçalho = [['Código', 'Nome do procedimento', 'Quantidade']]
        if (listaProcedimentos) {            
            doc.autoTable({                
                head: [['Local', 'Ano', 'Mês']],
                body: [[nome, ano, mesesIdx[mes]]]
            })
            doc.autoTable({
                head: cabeçalho,
                body: listaProcedimentos.map(proc => {
                    return [proc.cod, proc.nome, proc.quantidade]
                }),
                margin: { top: 100 },
                font: 'helvetica',
                fontStyle: 'normal'
            })
            if (cnes == '') doc.save('Meta do Distrito - ' + nome + '.pdf')
            else doc.save('Meta da Unidade - ' + nome + '.pdf')
        }
    }

    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 2 ?
                <>
                    <div className='cabeçalho-tabela'>
                        <div>
                            <h4>Tabela de Metas</h4>
                            <Form.Control as='select' defaultValue='' onChange={e => {setListaProcedimentos(undefined); setCnes(e.target.value);}}>
                                <option value=''>{disa}</option>
                                {listaUnidades ? listaUnidades.map(unidade => <option value={unidade.cnes}>{unidade.nome}</option>) : null}
                            </Form.Control>
                        </div>                        
                        <span />
                        <div>
                            <div>
                            <span>Data de Monitoramento:</span>
                                <Form className='mes-select'>                                    
                                    <Form.Control as='select' size='sm' defaultValue={mes} onChange={e => {setListaProcedimentos(undefined); setMes(e.target.value);}}>
                                        {listaMeses ? listaMeses.map(meses => <option value={meses.mes}>{mesesIdx[meses.mes]}</option>) : null}
                                    </Form.Control>
                                    <Form.Control as='select' size='sm' custom onChange={e => setAno(e.target.value)}>
                                        {listaAnos ? listaAnos.map(anos => <option value={anos.ano}>{anos.ano}</option>) : null}
                                    </Form.Control>
                                </Form>
                            </div>                            
                        </div>
                    </div>
                    <div className='sub-menu'>
                    <Button variant='outline-success' onClick={imprimirPDF}>Gerar PDF</Button>
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