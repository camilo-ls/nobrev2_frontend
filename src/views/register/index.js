import React, { useState } from 'react'
import {Jumbotron, Form, Button} from 'react-bootstrap'
import bcrypt from 'bcrypt'
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

    const buscarCpf = () => { 
        api.get(`/prof/${userCpf}`)
        .then(resp => {            
            setUserNome(resp.data.nome)
            buscarCnes(resp.data.cnes)
            buscarCbo(resp.data.cbo)
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
        const hashedPassword = bcrypt
       const formData = {
        nivel: userNivel,   
        nome: userNome,
        cpf: userCpf,
        email: userEmail,
        password: userPassword,
        admin: userAdmin,
        cnes: userCnes,
        ativo: 0
       }
    }
    
    return (
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
                    <Form.Control type='text' placeholder='Preencha com o seu nome completo'
                    onChange={e => setUserNome(e.target.value)} value={userNome} required/>
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
                <Form.Group id='form-cargo' controlId='formBasicCnes'>
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
                <Button variant="primary" type="submit"
                onSubmit={register}>
                    Solicitar
                </Button>                                
            </Form>
        </Jumbotron>
    )
}

export default Register
