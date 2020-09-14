import React, { useEffect, useState } from 'react'
import api from '../../../services/api'
import { Button, Modal } from 'react-bootstrap'

const StatLinha = (props) => {    
    const [showDialog, setShowDialog] = useState(false)
    const [dialogMsg, setDialogMsg] = useState('')

    useEffect(() => {        
    }, [])

    const abrirDialog = (msg) => {
        setDialogMsg(msg)
        setShowDialog(true)
    }

    const fecharDialog = () => {
        setShowDialog(false)
    }

    const apagar = async () => {
        await api.delete(`/stat/${props.stat.id}`)
        .then(resp => abrirDialog(resp.message))
        .catch(e => console.log(e))
    }
    
    return (
        <>
            <tr>               
                <td id='stat-agravo'>{props.stat.agravo}</td>
                <td id='stat-proc'>{props.stat.nome}</td>
                <td id='stat-mes'>{props.stat.mes}</td>
                <td id='stat-ano'>{props.stat.ano}</td>
                <td id='stat-qt'>{props.stat.quantidade}</td>
            </tr>
            <Modal show={showDialog} onHide={fecharDialog}>
                <Modal.Header closeButton>
                    <Modal.Title>Aviso</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span>{dialogMsg}</span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='success' onClick={fecharDialog}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>            
        </>
    )
}

export default StatLinha