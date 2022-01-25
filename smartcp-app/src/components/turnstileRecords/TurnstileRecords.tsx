import React, { Component, } from 'react';
import { Button, Modal, Form,Row,Col,Card,ListGroup } from 'react-bootstrap';
import {Navbar,Container, Nav,FormControl,Table} from 'react-bootstrap';
import './TurnstileRecords.css';



class TurnstileRecords extends Component<{}, {}> {

    constructor(props:any){
        super(props);

        this.state = {
            
        }
    }



    render() {
        return(
            <>
                <Card className = "turnstilesRecords">
                    <Card.Header>
                        <Row>
                            <Col md={5}>
                                <span style = {{fontSize:18}}>
                                    Turnstiles Records
                                </span>
                                
                            </Col>
                            

                            
                            <Col md={{ span: 2, offset: 5 }}>
                                <Form className="d-flex">
                                    <FormControl
                                        type="search"
                                        placeholder="Search"
                                        className="me-3"
                                        aria-label="Search"
                                    />
                                    
                                </Form>
                            </Col>
                        </Row>
                                            
                    </Card.Header>

                    <Table className='turnstRecTable' striped bordered hover>
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>IP Address</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Direction</th>
                            <th>Worker</th>
                         
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>1</td>
                            <td>192.168.10.1</td>
                            <td>09.02.2022</td>
                            <td>19:20</td>
                            <td>In</td>
                            <td>Test Tester</td>
                            </tr>
                            <tr>
                            <td>2</td>
                            <td>192.168.10.2</td>
                            <td>09.02.2022</td>
                            <td>19:21</td>
                            <td>Out</td>
                            <td>Tito To</td>
                            </tr>
                            <tr>
                            <td>3</td>
                            <td>192.168.10.1</td>
                            <td>09.02.2022</td>
                            <td>19:40</td>
                            <td>In</td>
                            <td>Akuma Sempai</td>
                            </tr>
                        </tbody>
                    </Table>
                    {/* <div className="turnstRecFooter">
                        
                    </div> */}
                                
                </Card>
            </> 
        )
  }
}

export default TurnstileRecords;