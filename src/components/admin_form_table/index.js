import React, {Component} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Table from 'react-bootstrap/Table'
import api from '../../services/api'

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'

const defaultFormState = {
    user: {
        nome: '',
        email: '',
        password: '',
        nivel: 0,
        admin: 0,
        ativo: 0
    },
    list: []
}

export default class userFormTable extends Component {

    state = { ...defaultFormState }

    componentWillMount() {
        api.get('/user')
        .then(resp => {
            this.setState({list: resp.data})
        })
    }

    load(user) {
        this.setState({ user })
    }
    
    clearForm() {
        this.setState({ user: defaultFormState.user })
    }

    refreshList(user) {
        const list = this.state.list.filter(u => u.id !== user.id)
        list.unshift(user)
    }

    async save() {
        const user = this.state.user
        if (user.id) {
            await api.post('/user', user)
            .then(resp => {
                const list = this.refreshList(resp.data)
                this.setState({ user: defaultFormState.user, list })
            })
        }
        else {
            await api.put(`/user/${user.id}`, user)
            .then(resp => {
                const list = this.refreshList(resp.data)
                this.setState({ user: defaultFormState, list })
            })
        }
    }

    updateField(event) {
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })
    }

    updateSwitch(event) {
        // const user = { ...this.state.user }
        // if (user[event.target.name] === 0) {
        //     this.setState(user.admin = 1)
        // }
        // else {
        //     this.setState(user.admin = 0)
        // }
        console.log(this.state)
    }

    renderForm() {
        return (
            <Form className='form'>
                <Form.Row>
                    <Form.Group as={Col} controlId='formNome'>
                        <Form.Label>Nome</Form.Label>
                        <Form.Control name='nome' type='text' placeholder='Nome completo' value={this.state.user.nome} onChange={e => this.updateField(e)}/>
                    </Form.Group>
                </Form.Row>                 
                <Form.Row>
                    <Form.Group as={Col} controlId='formEmail'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control name='email' type='email' placeholder='nome@email.com' value={this.state.user.email} onChange={e => this.updateField(e)}/>
                    </Form.Group>
                    <Form.Group as={Col} controlId='formPassword'>
                        <Form.Label>Senha</Form.Label>
                        <Form.Control name='password' type='password' placeholder='Senha' value={this.state.user.password} onChange={e => this.updateField(e)}/>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} controlId='formNivel'>
                        <Form.Label>Nível</Form.Label>
                        <Form.Control name='nivel' as='select' defaultValue='Escolha...' value={this.state.user.nivel} onChange={e => this.updateField(e)}>
                            <option>Escolha...</option>
                            <option value='0'>0 - Profissional</option>
                            <option value='1'>1 - Diretor de Unidade</option>
                            <option value='2'>2 - Distrito</option>
                            <option value='3'>3 - Secretaria</option>
                        </Form.Control>
                    </Form.Group>
                
                </Form.Row>
                <Form.Row>
                    <Form.Check className='switchClass' name='admin' type='switch' id='admin' label='Administrador' value={this.state.user.admin} onChange={e => this.updateSwitch(e)}/>
                    <Form.Check className='switchClass' name='ativo' type='switch' id='ativo' label='Ativo' value={this.state.user.ativo} onChange={e => this.updateSwitch(e)}/>
                </Form.Row>
                
                <Button className='buttonClass' variant='primary' type='submit' onClick={e => this.save(e)}>Enviar</Button>
                <Button className='buttonClass' variant='secondary' type='clear'onClick={e => this.clearForm(e)}>Limpar</Button>
            </Form>
        )
    }
    
    renderRows() {
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.nome}</td>
                    <td>{user.email}</td>
                    <td>{user.nivel}</td>
                    <td>{user.admin}</td>
                    <td>{user.ativo}</td>
                    <td>
                        <Button variant='warning' onClick={() => this.load(user)}>Editar</Button>
                    </td>
                </tr>
            )
        })
    }

    renderTable() {
        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Nível</th>
                        <th>Admin</th>
                        <th>Ativo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                   {this.renderRows()} 
                </tbody>
            </Table>
        )
    }

    render() {
        return (
            <React.Fragment>
                {this.renderForm()}
                {this.renderTable()}
            </React.Fragment>            
        )
    }
}