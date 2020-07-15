import React from 'react'
import {Button, Table, Tabs, Tab, ProgressBar} from 'react-bootstrap'

function generateProd(max) {
    return Math.floor(Math.random() * max) + 1
}

const jan = generateProd(100)
const fev = generateProd(100)

export default props => {
    return (
        <React.Fragment>
            <div className='monitor-pact'>
                <div className='pact'>
                    <h5>Unidades que já pactuaram</h5>
                    <Table>
                        <tbody>
                            <tr>
                                <td className='td-prof'>Unidade de Saúde 1</td>
                               
                            </tr>
                            <tr>
                                <td className='td-prof'>Unidade de Saúde 2</td>
                                
                            </tr>
                            <tr>
                                <td className='td-prof'>Unidade de Saúde 3</td>
                                
                            </tr>
                            <tr>
                                <td className='td-prof'>Unidade de Saúde 4</td>
                                
                            </tr>
                            <tr>
                                <td className='td-prof'>Unidade de Saúde 5</td>
                                
                            </tr>
                        </tbody>
                    </Table>
                </div>
                <div className='npact'>
                    <h5>Unidades que ainda não pactuaram</h5>
                    <Table>
                        <tbody>
                            <tr>
                                <td className='td-prof'>Unidade de Saúde 1</td>
                                <td>
                                    <Button className='pactuar' href='/diretor/#/diretor/pact'>Pactuar</Button>
                                </td>
                            </tr>
                            <tr>
                                <td className='td-prof'>Unidade de Saúde 2</td>
                                <td>
                                <Button className='pactuar' href='/diretor/#/diretor/pact'>Pactuar</Button>
                                </td>
                            </tr>
                            <tr>
                                <td className='td-prof'>Unidade de Saúde 3</td>
                                <td>
                                <Button className='pactuar' href='/diretor/#/diretor/pact'>Pactuar</Button>
                                </td>
                            </tr>
                            <tr>
                                <td className='td-prof'>Unidade de Saúde 4</td>
                                <td>
                                <Button className='pactuar' href='/diretor/#/diretor/pact'>Pactuar</Button>
                                </td>
                            </tr>
                            <tr>
                                <td className='td-prof'>Unidade de Saúde 5</td>
                                <td>
                                <Button className='pactuar' href='/diretor/#/diretor/pact'>Pactuar</Button>
                                </td>
                            </tr>
                            <tr>
                                <td className='td-prof'>Unidade de Saúde 5</td>
                                <td>
                                <Button className='pactuar' href='/diretor/#/diretor/pact'>Pactuar</Button>
                                </td>
                            </tr>
                            <tr>
                                <td className='td-prof'>Unidade de Saúde 5</td>
                                <td>
                                <Button className='pactuar' href='/diretor/#/diretor/pact'>Pactuar</Button>
                                </td>
                            </tr>
                            <tr>
                                <td className='td-prof'>Unidade de Saúde 5</td>
                                <td>
                                <Button className='pactuar' href='/diretor/#/diretor/pact'>Pactuar</Button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>

                </div>                
            </div>
            <div className='monitor-top'>
                <div className='monitor-ano'>
                    <h2>Monitoramento Anual</h2>
                        <h5>Consultas Médicas</h5>
                        <ProgressBar name='teste' now={generateProd(100)} />
                        <br />
                        <h5>Consultas de Enfermeiro</h5>
                        <ProgressBar name='teste' now={generateProd(100)} />
                        <br />
                        <h5>Visitas de ACS</h5>
                        <ProgressBar name='teste' now={generateProd(100)} />
                </div>

                <div className='monitor-mes'>
                    <h2>Monitoramento Mensal</h2>
                    <Tabs>
                        <Tab eventKey="jan" title="JAN">
                            <h5>Consultas Médicas</h5>
                            <ProgressBar name='teste' now={generateProd(100)} />
                            <br />
                            <h5>Consultas de Enfermeiro</h5>
                            <ProgressBar name='teste' now={generateProd(100)} />
                            <br />
                            <h5>Visitas de ACS</h5>
                            <ProgressBar name='teste' now={generateProd(100)} />
                        </Tab>
                        <Tab eventKey="fev" title="FEV">
                        <h5>Consultas Médicas</h5>
                            <ProgressBar name='teste' now={generateProd(100)} />
                            <br />
                            <h5>Consultas de Enfermeiro</h5>
                            <ProgressBar name='teste' now={generateProd(100)} />
                            <br />
                            <h5>Visitas de ACS</h5>
                            <ProgressBar name='teste' now={generateProd(100)} />
                        </Tab>
                        <Tab eventKey="mar" title="MAR">
                            <h5>Consultas Médicas</h5>
                            <ProgressBar name='teste' now={generateProd(100)} />
                            <br />
                            <h5>Consultas de Enfermeiro</h5>
                            <ProgressBar name='teste' now={generateProd(100)} />
                            <br />
                            <h5>Visitas de ACS</h5>
                            <ProgressBar name='teste' now={generateProd(100)} />                        
                        </Tab>
                        <Tab eventKey="abr" title="ABR">
                            <h5>Consultas Médicas</h5>
                            <ProgressBar name='teste' now={generateProd(100)} />
                            <br />
                            <h5>Consultas de Enfermeiro</h5>
                            <ProgressBar name='teste' now={generateProd(100)} />
                            <br />
                            <h5>Visitas de ACS</h5>
                            <ProgressBar name='teste' now={generateProd(100)} />                        
                        </Tab>
                        <Tab eventKey="mai" title="MAI">
                            <h5>Consultas Médicas</h5>
                            <ProgressBar name='teste' now={generateProd(100)} />
                            <br />
                            <h5>Consultas de Enfermeiro</h5>
                            <ProgressBar name='teste' now={generateProd(100)} />
                            <br />
                            <h5>Visitas de ACS</h5>
                            <ProgressBar name='teste' now={generateProd(100)} />                        
                        </Tab>
                        <Tab eventKey="jun" title="JUN">
                            <h5>Consultas Médicas</h5>
                            <ProgressBar name='teste' now={generateProd(100)} />
                            <br />
                            <h5>Consultas de Enfermeiro</h5>
                            <ProgressBar name='teste' now={generateProd(100)} />
                            <br />
                            <h5>Visitas de ACS</h5>
                            <ProgressBar name='teste' now={generateProd(100)} />                        
                        </Tab>
                        <Tab eventKey="jul" title="JUL" disabled />
                        <Tab eventKey="ago" title="AGO" disabled /> 
                        <Tab eventKey="set" title="SET" disabled />
                        <Tab eventKey="out" title="OUT" disabled />
                        <Tab eventKey="nov" title="NOV" disabled />
                        <Tab eventKey="dez" title="DEZ" disabled /> 
                    </Tabs>
                </div>
                <div className='monitor-prof'>
                    <div className='top5'>
                        <h5>Unidades com maior alcance</h5>
                        <Table>
                            <tbody>
                                <tr>
                                    <td className='td-prof'>Unidade de Saúde 1</td>
                                    <td>
                                        <ProgressBar now={95} label='95%'/>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='td-prof'>Unidade de Saúde 2</td>
                                    <td>
                                        <ProgressBar now={93} label='93%'/>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='td-prof'>Unidade de Saúde 3</td>
                                    <td>
                                        <ProgressBar now={92} label='92%'/>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='td-prof'>Unidade de Saúde 4</td>
                                    <td>
                                        <ProgressBar now={85} label='85%'/>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='td-prof'>Unidade de Saúde 5</td>
                                    <td>
                                        <ProgressBar now={70} label='70%'/>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    <div className='bottom5'>
                        <h5>Unidades com menor alcance</h5>
                        <Table>
                            <tbody>
                                <tr>
                                    <td className='td-prof'>Unidade de Saúde 1</td>
                                    <td>
                                        <ProgressBar variant='danger' now={45} label='45%'/>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='td-prof'>Unidade de Saúde 2</td>
                                    <td>
                                        <ProgressBar variant='danger' now={40} label='40%'/>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='td-prof'>Unidade de Saúde 3</td>
                                    <td>
                                        <ProgressBar variant='danger' now={33} label='33%'/>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='td-prof'>Unidade de Saúde 4</td>
                                    <td>
                                        <ProgressBar variant='danger' now={30} label='30%'/>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='td-prof'>Unidade de Saúde 5</td>
                                    <td>
                                        <ProgressBar variant='danger' now={15} label='15%'/>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>

                    </div>                
                </div>
            </div>
        </React.Fragment>
        
    )
}