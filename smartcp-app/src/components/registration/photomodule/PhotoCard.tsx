interface PhotoCardProps {
    number: number;
    photo: string;
  }
   
  
  
  const PhotoCard = ({number, photo}:PhotoCardProps) => {
  
    
    
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
  
  
    return(
        <div key={number} style = {blockStyle}>
            <img src={photo} alt="photo" style = {imgStyle}/>
            <p>{number}</p>
        </div>
    );
  }
  
  export default PhotoCard;