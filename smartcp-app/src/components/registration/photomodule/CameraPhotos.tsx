
  
  
const CameraPhotos = () => {
  



  
  const blockStyle = {

    backgroundColor:'#008000',
    width: '100%',
    height: '5%',
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
    height: '120px',
 
  };
    
  
    return(
      <div style = {blockStyle}>
          <img  alt="icon" style = {imgStyle}/>
          <p></p>
      </div>
    );
}




  
  
  export default CameraPhotos;