import React, { useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../../services/api'

import './styles.css'

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
        const fetchFechado = async () => setFechado(props.func.fechado)
        const fetchDiasPactuados = async () => setDiasPactuados(props.func.dias_pactuados)
        const fetchJustificativa = async () => {
            if (props.func.justificativa == '') { 
                props.func.justificativa = 'Selecione...'
                setJustificativa(props.func.justificativa)
            }
        }
        const fetchDiasUteis = async () => {
            await api.get(`/pact/dias_uteis/${props.ano}/${props.mes}`)
            .then(resp => {
                setDiasUteisMes(resp.data.dias_uteis)
            })
            .catch(e => console.log(e))
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

    const fechar = async (func, e) => {
        const novoFunc = {
            nome: props.func.nome,
            cns: props.func.cns,
            cbo: props.func.cbo,
            dias_pactuados: diasPactuados,
            fechado: fechado,
            cnes: props.cnes,
            ano: props.ano,
            mes: props.mes,
            justificativa: justificativa
        }
        console.log(novoFunc)
        api.post('/pact/pactuar', novoFunc)
        .then(resp => {
            abrirDialog(resp.data.message)
            setFechado(true)
        })
        .catch(e => abrirDialog(e.message))
    }

    return (
        <>
            <tr key={props.func.cns} className={fechado ? 'func-pactuado' : 'func-aberto'}>
                <td className='tabela-nome'><Link className='nome-prof' to={{pathname: '/profissional', state: {cns: props.func.cns}}}>{props.func.nome}</Link></td>
                <td className='tabela-cargo'>{props.func.cargo}</td>                
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
                            <option onSelect={e => abrirDialog('ai')} value='Outros'>Outros</option>                           
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
                    <Button className='botao-pact' variant='primary' onClick={(e) => fechar(props.func, e)}>Fechar</Button>
                    <Button className='botao-pact' variant='success'>PDF</Button>
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