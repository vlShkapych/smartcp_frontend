

import {ToastContainer,Modal,Tab,Row,Col,Offcanvas,Button,Form,Popover,Toast} from 'react-bootstrap';
import {useState,useEffect,} from 'react'
import logPng from '../../components/registration/photomodule/icons/logs.png';
 

interface InputProps {
  modelIsUpdating: boolean;

  logText: string;
  
 
}

const MessagesBlock =  (props:InputProps) =>{
    const [modelIsUpdating, setModelIsUpdating] = useState(props.modelIsUpdating);
    const [logText, setlogText] = useState(props.logText);
    const [lgShow, setLgShow] = useState(false);
    


    useEffect(()=>{
      setModelIsUpdating(props.modelIsUpdating)
      setlogText(props.logText)
      


    },[props.modelIsUpdating,props.logText])
  

    if(modelIsUpdating){
      return (
        <>
            <ToastContainer className="p-3" position={"bottom-end"}>
            <Toast>
              <Toast.Header closeButton={false}>
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto">Bootstrap</strong>
                <small>11 mins ago</small>
              </Toast.Header>
              <div className="messageBoxBody">
              <Toast.Body>Training...</Toast.Body>
              <button onClick={() => setLgShow(true)}>
                <img src={logPng} className="messageBoxLogsBtn"></img>
              </button>
              
              </div>
            
            </Toast>
          </ToastContainer>
          <Modal
            size="lg"
            show={lgShow}
            onHide={() => setLgShow(false)}
            aria-labelledby="example-modal-sizes-title-lg"
          >
          <Modal.Header closeButton>
              <Modal.Title id="example-modal-sizes-title-lg">
                AI Training Logs
              </Modal.Title>
            </Modal.Header>
            <Modal.Body><span className='logMessage'>{logText}</span></Modal.Body>
          </Modal>
       </>
      );
    }
    else{
      return(
        <div></div>
      )
    }
   
}

export default MessagesBlock;