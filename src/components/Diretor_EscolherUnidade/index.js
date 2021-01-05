import React, { useContext, useEffect, useState } from 'react'
import api from '../../services/api'
import { Spinner, Form } from 'react-bootstrap'
import userContext from '../../context/userContext'
import TablePact from '../../components/table_pact'

const EscolherUnidade = (props) => {
    const { userData } = useContext(userContext)
    const [cnes, setCnes] = useState('')
    const [ine, setIne] = useState('')
    const [nomeUnidade, setNomeUnidade] = useState('')
    const [ano, setAno] = useState('')
    const [mes, setMes] = useState('')
    //const [showDialog, setShowDialog] = useState(false)
    //const [dialogMsg, setDialogMsg] = useState('')
    
    const [listaInes, setListaInes] = useState(undefined)

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
                    if (resp.data.mes + 1 > 12) {
                        setMes(1)
                        setAno(resp.data.ano + 1)
                    }
                    else {
                        setMes(resp.data.mes)
                        setAno(resp.data.ano)
                    }
                })
            .catch(e => console.log(e))
            }            
        }

        const fetchCnes = async () => {
            if (props.location && props.location.state) {
                setCnes(props.location.state.cnes)
            }
            else {
                if (userData.user) {
                    setCnes(userData.user.cnes)
                }
            }
        }

        const fetchNomeUnidade = async () => {
            if (cnes) {
                await api.get(`/cnes/${cnes}`)
                .then(resposta => {
                    setNomeUnidade(resposta.data.NOME_UNIDADE)
                })
                .catch(e => console.log(e))
            }
        }

        const fetchListaInes = async () => {
            if (cnes && !listaInes) {
                await api.get(`/prof/ine/cnes/${cnes}`)
                .then(resposta => {
                    setListaInes(resposta.data)
                })
                .catch(e => console.log(e))
            }
        }

        fetchData()
        fetchCnes()
        fetchNomeUnidade()
        fetchListaInes()
        console.log('escolherUnidade', ano, mes)
    }, [userData, cnes, ine, listaInes])
        
    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 1?
                <>
                    {listaInes ? 
                    <>  
                        <h3>Escolha a Equipe:</h3>
                        <div className='escolher-unidade'>
                            <Form.Control as='select' onChange={e => setIne(e.target.value)}>
                                <option value=''>{nomeUnidade}</option>
                                {listaInes.map(unidade => <option value={unidade.INE}>{unidade.NOME_EQUIPE}</option>)}
                            </Form.Control>
                        </div>
                        <hr />
                        <TablePact key={ine} cnes={cnes} ine={ine} listaInes={listaInes} ano={ano} mes={mes} />
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