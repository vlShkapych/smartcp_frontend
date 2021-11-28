

import {useState,useEffect} from 'react'
import {cropImage} from './faceTool'

interface PhotoCardProps {
    number: number;
    photo: any;
}
   
  
  
const PhotoCard =  (proto:PhotoCardProps) => {


  const [photoCard, setPhotoCard] = useState('');



  useEffect(() => {
    
      cropPhotoCard();
    
  }, []);

    
  const blockStyle = {
      backgroundColor:'#008000',
      width: '100%',
      height: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      fontSize: '45px',
      color: 'black',
      borderRadius: '25px',
      margin: '10px 0',
  
  };
  
    const imgStyle = {
      width: '120px',
      height: '80px',
  
    };
  
    

    const cropPhotoCard = async() => {    
      let cropedPhoto = proto.photo.src;
      setPhotoCard(proto.photo.src)
      cropedPhoto = await cropImage(proto.photo.src, proto.photo.faceCoords); 
      setPhotoCard(cropedPhoto)

    }
    

    
    return(
        <div key={proto.number} style = {blockStyle}>
            <img src={ photoCard } style = {imgStyle}></img>
            <p>{proto.number}</p>
        </div>
    );
}
  
export default PhotoCard;