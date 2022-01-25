

import React, { Component, } from 'react';
import './TurnstileList.css'
import {Card,ListGroup,Tab,Row,Col,Offcanvas,Button,Form,Modal} from 'react-bootstrap';
import Turnstile from './Turnstile'
import TurnstilePanel from './TurnstilePanel';
import MessagesBlock from './MessagesBlock'

class TurnstileList extends Component<{},{turnstileList: Array<{name:string,ipAddress:string}>,
    addTurnstile:boolean,turnstileToAddName:string|undefined,turnstileToAddIp:string|undefined
    selectedTurnstile:string}> {

    constructor(props:any){
        super(props);
        this.state = {
            turnstileList:[],
            addTurnstile:false,
            turnstileToAddName: undefined,
            turnstileToAddIp: undefined,

            selectedTurnstile:""
        }
    }


   

    

    componentWillMount(){


        fetch('http://localhost:5000/turnstileList', {
          method: 'GET',
          mode: 'cors',
          })
          .then(response => response.json())
          .then(json => {

            
            const jsonObj = JSON.parse(json);
            this.setState({turnstileList: jsonObj})
            console.log(json);
                        
          })
    }

    addTurnstile(e:any){

        e.preventDefault();
        console.log("suka")
        if(this.state.turnstileToAddName !== undefined && this.state.turnstileToAddIp !== undefined){
            console.log("bleat")
            fetch('http://localhost:5000/addTurnstile', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.state.turnstileToAddName,
                ipAddress: this.state.turnstileToAddIp,
            })
            }) 
            .then(response => response.json())
            .then(json => {

                console.log(json);
                const jsonObj = JSON.parse(json);
                this.setState({turnstileToAddName: undefined,turnstileToAddIp:undefined,addTurnstile:false})
                      
            })
            
        }
    }
    
    

    
    // <ListGroup.Item action href={"#link"+i.toString()}>{turnstiles[i].name}</ListGroup.Item>
    


    render() {

        var turnstilesHTML = [];
        let turnstiles = this.state.turnstileList;
        for (var i = 0; i < turnstiles.length; i++) {
            turnstilesHTML.push(<Turnstile onClick={(index)=>{
                                            index !== -1?
                                            this.setState({selectedTurnstile:this.state.turnstileList[index].ipAddress}):
                                            this.setState({selectedTurnstile:""})}
                                            
                                            } index = {i} turnstile = {turnstiles[i]}/>);
        }

        return(
            <> 
                <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1" >
                    <div className="turnstilesPage">

                            <Card className = "turnstiles">
                                <Card.Header>
                                    <Row>
                                        <Col md={5}>
                                            <span style = {{fontSize:18}}>
                                                    Turnstiles List
                                            </span>
                                        </Col>
                                        <Col md={{ span: 2, offset: 5 }}>
                                            <Button variant="outline-secondary" 
                                                    onClick={() =>{this.setState({addTurnstile:true})}}>
                                                <span style = {{fontSize:16}}>
                                                    <b>+</b>
                                                </span>
                                            </Button>
                                        </Col>
                                    </Row>
                                            
                                </Card.Header>
                                <ListGroup>
                                    {turnstilesHTML}
                                </ListGroup>
                            </Card>
 
                            <Tab.Pane eventKey="#link1" className="tunstilePanel">
                                <TurnstilePanel ipAddress = {this.state.selectedTurnstile}></TurnstilePanel>
                            </Tab.Pane>
                            

                    </div>
                </Tab.Container>
               

                <Offcanvas show={this.state.addTurnstile} onHide={()=>{this.setState({addTurnstile:false})}}>
                    <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Add Turnstile</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Turnstile Name</Form.Label>
                            <Form.Control placeholder="Name of Turnstile"
                                          onChange={(e:any) => this.setState({turnstileToAddName:e.target.value})} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>IP Address</Form.Label>
                            <Form.Control  placeholder="IP Address" 
                                           onChange={(e:any) => this.setState({turnstileToAddIp:e.target.value})}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Upload instantly face recognition AI model" />
                        </Form.Group>
                        <Button variant="primary" type="submit" onClick={(e)=>this.addTurnstile(e)}>
                            Add
                        </Button>
                    </Form>
                    </Offcanvas.Body>
                </Offcanvas>





            </>
        )
  }
}

export default TurnstileList;










