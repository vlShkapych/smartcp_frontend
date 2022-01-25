import {useState,useEffect,} from 'react'
import {Card,ListGroup,Tab,Row,Col,Offcanvas,Button,Form,Popover,OverlayTrigger} from 'react-bootstrap';
import "./TurnstileList.css"
import MessagesBlock from './MessagesBlock'

import { useInterval } from 'usehooks-ts'
import { render } from '@testing-library/react';

interface InputProps {
    ipAddress: string
    
   
}
   
  
  
const TurnstilePanel =  (props:InputProps) => {




    const [modelIsUpdating, setModelIsUpdating] = useState(false);    
    const [logText, setlogText] = useState("");    


    useInterval(() => {
        if(modelIsUpdating){
            fetch('http://localhost:5000/getTrainLogFile',{
                method: 'GET',
                mode: 'cors',
    
                })
                .then(response => response.json())
                .then((logs) => {
                    console.log(logs)
                    setlogText(logs)
                    logs.indexOf('AI model was updated')
                    if(logs.indexOf('AI model was updated') != -1){
                        setModelIsUpdating(false)
                        
                    }
                })
        }
        
            
          
    },1000);

    useEffect(() => {
      
    }, [modelIsUpdating]);

    
    
    const updateAiModel = () => {
        setModelIsUpdating(true)
        if (modelIsUpdating){
            return;
        }
        fetch('http://localhost:5000/updateAiModel',{
            method: 'GET',
            mode: 'cors',

            })
            .then(response => response.json())
            .then((logs) => {
                console.log(logs)
            })

    }




    if(props.ipAddress !== ""){
        return(
        
            <>
                    <iframe
                        src={`http://${props.ipAddress}:5000/video_feed`}
                        className="turnstileCameraBox"
                        width="640"
                        height="480"       
                        allowFullScreen>
                    </iframe>   
                    <Button
                        className = "updateAiBtn"
                        variant="primary"
                        disabled={modelIsUpdating}
                        onClick={updateAiModel}>
                        {modelIsUpdating ? 'Updating...' : 'Update Face Recognition System'}
                    </Button>
                    <MessagesBlock modelIsUpdating={modelIsUpdating} 
                                   logText={logText}></MessagesBlock>
            </>
        )
    }
    else{
         return(
             <div></div>
         )
    }
   
    


}
  
export default TurnstilePanel;



{/* <iframe
                                    src={'http://10.42.0.199:5000/video_feed'}
                                    style={{width: '60%', height: '60%'}}
                                    width="920"
                                    height="800"    
                                    allowFullScreen>
                                </iframe> */}