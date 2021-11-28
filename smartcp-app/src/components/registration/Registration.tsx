import React, { Component, } from 'react';
import { Button, Modal, Form,Row,Col, } from 'react-bootstrap';
import './Registration.css'
import PassElements from './PassElement'
import PhotoPage from './photomodule/PhotoPage';
import faceDef from "./photomodule/icons/face-scan.png"
 


class Registration extends Component<{}, { show: any,frontPhoto:any,photos:Array<{src: any,faceCoords:any}>, name:string,
                                           addedId:any, request:boolean,}> {

    constructor(props:any){
        super(props);

        this.state = {
            show: false,
            photos: [
                {
                    src:"",
                    faceCoords:""
                }
            ],
            frontPhoto:{
                src:"",
                faceCoords:""
            },
            name: "",
            request: false,
            addedId: undefined,
            
            


        }
    }



    



    submitPhotos(photos:Array<{src: any,faceCoords:any}>){
        this.setState({show: false});
        this.setState({frontPhoto: photos[0]});
        console.log(photos[0].src)
        photos = photos.map(photoObj => {
            return {
                src: photoObj.src.slice(photoObj.src.indexOf(',')),
                faceCoords: photoObj.faceCoords
            }
        });
        console.log(photos[0].src)
        this.setState({photos: photos})
        
        
    }


    submit(e:any){
        


        e.preventDefault();
        console.log(this.state.photos)

        if(this.state.photos !== undefined){

            this.setState({request:true});

           
            fetch('http://localhost:5000/add', {
              method: 'POST',
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: this.state.name,
                photos: this.state.photos,
              })
            })
              .then(response => response.json())
              .then(json => {

                const jsonObj = JSON.parse(json);
                
                this.setState({addedId:jsonObj._id["$oid"]});
                this.setState({request:false});


              })
              .catch(error => {
                console.log("Fuuuuking ERRRER")
                this.setState({request:false});
              });
            
            // fetch(`http://localhost:5000/`,{
            //     'method':'POST',
            //     headers : {
            //     'Content-Type':'application/json'
            //     },
            //     body:JSON.stringify({ 
            //         firstName: this.state.firstName,
            //         lastName: this.state.lastName,
            //         photos: this.state.photos
            //     })
            // })
            // .then(response => response.json())
            // .catch(error => console.log(error))

        }
    
    }


    render() {
        return(
            <>
            <div className="registrationForm">
                <Form className="regFormGroup">
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control placeholder="Name" onChange={(e:any) => this.setState({name:e.target.value})} />
                       
                    </Form.Group>
                    
                    <Button variant="primary" onClick={() => this.setState({show: true})}>
                        Add photos
                    </Button>
                
                    <Button onClick={(e)=>this.submit(e)} variant="primary" type="submit" >
                        Submit
                    </Button>
                </Form>
                { !this.state.show &&<PassElements 
                    frontPhoto = {this.state.frontPhoto}
                    name = {this.state.name}
                    addedId = {this.state.addedId}
                    request = {this.state.request}
                
                ></PassElements>}
            </div>
             <Modal
             fullscreen={true}
             show={this.state.show}
             onHide={() => this.setState({show: false})}
             dialogClassName="modal-90w"
             aria-labelledby="example-custom-modal-styling-title"
             >
             <Modal.Header closeButton>
                 <Modal.Title id="example-custom-modal-styling-title">
                    Add Photos
                 </Modal.Title>
             </Modal.Header>
             <Modal.Body>
                    {this.state.show &&<PhotoPage submitPhotos={this.submitPhotos.bind(this)}></PhotoPage>}
             </Modal.Body>
             </Modal>
            </>
        )
  }
}

export default Registration;


