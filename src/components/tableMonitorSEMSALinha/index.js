import React, { useEffect, useState} from 'react'
import { Button, Modal } from 'react-bootstrap'

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
            {props.unidade.fechou && props.pact ?
            <tr key={props.unidade.nome}>
                <td id='unidade-nome'>{props.unidade.nome}</td>
            </tr>
            : null}
            {!props.unidade.fechou && !props.pact ?
                <tr key={props.unidade.nome}>
                    <td id='unidade-nome'>{props.unidade.nome}</td>
                </tr>
            : null}
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