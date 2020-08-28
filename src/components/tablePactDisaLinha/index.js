import React, { useEffect, useState} from 'react'
import { Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'

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
            {props.unidade.fechou ?
            <tr key={props.unidade.nome}>
                <td id='unidade-nome'>{props.unidade.nome}</td>
                {props.revisao ? 
                <td>
                    <Link to={{pathname: '/disa/revisao', state: {cnes: props.unidade.cnes, ano: props.ano, mes: props.mes}}}>
                        <Button variant="outline-dark" size='sm'>Revisar</Button>
                    </Link>
                </td> : null}
            </tr>
            : null}
            {!props.unidade.fechou ?
                <tr key={props.unidade.nome}>
                    <td id='unidade-nome'>{props.unidade.nome}</td>
                    {props.revisao ? 
                    <td>
                        <Link to={{pathname: '/disa/revisao', state: {cnes: props.unidade.cnes, ano: props.ano, mes: props.mes}}}>
                            <Button variant="outline-danger" size='sm'>Pactuar</Button>
                        </Link>
                    </td> : null}
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