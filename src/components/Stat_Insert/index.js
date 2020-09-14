import React, {useContext, useEffect, useState} from 'react'
import api from '../../services/api'
import {Table, Form, Button} from 'react-bootstrap'
import userContext from '../../context/userContext'
import StatLinha from './Stat_Insert_Linha'

import './styles.css'

const TableStat = props => {
    const { userData } = useContext(userContext)
    
    const mesesIdx = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    
    const [ano, setAno] = useState(undefined)
    const [mes, setMes] = useState(undefined)
    const [dia, setDia] = useState(undefined)

    const [listaAgravos, set_listaAgravos] = useState(undefined)
    const [listaProced, set_listaProced] = useState(undefined)
    const [formQtd, set_formQtd] = useState(undefined)

    const [listaStat, setListaStat] = useState(undefined)
    
    useEffect(() => {
        const fetchData = async () => {
            if (mes == '' || ano == '') {                
                await api.get('/pact/data')
                .then(resp => {
                    setAno(resp.data.ano)
                    setMes(resp.data.mes + 1)
                })
                .catch(e => console.log(e))
            }
        }
        
        const fetchAgravos = async () => {
            if (!listaAgravos) {

            }
        }
        fetchData()
    }, [])
    
    const montarLinha = props => {
        return (
            <StatLinha stat={props} />
        )
    }

    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 0 ?
                <>
                    <h4>Adicionar registro</h4>
                    <div className='cabeçalho-tabela-add'>
                        <Form.Control as='select' placeholder="Agravo">
                            <option>Agravo</option>
                        </Form.Control>
                        <Form.Control as='select' placeholder="Procedimento">
                            <option>Procedimento</option>
                        </Form.Control>                        
                        <Form.Control type='number' placeholder='Quant.' />
                        <Button variant='outline-success'>Adicionar</Button>
                    </div>
                    <h4>Histórico</h4>
                    <Table stripered bordered hover>
                        <thead>
                            <tr className='cabeçalho-tabela-registro'>
                                <th className='table-stat-id'>ID</th>
                                <th className='table-stat-agravo'>Agravo</th>
                                <th className='table-stat-proc'>Procedimento</th>
                                <th className='table-stat-data'>Data</th>
                                <th className='table-stat-mes'>Quantidade</th>
                                <th className='table-stat-mes'>Opções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaStat ? listaStat.map(montarLinha)
                            :
                            <h3>Não existem registros para serem exibidos.</h3>}
                        </tbody>
                    </Table>
                </>
            :
                null
            }
        </div>
    )
}

export default TableStat