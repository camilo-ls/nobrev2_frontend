import React, { useState } from 'react'
import {Jumbotron, Form} from 'react-bootstrap'
import './styles.css'

function Register() {
    const [userNivel, setUserNivel] = useState(0)
    const [userNome, setUserNome] = useState('')
    const [userCpf, setUserCpf] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [userAdmin, setUserAdmin] = useState(0)
    const [userCnes, setUserCnes] = useState('')
    
    return (
        <Jumbotron className='bloco-registro'>
            <h1> Solicitação de Acesso </h1>
            <Form>
               <Form.Group controlId='formBasicNome'>
                    <Form.Label>Nome Completo</Form.Label>
                    <Form.Control type='text' placeholder='Preencha com o seu nome' />
                </Form.Group>
                <Form.Group controlId='formBasicCPF'>
                    <Form.Label>CPF</Form.Label>
                    <Form.Control type='text' placeholder='Preencha com o seu CPF' />
                </Form.Group>
                <Form.Group controlId='formBasicCPF'>
                    <Form.Label>CPF</Form.Label>
                    <Form.Control type='text' placeholder='Preencha com o seu CPF' />
                </Form.Group>
                <Form.Group controlId='formBasicEmail'>
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control type='email' placeholder='nome@email.com' />
                </Form.Group>
                <Form.Group controlId='formBasicEmailConf'>
                    <Form.Label>E-mail (confirmação)</Form.Label>
                    <Form.Control type='email' placeholder='nome@email.com' />
                </Form.Group>
            </Form>
        </Jumbotron>
    )
}

export default Register