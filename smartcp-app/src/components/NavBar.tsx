import React from 'react';
import {Navbar,Container, Nav} from 'react-bootstrap';
import {NavDropdown} from 'react-bootstrap';
import { NavLink } from 'react-router-dom'


export const Navigation = (props:{isAuthed:boolean,onSignOut:()=>void}) => {
    
    return(
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">SmartCP</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    {props.isAuthed?

                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link  href="/">Home</Nav.Link>
                                <Nav.Link  href="/addCard">Add Card</Nav.Link>
                                <Nav.Link  href="/cardsList">Cards List</Nav.Link>
                                <Nav.Link  href="/turnstileList">Turnstile List</Nav.Link>
                                <Nav.Link  href="/turnstileRecords">Turnstile Records</Nav.Link>
                            </Nav>
                            <Nav>                              
                                    <NavDropdown menuVariant="dark" title="Profile" >                               
                                    <NavDropdown.Header>
                                        Signed in as: <a href="#login">Mark Otto</a>
                                    </NavDropdown.Header>
                                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={()=>{props.onSignOut()}}>Sign Out</NavDropdown.Item>
                                    </NavDropdown>      
                            </Nav>
                        </Navbar.Collapse>
                        :(
                            <>
                            </>
                        )}
                </Container>
            </Navbar>
        </>
      );

}