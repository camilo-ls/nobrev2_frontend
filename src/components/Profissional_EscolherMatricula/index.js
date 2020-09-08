import React, { useContext, useEffect, useState } from 'react'
import api from '../../services/api'
import { Spinner, Form } from 'react-bootstrap'
import userContext from '../../context/userContext'
import TableMon from '../../components/table_monitor'

const EscolherMatricula = (props) => {
    const { userData } = useContext(userContext)
    const [cns, setCns] = useState('')
    const [mat, setMat] = useState('')
    const [cnes, setCnes] = useState('')
    const [ano, setAno] = useState('')
    const [mes, setMes] = useState('')
    //const [showDialog, setShowDialog] = useState(false)
    //const [dialogMsg, setDialogMsg] = useState('')
    
    const [listaMat, setListaMat] = useState(undefined)

    const mesesIdx = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

    /* const abrirDialog = (msg) => {
        setDialogMsg(msg)
        setShowDialog(true)
    }

    const fecharDialog = () => {
        setShowDialog(false)
    } */

    useEffect(() => {        
        const fetchData = async () => {
            if (props.location && props.location.state) {
                setAno(props.location.state.ano)
                setMes(props.location.state.mes)
            }
            else {
                await api.get('/pact/data')
                .then(resp => {
                    setAno(resp.data.ano)
                    setMes(resp.data.mes + 1)
                })
            .catch(e => console.log(e))
            }            
        }

        const fetchMatriculas = async () => {
            if (props.location && props.location.state) {
                await api.get(`/prof/cns/${props.location.state.cns}`)
                .then(lista => {
                    if (lista) {
                        setListaMat(lista.data)
                    }
                })
                .catch(e => console.log(e))
            }
            else {
                if (userData.user) {
                    await api.get(`/prof/cns/${userData.user.cns}`)
                    .then(lista => {
                    if (lista) {
                        setListaMat(lista.data)
                    }
                })
                .catch(e => console.log(e))
                }
            }
        }

        const fetchDados = async () => {
            if (props.cnes && props.cns && props.mat) {
                setCnes(props.cnes)
                setCns(props.cns)
                setMat(props.mat)
            }
            else if (props.location && props.location.state) {
                setCns(props.location.state.cns)
                setCnes(props.location.state.cnes)
                setMat(props.location.state.mat)
            }
            else {
                if (userData.user) {
                    setCns(userData.user.cns)
                    setCnes(userData.user.cnes)
                }
            }
        }

        fetchData()
        fetchDados()
        fetchMatriculas()
    }, [userData])
        
    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 0?
                <>
                    {listaMat ? 
                    <>
                        <div className='escolher-matricula'>
                            <Form.Control as='select' defaultValue={mat} onChange={e => setMat(e.target.value)}>
                                {listaMat.map(servidor => <option value={servidor.mat}>{servidor.mat}</option>)}
                            </Form.Control>
                        </div>
                        <hr />
                        <TableMon key={mat} cnes={cnes} cns={cns} mat={mat} />
                    </>
                    :
                    <div className='waiting-load'> <Spinner animation="border" /> <h2>Carregando. Por favor aguarde.</h2> </div>}                    
                </>
            :
                <>
                    <h1>ERRO!</h1>
                    <h3>Você não possui as permissões necessárias para acessar esta página.</h3>
                </>
            }            
        </div>
    )
}

export default EscolherMatricula