import React, { useState } from 'react'
import {useHistory, Link} from 'react-router-dom'
import {Jumbotron, Form, Button, Modal} from 'react-bootstrap'
import api from '../../services/api'
import './styles.css'

function Login() {
    const [userEmail, setUserEmail] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [ModalAviso, setModalOpen] = useState(false)
    const [ModalMensagem, setModalMensagem] = useState('')
    let history = useHistory()

    const openModal = (msg) => {
        setModalMensagem(msg)
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)        
    }

    const Login = async () => {
        api.post('/auth/login', {
            email: userEmail,
            password: userPassword
        })
        .then(resposta => {
            localStorage.setItem('auth-token', resposta.data.token)
            history.push('/')
            return window.location.reload(false)
        })
        .catch(erro => {
            if (erro && erro.response && erro.response.data.message) openModal(erro.response.data.message)      
        })        
    }

    return (
        <div className='login-box'>
            <Jumbotron className='login-form'>
                <h1>Acessar o Nobre</h1>
                <Form>
                    <Form.Group controlId='formBasicEmail'>
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control type='email' placeholder='nome@email.com'
                        onChange={e => setUserEmail(e.target.value)} required/>
                    </Form.Group>                
                    <Form.Group controlId='formBasicSenha'>
                        <Form.Label>Senha</Form.Label>
                        <Form.Control type='password' placeholder='Senha'
                        onChange={e => setUserPassword(e.target.value)} required/>
                    </Form.Group>
                    <Button variant="primary" onClick={Login}>
                        Acessar
                    </Button>                
                </Form>
                <p/>
                <p>Problemas com login? Envie um email para <b>camilo.sidou@pmm.am.gov.br</b></p>
                
            </Jumbotron>

            <Modal show={ModalAviso} onHide={closeModal}>
                <h5>{ModalMensagem}</h5>
                    <Button variant="primary" onClick={closeModal}>
                        Ok
                    </Button>
            </Modal>
        </div>        
    )
}

export default Login