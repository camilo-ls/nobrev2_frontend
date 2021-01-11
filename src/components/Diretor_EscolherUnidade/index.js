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
    
    const [listaUnidades, setListaUnidades] = useState(undefined)
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
                if (userData.user && cnes == '') {
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

        const fetchListaCnes = async() => {
            if (userData.user && !listaUnidades) {
                await api.get(`/pact/resp/${userData.user.id}`)
                .then(resposta => {
                    console.log('front', resposta)
                    setListaUnidades(resposta.data)
                    setCnes(resposta.data[0].CNES)
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
        fetchListaCnes()
        fetchListaInes()
    }, [userData, cnes, ine, listaUnidades, listaInes])
        
    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 1?
                <>                    
                    {listaUnidades && listaUnidades.length > 1 ? 
                    <>
                        <h3>Escolha a Unidade:</h3>
                        <div className='escolher-unidade'>
                            <Form.Control as='select' onChange={e => {
                                setListaInes(undefined)
                                setCnes(e.target.value)
                            }}>
                                
                                {listaUnidades.map(unidade => <option value={unidade.CNES}>{unidade.NOME_UNIDADE}</option>)}
                            </Form.Control>
                        </div>
                    </>               
                    : null}
                    

                    {listaInes ? 
                    <>  
                        <h3>Escolha a Equipe:</h3>
                        <div className='escolher-equipe'>
                            <Form.Control as='select' onChange={e => setIne(e.target.value)}>
                                <option value=''>{nomeUnidade}</option>
                                {listaInes.map(equipe => <option value={equipe.INE}>{equipe.NOME_EQUIPE}</option>)}
                            </Form.Control>
                        </div>
                        <hr />
                        <TablePact key={[ine, cnes]} cnes={cnes} ine={ine} listaInes={listaInes} ano={ano} mes={mes} />
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