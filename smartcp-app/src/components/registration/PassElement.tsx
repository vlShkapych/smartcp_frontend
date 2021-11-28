
import {useState,useEffect} from 'react'
import {cropImage} from './photomodule/faceTool'
import faceDef from "./photomodule/icons/face-detection.png"
import './PassElement.css'
import { useBarcode } from '@createnextapp/react-barcode';
import Spinner from 'react-bootstrap/Spinner'



type InputProps = { // The common Part
    frontPhoto: {
        src:string;
        faceCoords:string;
    };
    name: string;
    request:boolean;
    addedId:string;
    
}

function classList(classes:any) {
    return Object
      .entries(classes)
      .filter(entry => entry[1])
      .map(entry => entry[0])
      .join(' ');
}


export const PassElement = (props:InputProps) => { 


    const [photoCard, setPhotoCard] = useState('');
    useEffect(() => {
    
        cropPhotoCard();
      
    },[]);

    

    const cropPhotoCard = async () => {
        
        
        let photo:any = await cropImage(props.frontPhoto.src, props.frontPhoto.faceCoords); 
        
        setPhotoCard(photo)
    }


    const cardId = props.addedId===undefined? "0000000000000000": props.addedId;
   


      
    const { inputRef } = useBarcode({
        value: cardId,
        options: {
          background: 'green',
          displayValue: false,
          height:40,
          margin: 0,
          
        }
    });
    
 

    

    return(

        <div className="backgroundLayer">
            {props.request && <Spinner className="spiner" animation="border" role="status" variant = "primary"/>}
                <div className={classList({
                    'cardBlock': true,
                    'semilayer': props.request,
                })}>
                    <span className="visually-hidden">Loading...</span>

                    <div className = 'textBlock'>
                        <div className = 'nameBlock'>
                            <p className = 'nameHeader'>Meno|Name</p>
                            <p><b>{props.name}</b></p>
                        </div>
                    
                        <p className = "cardId">UID: {cardId}</p>
                    </div>
                    <div className = 'imgBlock'> 
                        <img src={ photoCard===''?faceDef:photoCard } alt="icon" className = "img"/>
                            <div className="barCode">
                                <svg className="barCode" ref={inputRef} />
                            </div>
                    </div>
                </div>
        </div>

    );


}
export default PassElement;