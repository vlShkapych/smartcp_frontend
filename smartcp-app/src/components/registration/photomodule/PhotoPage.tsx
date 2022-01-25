import React, { Component,useRef } from 'react';
import Camera from './Camera';
import "./PhotoPage.css"
import CameraCommands from "./CameraCommands"
import PhotoCard from "./PhotoCard"
import {FacePosition} from './faceTool'
import { Button,} from 'react-bootstrap';

import {useState,useEffect} from 'react'





interface ParentProps  { // The common Part
    submitPhotos: (e:any) => void;
}

class PhotoPage extends Component<ParentProps,{photos:Array<{src: any,faceCoords:any}>,photoStep:number}>{


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
    



    updatePhotos(src:any, faceCoords:any ) {

        let photos = this.state.photos;
        //this.image64toCanvasRef(imageCanvasRef, photo,crop)
        let photoStep = this.state.photoStep + 1;
        this.setState({photos:[...photos, { src,faceCoords}]});
        this.setState({photoStep:photoStep});

        
    }



    


    render() {
        var mojeJebaloHTML = [];
        let photos = this.state.photos;

        for (var i = 0; i < photos.length; i++) {
            mojeJebaloHTML.push(<PhotoCard number={i} photo={photos[i]} ></PhotoCard>);
        }

        return (
            <>
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
                    <Button className="addBtn" variant="primary"  onClick={() => {this.props.submitPhotos(this.state.photos);}}>
                            Add photos
                    </Button>
                </div>
                
            </>
        )
    }
}

export default PhotoPage;