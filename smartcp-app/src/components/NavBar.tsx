import React from 'react';
import {Navbar,Container, Nav} from 'react-bootstrap';
import { NavLink } from 'react-router-dom'


export const Navigation = () => {
    
    return(
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>SmartCP</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link  href="/">Home</Nav.Link>
                        <Nav.Link  href="/addCard">Add Card</Nav.Link>
                        <Nav.Link  href="/cardsList">Cards List</Nav.Link>
                        <Nav.Link  href="/turnstileList">Turnstile List</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
      );

}