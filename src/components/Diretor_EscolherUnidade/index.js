import React, { useContext, useEffect, useState } from 'react'
import api from '../../services/api'
import { Spinner, Form } from 'react-bootstrap'
import userContext from '../../context/userContext'
import TablePact from '../../components/table_pact'

const EscolherUnidade = (props) => {
    const { userData } = useContext(userContext)
    const [cnes, setCnes] = useState('')
    const [ano, setAno] = useState('')
    const [mes, setMes] = useState('')
    //const [showDialog, setShowDialog] = useState(false)
    //const [dialogMsg, setDialogMsg] = useState('')
    
    const [listaCnes, setListaCnes] = useState(undefined)

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

        const fetchFilhas = async () => {
            if (props.location && props.location.state) {
                await api.get(`/pact/responsabilidade/${props.location.state.cnes}`)
                .then(lista => {
                    if (lista) {
                        setListaCnes(lista.data)
                    }
                })
                .catch(e => console.log(e))
            }
            else {
                if (userData.user) {
                    await api.get(`/pact/responsabilidade/${userData.user.cnes}`)
                    .then(lista => {
                    if (lista) {
                        setListaCnes(lista.data)
                    }
                })
                .catch(e => console.log(e))
                }
            }
        }

        fetchData()
        fetchFilhas()        
    }, [userData, cnes])
        
    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 1?
                <>
                    {listaCnes ? 
                    <>
                        <div className='escolher-unidade'>
                            <Form.Control as='select' onChange={e => setCnes(e.target.value)}>
                                {listaCnes.map(unidade => <option value={unidade.cnes}>{unidade.NOME_UNIDADE}</option>)}
                            </Form.Control>
                        </div>
                        <hr />
                        <TablePact key={cnes} cnes={cnes} />
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

export default EscolherUnidade