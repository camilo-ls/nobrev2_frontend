import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import jspdf from 'jspdf'
import 'jspdf-autotable'

import './styles.css'

import logoCid64 from '../../img/cidbase64'
import logoNobre64 from '../../img/nobrebase64'

const TabelaLinha = (props) => {
    const [diasPactuados, setDiasPactuados] = useState('')
    const [diasUteisMes, setDiasUteisMes] = useState(22)
    const [maxDias, setMaxDias] = useState(31)
    const [justificativaProv, setJustificativaProv] = useState('')
    const [justificativa, setJustificativa] = useState('Selecione...')
    const [fechado, setFechado] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const [dialogMsg, setDialogMsg] = useState('')

    useEffect(() => {
        const fetchMaxDias = async () => setMaxDias(props.maxDias)
        const fetchFechado = async () => setFechado(props.func.FECHADO)
        const fetchDiasPactuados = async () => setDiasPactuados(props.func.DIAS_PACTUADOS)
        const fetchJustificativa = async () => {
            if (props.func.JUSTIFICATIVA == '' || props.func.JUSTIFICATIVA == null) { 
                props.func.JUSTIFICATIVA = 'Selecione...'                
            }
            setJustificativa(props.func.JUSTIFICATIVA)
        }
        const fetchDiasUteis = async () => {
            await api.get(`/pact/dias_uteis/${props.ano}/${props.mes}`)
            .then(resp => {
                setDiasUteisMes(resp.data.DIAS_UTEIS)
            })
            .catch(e => console.log(e))
            console.log(props.ano, props.mes, diasUteisMes)
        }

              
        fetchJustificativa()
        fetchDiasPactuados()
        fetchFechado()
        fetchDiasUteis()
        fetchMaxDias()        
    }, [])

    const abrirDialog = (msg) => {
        setDialogMsg(msg)
        setShowDialog(true)
    }

    const fecharDialog = () => {
        setShowDialog(false)
    }

    const fechar = async () => {
        const novoFunc = {
            nome: props.func.NOME_PROF,
            cns: props.func.CNS,
            vinc_id: props.func.VINC_ID,
            cbo: props.func.CBO,
            dias_pactuados: diasPactuados,
            fechado: fechado,
            cnes: props.cnes,
            ano: props.ano,
            mes: props.mes,
            justificativa: justificativa,
            dias_mes: diasUteisMes
        }        
        api.post('/pact/pactuar', novoFunc)
        .then(resp => {
            if (resp && resp.data.message) {
                abrirDialog(resp.data.message)
                setFechado(true)
            }            
        })
        .catch(e => {
            if (e && e.response.data.message) abrirDialog(e.response.data.message)
        })
    }

    const imprimirPDF = async () => {
        const mesesIdx = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
        var doc = new jspdf('p', 'pt', 'a4')
        const cabeçalho = [['Código', 'Nome do procedimento', 'Quantidade']]        
       await api.get(`prof/pmp/${props.ano}/${props.mes}/${props.cnes}/${props.func.CNS}/${props.func.VINC_ID}`)
       .then(resp => {
            if (resp) {
                console.log(resp)              
                let nome = props.func.NOME_PROF
                doc.addImage(logoNobre64, 'PNG', 50, 20, 200, 75)
                doc.addImage(logoCid64, 'PNG', 450, 20, 100, 75)
                doc.autoTable({                
                    head: [['Profissional', 'Ano', 'Mês']],
                    body: [[nome, props.ano, mesesIdx[props.mes]]],
                    margin: { top: 100 }
                })
                doc.autoTable({
                    head: cabeçalho,
                    body: resp.data.map(proc => {
                        return [proc.COD, proc.NOME_PROCED, proc.QUANTIDADE]
                    }),
                    margin: { top: 100 },
                    font: 'helvetica',
                    fontStyle: 'normal'
                })
                doc.save('Meta Individual - ' + props.func.CNS + ' - '  + nome + '.pdf')
            }
       })
       .catch(e => console.log(e))
    }
    //   <td className='tabela-nome'><Link className='nome-prof' to={{pathname: '/profissional', state: {cns: props.func.CNS, vinc_id: props.func.VINC_ID, cnes: props.cnes, nome: props.func.NOME_PROF, ano: props.ano, mes: props.mes}}}>{props.func.NOME_PROF}</Link></td>
    return (
        <>
            <tr key={props.func.VINC_ID} className={fechado ? 'func-pactuado' : 'func-aberto'}>
                <td className='tabela-nome'>{props.func.NOME_PROF}</td>
                <td className='tabela-cargo'>{props.func.NOME_CBO}</td>                
                <td className='tabela-dias'>
                    <Form.Control as='select' className='day-picker' value={diasPactuados} onChange={e => setDiasPactuados(e.target.value)}>
                        {maxDias >= 31 ? <option value='31'>31</option> : null}
                        {maxDias >= 30 ? <option value='30'>30</option> : null}
                        {maxDias >= 29 ? <option value='29'>29</option> : null}
                        {maxDias >= 28 ? <option value='28'>28</option> : null}
                        {maxDias >= 27 ? <option value='27'>27</option> : null}
                        {maxDias >= 26 ? <option value='26'>26</option> : null}
                        {maxDias >= 25 ? <option value='25'>25</option> : null}
                        {maxDias >= 24 ? <option value='24'>24</option> : null}
                        {maxDias >= 23 ? <option value='23'>23</option> : null}
                        {maxDias >= 22 ? <option value='22'>22</option> : null}
                        {maxDias >= 21 ? <option value='21'>21</option> : null}
                        {maxDias >= 20 ? <option value='20'>20</option> : null}
                        {maxDias >= 19 ? <option value='19'>19</option> : null}
                        {maxDias >= 18 ? <option value='18'>18</option> : null}
                        {maxDias >= 17 ? <option value='17'>17</option> : null}
                        {maxDias >= 16 ? <option value='16'>16</option> : null}
                        {maxDias >= 15 ? <option value='15'>15</option> : null}
                        {maxDias >= 14 ? <option value='14'>14</option> : null}
                        {maxDias >= 13 ? <option value='13'>13</option> : null}
                        {maxDias >= 12 ? <option value='12'>12</option> : null}
                        {maxDias >= 11 ? <option value='11'>11</option> : null}
                        {maxDias >= 10 ? <option value='10'>10</option> : null}
                        {maxDias >= 9 ? <option value='9'>9</option> : null}
                        {maxDias >= 8 ? <option value='8'>8</option> : null}
                        {maxDias >= 7 ? <option value='7'>7</option> : null}
                        {maxDias >= 6 ? <option value='6'>6</option> : null}
                        {maxDias >= 5 ? <option value='5'>5</option> : null}
                        {maxDias >= 4 ? <option value='4'>4</option> : null}
                        {maxDias >= 3 ? <option value='3'>3</option> : null}
                        {maxDias >= 2 ? <option value='2'>2</option> : null}
                        {maxDias >= 1 ? <option value='1'>1</option> : null}
                        {maxDias >= 0 ? <option value='0'>0</option> : null} 
                    </Form.Control>
                </td>                    
                <td className='tabela-justificativa'>
                    {diasPactuados < diasUteisMes ?
                        <Form.Control as='select' value={justificativa} onChange={e => setJustificativa(e.target.value)}>
                            <option>{justificativa}</option>
                            <option value='Licença Médica'>Licença Médica</option>
                            <option value='Licença Prêmio'>Licença Prêmio</option>
                            <option value='LIP'>LIP</option>
                            <option value='Folga'>Folga</option>
                            <option value='Férias'>Férias</option>
                            <option value='Curso ou evento'>Curso ou evento</option>
                            <option onSelect={e => abrirDialog('')} value='Outros'>Outros</option>                           
                        </Form.Control>
                    : null}
                    {diasPactuados > diasUteisMes ?
                        <Form.Control as='select' value={justificativa} onChange={e => setJustificativa(e.target.value)}>
                            <option>{justificativa}</option>
                            <option value='Compensação'>Compensação</option>
                            <option value='Outros'>Outros</option>                           
                        </Form.Control>
                    : null}
                </td>
                <td className='tabela-botoes'>
                    <Button className='botao-pact' variant='outline-primary' onClick={(e) => fechar(props.func, e)}>Fechar</Button>
                    <Button className='botao-pdf' variant='outline-success' onClick={e => imprimirPDF(e)}>PDF</Button>
                </td>
            </tr>
            <Modal show={showDialog} onHide={fecharDialog}>
                <Modal.Header closeButton>
                    <Modal.Title>Aviso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span>{dialogMsg}</span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={fecharDialog}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={justificativa == 'Outros'} onHide={fecharDialog}>
                <Modal.Header closeButton>
                    <Modal.Title>Aviso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span>Especifique as razões para a pactuação informada:</span>
                    <Form.Group className='justificativa-dialog' as='textarea' rows='5' maxLength='1000' onChange={e => setJustificativaProv(e.target.value)}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='primary' onClick={e => setJustificativa(justificativaProv)}>
                        Salvar
                    </Button>
                </Modal.Footer>
            </Modal>                      
        </>
    )
}

export default TabelaLinha