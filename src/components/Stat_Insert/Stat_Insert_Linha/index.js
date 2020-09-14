import React, { useEffect, useState } from 'react'
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
    
    return (
        <>
            <tr key={props.stat.id}>
                <td id='stat-id'>{props.stat.id}</td>
                <td id='stat-agravo'>{props.stat.agravo}</td>
                <td id='stat-proc'>{props.stat.procedimento}</td>
                <td id='stat-data'>{props.stat.dia}/{props.stat.mes}/{props.stat.ano}</td>
                <td id='stat-qt'>{props.stat.quantidade}</td>
                <td id='stat-opcoes'><Button variant='outline-danger'>Apagar</Button></td>
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