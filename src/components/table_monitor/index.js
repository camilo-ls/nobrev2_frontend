import React, { useContext, useEffect, useState} from 'react'
import api from '../../services/api'
import { Table } from 'react-bootstrap'
import userContext from '../../context/userContext'

import TabelaLinha from '../table_monitor_linha'

import procPDF from '../pdfProcedimento'
import { PDFDownloadLink } from '@react-pdf/renderer'

import './styles.css'

const TableMonitor = (props) => {
    const { userData } = useContext(userContext)
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
            if (props.location.state) {
                await api.get(`prof/pmp/${props.location.state.cns}/${ano}/${mes}`)
                .then(resp => {
                    if (resp) setListaProcedimentos(resp.data)
                })
                .catch(e => console.log(e))
            }
            else {
                if (userData.user) {
                    console.log(userData)          
                    await api.get(`/prof/pmp/${userData.user.cns}/${ano}/${mes}`)
                    .then(resp => {
                        if (resp) setListaProcedimentos(resp.data)                    
                    })
                    .catch(e => console.log(e))                
                }
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
        fetchData()
        fetchListaProcedimentos()        
    }, [userData, ano, mes])   

    const MontarTabelaLinha = (proc) => {
        return (
           <TabelaLinha proc={proc} ano={ano} mes={mes} />
        )
    }

    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 0 ?
                <>
                    <div className='cabeçalho-tabela'>
                        <h1>Tabela de Metas</h1>
                        <span />
                        <div>
                            <span>MÊS DE PACTUAÇÃO:</span>
                            <h4>{mesesIdx[mes]}</h4>
                        </div>
                    </div>
                    <div className='sub-menu'>
                        <PDFDownloadLink
                        document={
                            <procPDF data={listaProcedimentos} />
                        }
                        fileName='meta.pdf'
                        >Baixar PDFs
                        </PDFDownloadLink>
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