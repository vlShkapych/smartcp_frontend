import {useState,useEffect,} from 'react'
import {Card,ListGroup,Tab,Row,Col,Offcanvas,Button,Form,Popover,OverlayTrigger} from 'react-bootstrap';
import "./TurnstileList.css"

import { useInterval } from 'usehooks-ts'

interface InputProps {
    turnstile: {name:string,ipAddress:string};
    index:number;
    onClick:(index:number) => void;

}
   
  
  
const Turnstile =  (props:InputProps) => {


  const [state,setState] = useState("Connecting...")

  const colorsDict:any  = {
    "Working":"green",
    "Connecting...":"yellow",
    "Failed to Connect":"red"
  }

  let interval = 1000;

  useInterval(() => {

    const fetchTurnstileState = (ip: string) =>  {

        
        
        fetch(`http://${ip}:5000/getStatus`,{
            method: 'GET',
            // mode: 'cors',

            })
            .then(response => response.json())
            .then(json => {
                console.log(json);
                
                setState(json.status);
                
                
                interval = 3000;

            })
            .catch(e => {setState("Failed to Connect")});
        
        
        
        }
        fetchTurnstileState(props.turnstile.ipAddress);
        if(state != "Working"){
            setState("Failed to Connect")
        }
        

    }, 3000)
    
    
    
    const popover = (
        <Popover id="popover-basic">
          <Popover.Header as="h3">Status</Popover.Header>
          <Popover.Body>
            {state}
          </Popover.Body>
        </Popover>
    );
    
    const color = {
        backgroundColor:colorsDict[state]
    }


    return(
        <ListGroup.Item action href={`#link${props.index+1}`} onClick={()=>{props.onClick(state === "Working"?props.index:-1)}}>
            <Row>
                <Col md={5}>
                    {props.turnstile.name}
                </Col>
                <Col md={{ span: 2, offset: 5 }}>
                    <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                        <button className="status" style={color}></button>
                    </OverlayTrigger>
                </Col>
            </Row>
            
        </ListGroup.Item>
    )
}
  
export default Turnstile;