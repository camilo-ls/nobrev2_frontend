import React, { useContext, useEffect, useState} from 'react'
import api from '../../services/api'
import { Table, Form, Spinner, Button } from 'react-bootstrap'
import userContext from '../../context/userContext'

import TabelaLinha from '../table_monitor_linha'

import './styles.css'

import jspdf from 'jspdf'
import 'jspdf-autotable'
import logoNobre64 from '../../img/nobrebase64'
import logoCid64 from '../../img/cidbase64'

import { CSVLink } from 'react-csv'

const TableMonitor = (props) => {
    const { userData } = useContext(userContext)
    const [ano, setAno] = useState(undefined)
    const [mes, setMes] = useState(undefined)
    const [disa, setDisa] = useState(undefined)
    const [cnes, setCnes] = useState('DISA')
    const [nome, setNome] = useState(undefined)
    const [maxAno, setMaxAno] = useState(undefined)
    const [maxMes, setMaxMes] = useState(undefined)
    
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
                .then(unidade => setNome(unidade.data.NOME_UNIDADE))
                .catch(e => console.log(e))
            }
        }

        const fetchUnidades = async () => {
            if (listaUnidades === undefined && ano && mes && disa) {
                await api.get(`/pact/faltam_pactuar/${ano}/${mes}/${disa}`)
                .then(unidades => {
                    setListaUnidades(unidades.data)
                })
                .catch(e => console.log(e))
            }
        }

        const fetchListaProcedimentos = async () => {
            //console.log(ano, mes)
            if (ano && mes && listaProcedimentos === undefined) {
                if (cnes == 'DISA') {
                    await api.get(`/pact/disa_pact/${ano}/${mes}/${disa}`).then(procs => setListaProcedimentos(procs.data)).catch(e => console.log(e))
                } 
                else {                    
                    await api.get(`/pact/unidade_pact/${ano}/${mes}/${cnes}`).then(procs => setListaProcedimentos(procs.data)).catch(e => console.log(e))
                }
            }
        }

        const fetchData = async () => {
            if (ano === undefined || mes === undefined) {
                await api.get('/pact/data')
                .then(resp => {
                    setMes(resp.data.mes)
                    setMaxMes(resp.data.mes)
                    setAno(resp.data.ano)
                    setMaxAno(resp.data.ano)            
                })
                .catch(e => console.log(e))
            }
        }

        const fetchAnos = async () => {
            if (listaAnos === undefined && disa) {
                await api.get(`/pact/disa/anos/${disa}`)
                .then(anos => setListaAnos(anos.data))
                .catch(e => console.log(e))
            }
        }

        const fetchMeses = async () => {
            if (listaMeses === undefined && ano && disa) {
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

        console.log(ano, mes, disa, cnes)
    }, [userData, ano, mes, disa, cnes, listaProcedimentos])

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
                head: [['Local', 'Ano', 'Mês']],
                body: [[nome, ano, mesesIdx[mes]]],
                margin: {top: 100}
            })
            doc.autoTable({
                head: [['Código', 'Nome do procedimento', 'Quantidade']],
                body: listaProcedimentos.map(proc => {
                    return [proc.COD_PROCED, proc.NOME_PROCED, proc.QUANTIDADE]
                }),
                font: 'helvetica',
                fontStyle: 'normal'
            })
            if (cnes === undefined) doc.save('Meta do Distrito - ' + nome + '.pdf')
            else doc.save('Meta da Unidade - ' + nome + '.pdf')
        }
    }

    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 2 && ano && mes?
                <>
                    <div className='cabeçalho-tabela'>
                        <div>
                            <h4>Tabela de Metas</h4>
                            <Form.Control as='select' defaultValue='' onChange={e => {
                                setCnes(e.target.value)
                                setListaProcedimentos(undefined);
                            }}>
                                <option value='DISA'>{disa}</option>
                                {listaUnidades ? listaUnidades.map(unidade => <option value={unidade.cnes}>{unidade.nome}</option>) : null}
                            </Form.Control>
                        </div>                        
                        <span />
                        <div>
                            <div>
                            <span>Data de Monitoramento:</span>
                            <Form className='mes-select'>                                    
                                <Form.Control as='select' size='sm' custom defaultValue={mes} onChange={e => {
                                    setMes(e.target.value) 
                                    setListaProcedimentos(undefined)
                                }}>
                                    {listaMeses ? listaMeses.map(meses => <option value={meses.MES}>{mesesIdx[meses.MES]}</option>) : null}
                                </Form.Control>
                                <Form.Control as='select' size='sm' custom defaultValue={ano} onChange={e => {
                                    setAno(e.target.value)
                                    setListaProcedimentos(undefined)
                                    setListaMeses(undefined)
                                }}>
                                    {listaAnos ? listaAnos.map(anos => <option value={anos.ANO}>{anos.ANO}</option>) : null}
                                </Form.Control>
                            </Form>
                            </div>                            
                        </div>
                    </div>
                    <div className='sub-menu'>
                    <Button variant='outline-success' onClick={imprimirPDF}>Gerar PDF</Button>
                    {listaProcedimentos? <CSVLink data={listaProcedimentos}>Gerar CSV</CSVLink> : null}
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