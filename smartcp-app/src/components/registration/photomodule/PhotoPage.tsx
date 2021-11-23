import React, { Component,useRef } from 'react';
import Camera from './Camera';
import "./PhotoPage.css"
import CameraCommands from "./CameraCommands"
import PhotoCard from "./PhotoCard"
import {FacePosition} from './faceTool'
import { Button,} from 'react-bootstrap';




interface ParentProps  { // The common Part
    submitPhotos: (e:any) => void;
}

class PhotoPage extends Component<ParentProps,{photos:any,photoStep:number}>{


    constructor(props:any){
        super(props);

        this.state = {
            photos: [],
            photoStep: 0,
        }

    }
    photoSteps = [
        FacePosition.Center,
        FacePosition.Up,
        FacePosition.Center,
        FacePosition.Down,
        FacePosition.Center,
        FacePosition.Left,
        FacePosition.Center,
        FacePosition.Right,
        FacePosition.Center,
        FacePosition.Up,
        FacePosition.Center,
        FacePosition.Down,
        FacePosition.Center,
        FacePosition.Left,
        FacePosition.Center,
        FacePosition.Right,
        FacePosition.Center
    ]
    
    cropImage =  (image64:any,pixelCrop:any) => {
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


    async updatePhotos(photo:any, faceCoords:any ) {

        let photos = this.state.photos;


        //this.image64toCanvasRef(imageCanvasRef, photo,crop)
        const cropedPhoto = await this.cropImage(photo,faceCoords);
        let photoStep = this.state.photoStep + 1;
        this.setState({ photos: [...photos, cropedPhoto],photoStep:photoStep});






    }



    


    render() {
        var mojeJebaloHTML = [];
        let photos = this.state.photos;

        for (var i = 0; i < photos.length; i++) {
            mojeJebaloHTML.push(<PhotoCard number={i} photo={photos[i]} ></PhotoCard>);
        }

        return (
            <div className="photoPageBody">
            <div className="cameraBox">
                <Camera command = {this.photoSteps} updatePhotos={this.updatePhotos.bind(this)}></Camera>
                <div className="cameraInfoBox">
                    <CameraCommands command = {this.photoSteps[this.state.photoStep]} state = {1}></CameraCommands>
                </div>
            </div>

            <div className="galery">
                {mojeJebaloHTML}
            </div>
            <Button variant="primary" onClick={() => {this.props.submitPhotos(this.state.photos);}}>
                            Add photos
            </Button>
            
            
            </div>
        )
    }
}

export default PhotoPage;