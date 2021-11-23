import React, { Component, } from 'react';
import { Button, Modal, Form,Row,Col, } from 'react-bootstrap';
import './Registration.css'

import PhotoPage from './photomodule/PhotoPage';


 


class Registration extends Component<{}, { show: any,photos:Array<string>| undefined, firstName:string|undefined,lastName:string|undefined }> {

    constructor(props:any){
        super(props);

        this.state = {
            show: false,
            photos: undefined,
            firstName: undefined,
            lastName: undefined,
            


        }
    }

    submitPhotos(photos:Array<string>){
        this.setState({show: false, photos: photos });
        console.log(photos);
        
    }
    submit(e:any){
        
        if(this.state.photos !== undefined){
          
            e.preventDefault();
            fetch('http://localhost:5000/add', {
              method: 'POST',
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                photos: this.state.photos.map(photo => photo.slice(photo.indexOf(','))),
              })
            })
              .then(response => response.json())
              .then(json => {
                console.log(json);
              })
              .catch(error => {
                console.log("FuuuuCking ERRRER")
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
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                <Row>
                    <Col>
                    <Form.Control placeholder="First name" onChange={(e:any) => this.setState({firstName:e.target.value})} />
                    </Col>
                    <Col>
                    <Form.Control placeholder="Last name" onChange={(e:any) => this.setState({lastName:e.target.value})} />
                    </Col>
                </Row>
                </Form.Group>
                <Form.Group>
                    <Button variant="primary" onClick={() => this.setState({show: true})}>
                        Add photos
                    </Button>
                </Form.Group>
                
                <Button onClick={(e)=>this.submit(e)} variant="primary" type="submit" >
                    Submit
                </Button>
                </Form>
               

                <Modal
                fullscreen={true}
                show={this.state.show}
                onHide={() => this.setState({show: false})}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
                >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                    Custom Modal Styling
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <PhotoPage submitPhotos={this.submitPhotos.bind(this)}></PhotoPage>
                </Modal.Body>
                </Modal>
            </>
        )
  }
}

export default Registration;


