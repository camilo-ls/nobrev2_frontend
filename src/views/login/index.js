import React, { useState } from 'react'
import {useHistory, Link} from 'react-router-dom'
import {Jumbotron, Form, Button, Modal} from 'react-bootstrap'
import api from '../../services/api'
import LogoNobre from '../../img/nobre.png'
import './styles.css'

function Login() {
    const [userEmail, setUserEmail] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [ModalAviso, setModalOpen] = useState(false)
    const [ModalMensagem, setModalMensagem] = useState('')
    let history = useHistory()

    const openModal = () => {
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)        
    }

    const mensagemModal = (mensagem) => {
        setModalMensagem(mensagem)
    }

    const Login = async () => {
        console.log(userEmail, userPassword)
        api.post('/auth/login', {
            email: userEmail,
            password: userPassword
        })
        .then(resposta => {
            localStorage.setItem('auth-token', resposta.data.token)
            return history.push('/')
        })
        .catch(erro => {
            mensagemModal(erro.message)
            openModal()
        })        
    }

    return (
        <div className='login-box'>            
            <img src={LogoNobre}></img>
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
                <a href='/register'>Solicitar Acesso</a>
                </Form>
            </Jumbotron>

            <Modal show={ModalAviso} onHide={closeModal}>
                <h1 value={ModalMensagem}></h1>
                    <Button variant="primary" onClick={closeModal}>
                        Ok
                    </Button>
            </Modal>
        </div>        
    )
}

export default Login