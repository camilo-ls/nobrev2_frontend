import React, { useContext, useEffect, useState} from 'react'
import api from '../../services/api'
import { Table, Button, Spinner } from 'react-bootstrap'
import userContext from '../../context/userContext'

import TabelaLinha from '../table_monitor_linha'

import jspdf from 'jspdf'
import 'jspdf-autotable'

import './styles.css'

const TableMonitor = (props) => {
    const { userData } = useContext(userContext)
    const [cnes, setCnes] = useState('')
    const [cns, setCns] = useState('')
    const [ano, setAno] = useState('')
    const [mes, setMes] = useState('')
    const [showDialog, setShowDialog] = useState(false)
    const [dialogMsg, setDialogMsg] = useState('')
    
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
        const fetchListaProcedimentos = async () => {
            if (props.cnes && props.cns) {
                if (props.cnes != cnes) setCnes(props.cnes)
                if (props.cns != cns) setCns(props.cns)
                setMes(props.mes)
                setAno(props.ano) 
                await api.get(`prof/pmp/${cnes}/${cns}/${props.ano}/${props.mes}`)
                .then(resp => {
                    if (resp) {
                        setListaProcedimentos(resp.data) 
                    } 
                })
                .catch(e => console.log(e))
            }
            else if (props.location && props.location.state) {
                await api.get(`prof/pmp/${props.location.state.cnes}/${props.location.state.cns}/${ano}/${mes}`)
                .then(resp => {
                    if (resp) setListaProcedimentos(resp.data)
                })
                .catch(e => console.log(e))
            }
            else {
                if (userData.user) {
                    await api.get(`/prof/pmp/${userData.user.cnes}/${userData.user.cns}/${ano}/${mes}`)
                    .then(resp => {
                        if (resp) setListaProcedimentos(resp.data)                    
                    })
                    .catch(e => console.log(e))                
                }
                console.log('entrou else')
            }            
        }
        const fetchData = async () => {
            await api.get('/pact/data')
            .then(resp => {
                setAno(resp.data.ano)
                if (props.location.state) setMes(resp.data.mes + 1)
                else setMes(resp.data.mes)
            })
            .catch(e => console.log(e))
        }
        console.log(props.cnes, props.cns, props.ano, props.mes)
        fetchData()
        fetchListaProcedimentos()
    }, [userData, ano, mes])   

    const MontarTabelaLinha = (proc) => {
        return (
           <TabelaLinha proc={proc} ano={ano} mes={mes} />
        )
    }

    const imprimirPDF = async () => {
        var doc = new jspdf('p', 'pt', 'a4')
        const cabeçalho = [['Código', 'Nome do procedimento', 'Quantidade']]
        if (listaProcedimentos) {
            let nome = ''
            if (props.location && props.location.state) nome = props.location.state.nome
            else if (props.cns) await api.get(`/prof/${props.cns}`).then(resp => nome = resp.data.nome)
            else nome = userData.user.nome
            doc.autoTable({                
                head: [['Profissional', 'Ano', 'Mês']],
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
            doc.save('Meta Individual - ' + nome + '.pdf')
        }
    }

    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 0 ?
                <>
                    <div className='cabeçalho-tabela'>
                        <h4>Tabela de Metas</h4>
                        <span />
                        <div>
                            <span>Mês de Pactuação:</span>
                            <h4>{mesesIdx[mes]}</h4>
                        </div>
                    </div>
                    <div className='sub-menu'>
                        <div></div>
                        <div></div>
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