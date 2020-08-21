import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {Jumbotron, Form, Button, Modal} from 'react-bootstrap'
import api from '../../services/api'
import './styles.css'

function Register() {
    const [userNivel, setUserNivel] = useState(0)
    const [userNome, setUserNome] = useState('')
    const [userCpf, setUserCpf] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [userAdmin, setUserAdmin] = useState(0)
    const [userCnes, setUserCnes] = useState('')

    const [userCbo, setUserCbo] = useState('')
    const [userCargo, setUserCargo] = useState('Cargo')
    const [userCnesNome, setUserCnesNome] = useState('Lotação')

    const [ModalAviso, setModalOpen] = useState(false)
    const [ModalMensagem, setModalMensagem] = useState('')

    const buscarCpf = () => { 
        api.get(`/prof/${userCpf}`)
        .then(resp => {            
            setUserNome(resp.data.nome)
            buscarCnes(resp.data.cnes)
            buscarCbo(resp.data.cbo)
        })
        .catch(e => {
            openModal(e.message)
        })
    }
    
    const buscarCnes = cnes => {
        api.get(`/cnes/${cnes}`)
        .then(resp => { 
            setUserCnes(resp.data.cnes)
            setUserCnesNome(resp.data.nome)
        })
    }

    const buscarCbo = cbo => {
        api.get(`/cbo/${cbo}`)
        .then(resp => {
            setUserCbo(resp.data.cbo)
            setUserCargo(resp.data.nome)
        })
    }

    const register = () => {
        const formData = {
        nivel: userNivel,   
        nome: userNome,
        cpf: userCpf,
        email: userEmail,
        password: userPassword,
        admin: userAdmin,
        cnes: userCnes
       }
       console.log(formData)
       api.post('/auth/register', formData)
       .then(resp => {
           openModal(resp.data.msg)           
        })
       .catch(e => {
           console.log(e)
           openModal(e.message)
        })
    }

    const openModal = (msg) => {
        setModalMensagem(msg)
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
    }
    
    return (
        <React.Fragment>
            <Jumbotron className='bloco-registro'>
                <h1> Solicitação de Acesso </h1>
                <Form>
                    <Form.Group controlId='formBasicCPF'>
                        <Form.Label>CPF</Form.Label>
                        <Form.Control type='number' placeholder='Preencha com o seu CPF'
                        onChange={e => setUserCpf(e.target.value)} className='form-cpf' required/>
                        <Button variant="warning"
                        onClick={buscarCpf}> Buscar CPF </Button>            
                    </Form.Group>
                    <hr />              
                <Form.Group controlId='formBasicNome'>
                        <Form.Label>Nome Completo</Form.Label>
                        <Form.Control type='text' placeholder='Nome completo'
                        onChange={e => setUserNome(e.target.value)} value={userNome} required disabled/>
                    </Form.Group>                
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
                    <hr />
                    <Form.Group id='form-cargo' controlId='formBasicCargo'>
                        <Form.Label>Cargo</Form.Label>
                        <Form.Control type='text' placeholder='Cargo' value={userCargo}
                        disabled />
                    </Form.Group>
                    <Form.Group id='form-lotacao' controlId='formBasicCnes'>
                        <Form.Label>Lotação</Form.Label>
                        <Form.Control type='text' placeholder='Lotação' value={userCnesNome}
                        disabled />
                    </Form.Group>
                    <hr />
                    <Button variant="primary" onClick={register}>
                        Solicitar
                    </Button>                                
                </Form>
            </Jumbotron>
            
            <Modal show={ModalAviso} onHide={closeModal}>
                <p> { ModalMensagem } </p>
                <Button variant="primary" onClick={closeModal}>
                    Ok
                </Button>
            </Modal>
            
        </React.Fragment>
    )
}

export default Register
