import React, { Component, } from 'react';
import { Button, Modal, Form,Row,Col, } from 'react-bootstrap';
import './Registration.css'

import PhotoPage from './photomodule/PhotoPage';





class Registration extends Component<{}, { show: any,photos:Array<string>| undefined }> {

    constructor(props:any){
        super(props);

        this.state = {
            show: false,
            photos: undefined,


        }
    }

    submitPhotos(photos:Array<string>){
        this.setState({show: false, photos: photos });
        console.log(photos);
        
    }
    submit(){
        
        if(this.state.photos !== undefined){
          
            
        }
    
    }


    render() {
        return(
            <>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                <Row>
                    <Col>
                    <Form.Control placeholder="First name" />
                    </Col>
                    <Col>
                    <Form.Control placeholder="Last name" />
                    </Col>
                </Row>
                </Form.Group>
                <Form.Group>
                    <Button variant="primary" onClick={() => this.setState({show: true})}>
                        Add photos
                    </Button>
                </Form.Group>
                
                <Button onClick={()=>this.submit()} variant="primary" type="submit" >
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


