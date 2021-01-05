import React, { useEffect, useState} from 'react'
import { Button, Modal } from 'react-bootstrap'

import './styles.css'

const TabelaMLinha = (props) => {    
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
            <tr key={props.proc.cod}>
                <td id='proc-cod'>{props.proc.COD_PROCED}</td>
                <td id='proc-nome'>{props.proc.NOME_PROCED}</td>
                <td id='proc-qt'>{props.proc.QUANTIDADE}</td>
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

export default TabelaMLinha