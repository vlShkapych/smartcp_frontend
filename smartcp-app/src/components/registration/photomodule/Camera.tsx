import { useRef, useEffect, useCallback, Component,useState } from "react";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-converter";
import "@tensorflow/tfjs-backend-webgl";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { MediaPipeFaceMesh } from "@tensorflow-models/face-landmarks-detection/dist/types";
import { draw, getHeadAnglesCos,facePosition, FaceMove, FacePosition,dataType64toFile} from "./faceTool";
import "./Camera.css";
import { Dropdown} from 'react-bootstrap';
import fs from 'fs'





import {
  Coords3D,
} from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh/util";
import { string } from "@tensorflow/tfjs-core";
import { isString } from "@tensorflow/tfjs-core/dist/util_base";

type InputProps = { // The common Part
  updatePhotos: (e:any) => void;
  command: Array<FacePosition>;
}

export const Camera = (props:InputProps) => {

  const webcam = useRef<Webcam>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const commandIndex  = useRef<number>(0);

  

  const runFaceDetect = async () => {
    const model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
    );
    detect(model);
  };

  const detect = async (model: MediaPipeFaceMesh)=>{

    

    if (webcam.current && canvas.current) {
      const webcamCurrent = webcam.current as any;
      if (webcamCurrent.video.readyState === 4) {
        const video = webcamCurrent.video;
        const videoWidth = webcamCurrent.video.videoWidth;
        const videoHeight = webcamCurrent.video.videoHeight;
        canvas.current.width = videoWidth;
        canvas.current.height = videoHeight;
        const predictions = await model.estimateFaces({
          input: video,
        });

        if(predictions.length >0){
          const keypoints = predictions[0].scaledMesh;
          const [x,y] = getHeadAnglesCos(keypoints as Coords3D);

          const fPosition = facePosition(x,y);


          //console.log(`Command:${props.command[commandIndex.current]} Position:${fPosition.facePosition}`)
          //console.log(props.command[commandIndex.current] === fPosition.facePosition)


          if(fPosition.facePosition === props.command[commandIndex.current]){
            
          
            
           //extractFace(predictions,webcam.current,captureImage(),videoWidth, videoHeight)
            

            props.updatePhotos(captureImage());

            commandIndex.current++;
            

          }

        }
        if(canvas.current !== null){
          const ctx = canvas.current.getContext("2d") as CanvasRenderingContext2D;
          requestAnimationFrame(() => {
            draw(predictions, ctx, videoWidth, videoHeight);
          });
        }
        
        detect(model);
      }
      else{
        console.log("Video is not ready")
      }
    }else{
      console.log('Problem with a camera');
    }
  };


  useEffect(() => {
    setTimeout(() => {runFaceDetect();    }, 3000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webcam.current?.video?.readyState])

  const captureImage = useCallback(
    () => {
      if(webcam.current !== null){
        const imageSrc = webcam.current.getScreenshot();

        if (imageSrc !== null){
          //const image = fs.readFileAsync(imageSrc);
          //const b64Image = Buffer.from(image).toString('base64');
          console.log(imageSrc)
          dataType64toFile(imageSrc)
        }



          return imageSrc;
        
      }
      else{
        console.log("Webcam is null, cannot do shoot!")
        return '';
      }

    },
    [webcam]
  );

  return (
    <div className="camera" >
      <div className="header">
        <div className="title">Camera</div>
        <div className="dropdown">
          <Dropdown>
            <Dropdown.Toggle variant="secondary" size="sm">
              Camera #1
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#">
              Camera #2
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className = "video">
        <Webcam className="videoFrame"
          audio={false}
          screenshotFormat="image/jpeg"
          ref={webcam}
        />
        <canvas className="canvasFrame"
          ref={canvas}
        />
      </div>
      
    </div>
  );
}

export default Camera;

