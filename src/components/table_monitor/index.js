import React, { useContext, useEffect, useState} from 'react'
import api from '../../services/api'
import { Table, Button, Spinner, Form } from 'react-bootstrap'
import userContext from '../../context/userContext'

import TabelaLinha from '../table_monitor_linha'

import jspdf from 'jspdf'
import 'jspdf-autotable'

import logoCid64 from '../../img/cidbase64'
import logoNobre64 from '../../img/nobrebase64'

import './styles.css'

const TableMonitor = (props) => {
    const { userData } = useContext(userContext)
    const [cnes, setCnes] = useState(undefined)
    const [cns, setCns] = useState(undefined)
    const [nome, setNome] = useState(undefined)
    const [vinc, setVinc] = useState(undefined)
    const [ano, setAno] = useState(undefined)
    const [mes, setMes] = useState(undefined)
    const [showDialog, setShowDialog] = useState(false)
    const [dialogMsg, setDialogMsg] = useState('')

    const [listaAnos, setListaAnos] = useState(undefined)
    const [listaMeses, setListaMeses] = useState(undefined)
    const [listaProcedimentos, setListaProcedimentos] = useState(undefined)

    const mesesIdx = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

    const abrirDialog = (msg) => {
        setDialogMsg(msg)
        setShowDialog(true)
    }

    const fecharDialog = () => {
        setShowDialog(false)
    }

    useEffect(() => {
        const fetchDados = async () => {
            if (props.cnes && props.cns && props.mat) {
                if (props.cnes != cnes) setCnes(props.cnes)
                if (props.cns != cns) setCns(props.cns)
                //if (props.mat != mat) setMat(props.mat)
                
            }
            else if (props.location && props.location.state) {
                if (props.location.state.cnes != cnes) setCnes(props.location.state.cnes)
                if (props.location.state.cns != cns) setCns(props.location.state.cns)
                //if (props.location.state.mat != mat) setMat(props.location.state.mat)
                if (props.location.state.ano != ano) setAno(props.location.state.ano)
                if (props.location.state.mes != mes) setMes(props.location.state.mes)  
            }
            else {
                if (userData.user) {
                    setCnes(userData.user.cnes)
                    setCns(userData.user.cns)
                    //setMat(userData.user.mat)
                }
            }
        }

        const fetchListaProcedimentos = async () => {
            //await api.get(`prof/pmp/${ano}/${mes}/${cnes}/${cns}/${mat}`)
            //    .then(resp => {
            //        if (resp) setListaProcedimentos(resp.data)
            //        fetchNome()
            //    })
            //    .catch(e => console.log(e))
        }

        const fetchData = async () => {
            if (mes === undefined || ano === undefined) {                
                    await api.get('/pact/data')
                    .then(resp => {
                        setMes(resp.data.mes)
                        setAno(resp.data.ano)
                    })
                    .catch(e => console.log(e))
            }
        }

        const fetchNome = async () => {
            if (cns) {
                await api.get(`/prof/cns/${cns}`)
                .then(resp => {
                setNome(resp.data[0].nome)
                })
                .catch(e => console.log(e))
            }            
        }
        const fetchAnos = async () => {
            // if (cns && mat) {
            //     await api.get(`/pact/profissional/anos/${cns}/${mat}`)
            //     .then(resp => setListaAnos(resp.data))
            //     .catch(e => console.log(e))
            // }
        }
        const fetchMeses = async () => {
            // if (cns && mat && ano) {
            //     await api.get(`/pact/profissional/meses/${ano}/${cns}/${mat}`)
            //     .then(resp => setListaMeses(resp.data))
            //     .catch(e => console.log(e))
            // }
        }
        fetchData()        
        fetchDados()
        fetchAnos()
        fetchMeses()
        fetchNome()
        fetchListaProcedimentos()
    }, [userData, ano, mes, cnes, cns])

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
                head: [['Profissional', 'Ano', 'Mês']],
                body: [[nome, ano, mesesIdx[mes]]],
                margin: { top: 100 }
            })
            doc.autoTable({
                head: [['Código', 'Nome do procedimento', 'Quantidade']],
                body: listaProcedimentos.map(proc => {
                    return [proc.cod, proc.nome, proc.quantidade]
                }),
                margin: { top: 100 },
                font: 'helvetica',
                fontStyle: 'normal'
            })
            doc.save('Meta Individual - ' + nome + '.pdf')
        }
    }

    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 0 ?
                <>
                    <div className='cabeçalho-tabela'>
                        <div>
                            <h3>Tabela de Metas</h3>
                            <h5>{nome}</h5>
                        </div>
                        <span />
                        <div>
                            <h3>Mês de Monitoramento:</h3>
                            <Form className='mes-select'>
                                <Form.Control as='select' size='sm' defaultValue={mes} onChange={e => setMes(e.target.value)}>
                                    {listaMeses ? listaMeses.map(retorno => <option value={retorno.mes}>{mesesIdx[retorno.mes]}</option>) : null}
                                </Form.Control>
                                <Form.Control as='select' size='sm' custom onChange={e => setAno(e.target.value)}>
                                    {listaAnos ? listaAnos.map(retorno => <option value={retorno.ano}>{retorno.ano}</option>) : null}
                                </Form.Control>
                            </Form>
                        </div>
                    </div>
                    <div className='sub-menu'>
                        <Button variant='outline-success' onClick={imprimirPDF}>Gerar PDF</Button>
                        <div />
                        <div />
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
                    {listaProcedimentos && listaProcedimentos.length == 0 ? <div className='waiting-load'> <span /> <h2>Você não possui procedimentos.</h2></div> : null}                    
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