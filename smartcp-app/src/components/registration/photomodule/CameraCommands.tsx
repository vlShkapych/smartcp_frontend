import faceScan from './icons/face-scan.png';
//import faceDetection from 'icon/faceDetection';


interface CameraCommandsProps {
  command: number;
  state: number;
}
 


const CameraCommands = ({command, state}:CameraCommandsProps) => {

  const messages:Array<string> = [
                                  'Look ahead',
                                  'Turn your face to the top',
                                  'Turn your face to the bottom',
                                  'Turn your face to the left',
                                  'Turn your face to the right'];
  
  const backgrounColors:Array<string> = ['#008000'];
  
  const blockStyle = {
    backgroundColor:backgrounColors[0],
    width: '100%',
    height: '100%',
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
          <img src={faceScan} alt="icon" style = {imgStyle}/>
          <p>{messages[command]}</p>
      </div>
  );
}

export default CameraCommands;