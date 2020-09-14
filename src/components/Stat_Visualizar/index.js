import React, {useContext, useEffect, useState} from 'react'
import api from '../../services/api'
import {Table, Form, Button} from 'react-bootstrap'
import userContext from '../../context/userContext'
import StatLinha from './Stat_Visualizar_Linha'


const TableStat = props => {
    const { userData } = useContext(userContext)
    
    const mesesIdx = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    
    const [ano, setAno] = useState(undefined)
    const [mes, setMes] = useState(undefined)
    const [dia, setDia] = useState(undefined)    
    
    const [listaStat, setListaStat] = useState(undefined)
    
    useEffect(() => {
        const fetchData = async () => {
            if (!mes || !ano) {                
                await api.get('/pact/data')
                .then(resp => {
                    setAno(resp.data.ano)
                    setMes(resp.data.mes + 1)
                    setDia(resp.data.dia)
                })
                .catch(e => console.log(e))
            }
        }

        const fetchStats = async () => {
           await api.get(`/stat/list/all`)
                .then(resp => setListaStat(resp.data))
                .catch(e => console.log(e))
        }
        fetchData()        
        fetchStats()
    }, [userData, ano, mes, dia, listaStat])
    
    const montarLinha = props => {
        return (
            <StatLinha stat={props} />
        )
    }

    return (
        <div className='total-area'>
            {userData.user && userData.user.nivel >= 3 ?
                <>
                    <Table stripered bordered hover>
                        <thead>
                            <tr className='cabeçalho-tabela-registro'>
                                <th className='table-stat-agravo'>Agravo</th>
                                <th className='table-stat-proc'>Procedimento</th>
                                <th className='table-stat-mes'>Mês</th>
                                <th className='table-stat-ano'>Ano</th>
                                <th className='table-stat-qt'>Quantidade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaStat && listaStat.length > 0 ? listaStat.map(montarLinha)
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