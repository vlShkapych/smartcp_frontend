import { AnnotatedPrediction } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh";
import {
  Coord2D,
  Coords3D,
} from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh/util";

import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';



export enum FacePosition {
  Center = 0,
  Up,
  Down,
  Left,
  Right,
  UpLeft,
  UpRight,
  DownLeft,
  DownRight
}

export interface FaceMove {
  facePosition: FacePosition;
}

export const facePosition = (xCos:number, yCos:number):FaceMove => {  

  let result: FaceMove = {
    facePosition: FacePosition.Center,
  }

  if(Math.abs(xCos) <=0.05 && Math.abs(yCos) <= 0.05){
    result.facePosition = FacePosition.Center;
  }
  else if(Math.abs(xCos) <= 0.05 && yCos >= 0.35){
    result.facePosition = FacePosition.Up;
  }
  else if(Math.abs(xCos) <= 0.05 && yCos <= -0.35){
    result.facePosition = FacePosition.Down;
  }
  else if(xCos >= 0.35 && Math.abs(yCos) <= 0.05){
    result.facePosition = FacePosition.Right;
  }
  else if(xCos <= -0.35 && Math.abs(yCos) <= 0.05){
    result.facePosition = FacePosition.Left;
  }
  else{ 
    result.facePosition = FacePosition.UpRight;

  }
  
  return result;

}


export const getHeadAnglesCos = (keypoints: Coords3D) => {
  
  function normal(vec:any) {
    let norm = 0;
    for (const v of vec) {
      norm += v * v;
    }
    return Math.sqrt(norm);
  }
  
  // Vertical (Y-Axis) Rotation
  const faceVerticalCentralPoint = [
    0,
    (keypoints[10][1] + keypoints[152][1]) * 0.5,
    (keypoints[10][2] + keypoints[152][2]) * 0.5,
  ];
  const verticalAdjacent = keypoints[10][2] - faceVerticalCentralPoint[2];
  const verticalOpposite = keypoints[10][1] - faceVerticalCentralPoint[1];
  const verticalHypotenuse = normal([verticalAdjacent, verticalOpposite]);
  const verticalCos = (verticalAdjacent / verticalHypotenuse);

  // Horizontal (X-Axis) Rotation
  const faceHorizontalCentralPoint = [
    (keypoints[226][0] + keypoints[446][0]) * 0.5,
    0,
    (keypoints[226][2] + keypoints[446][2]) * 0.5,
  ];
  const horizontalAdjacent = keypoints[226][2] - faceHorizontalCentralPoint[2];
  const horizontalOpposite = keypoints[226][0] - faceHorizontalCentralPoint[0];
  const horizontalHypotenuse = normal([horizontalAdjacent, horizontalOpposite]);
  const horizontalCos = (horizontalAdjacent / horizontalHypotenuse);


  return [horizontalCos, verticalCos];
}

const drawLineWithArrowhead = (ctx: CanvasRenderingContext2D,p0:Array<number>, p1:Array<number>,headLength:number) =>{

  // constants (could be declared as globals outside this function)
  var PI=Math.PI;
  var degreesInRadians225=225*PI/180;
  var degreesInRadians135=135*PI/180;

  // calc the angle of the line
  var dx=p1[0]-p0[0];
  var dy=p1[1]-p0[1];
  var angle=Math.atan2(dy,dx);

  // calc arrowhead points
  var x225=p1[0]+headLength*Math.cos(angle+degreesInRadians225);
  var y225=p1[1]+headLength*Math.sin(angle+degreesInRadians225);
  var x135=p1[0]+headLength*Math.cos(angle+degreesInRadians135);
  var y135=p1[1]+headLength*Math.sin(angle+degreesInRadians135);

  // draw line plus arrowhead
  // draw the line from p0 to p1
  ctx.moveTo(p0[0],p0[1]);
  ctx.lineTo(p1[0],p1[1]);
  // draw partial arrowhead at 225 degrees
  ctx.moveTo(p1[0],p1[1]);
  ctx.lineTo(x225,y225);
  // draw partial arrowhead at 135 degrees
  ctx.moveTo(p1[0],p1[1]);
  ctx.lineTo(x135,y135);
  // stroke the line and arrowhead

}



const drawMask = (
  ctx: CanvasRenderingContext2D,
  keypoints: Coords3D,
  distance: number
) => {
    ctx.fillRect(keypoints[226][0],keypoints[226][1],5,5);
    ctx.fillRect(keypoints[446][0],keypoints[446][1],5,5);
    ctx.fillRect(keypoints[152][0],keypoints[152][1],5,5);
    ctx.fillRect(keypoints[10][0],keypoints[10][1],5,5);
    
    drawLineWithArrowhead(ctx,keypoints[226],keypoints[446],50);

    const [x,y] = getHeadAnglesCos(keypoints)



};

export const draw = (
  predictions: AnnotatedPrediction[],
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  if (predictions.length > 0) {
    predictions.forEach((prediction: AnnotatedPrediction) => {
      
      const keypoints = prediction.scaledMesh;
      const boundingBox = prediction.boundingBox;
      const bottomRight = boundingBox.bottomRight as Coord2D;
      const topLeft = boundingBox.topLeft as Coord2D;
      const distance =
        Math.sqrt(
          Math.pow(bottomRight[0] - topLeft[0], 2) +
            Math.pow(topLeft[1] - topLeft[1], 2)
        ) * 0.02;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "black";
      ctx.save();
      ctx.beginPath();
      drawMask(ctx, keypoints as Coords3D, distance);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
  }
};

export const extractFace = ( 
  predictions: AnnotatedPrediction[],
  ref:any,
  img:any,
  width: number,
  height: number
  ) => {

    htmlToImage.toPng(ref)
    .then(function (dataUrl) {
      var img = new Image();
      img.src = dataUrl;
      console.log(img)
    })
    .catch(function (error) {
      console.error('oops, something went wrong!', error);
    });

};


export const faceCoords = (prediction:AnnotatedPrediction) =>{

  const topLeft  = prediction.boundingBox.topLeft as Coord2D;
  const bottomRight  = prediction.boundingBox.bottomRight as Coord2D;

  const height =  bottomRight[0] -  topLeft[0]+70;
  const width =  bottomRight[1] -  topLeft[1] ;

  return {
    x: topLeft[0]+50, 
    y: topLeft[1]-30, 
    height: height,
    width: width
  }

}


export const cropImage =  (image64:any,pixelCrop:any) => {
  try {
      const image = new Image();
      image.src = image64;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext('2d')  
      
      console.log(image.width);
      console.log(image.naturalWidth);

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;


      return new Promise(resolve => {
          const scaleX = image.naturalWidth / image.width;
          const scaleY = image.naturalHeight / image.height;
          console.log(scaleX,scaleY)
          image.onload = () => { 
              if(ctx !== null){
                  ctx.drawImage(
                      image,
                      pixelCrop.x,
                      pixelCrop.y,
                      pixelCrop.width,
                      pixelCrop.height,
                      0,
                      0,
                      pixelCrop.width,
                      pixelCrop.height)
              }
              const cropedImg = canvas.toDataURL("image/jpeg",1);
              resolve(cropedImg);
          }
      });

  }


  catch (e) {
      console.log("crop the image");
  }
};


//   let _H = detection.box.height;
//   let _W = detection.box.width;
//   let _X = detection.box._x;
//   let _Y = detection.box._y;
