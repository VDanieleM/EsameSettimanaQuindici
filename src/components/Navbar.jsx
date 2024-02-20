import React from "react";
import { Navbar as BootstrapNavbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Navbar = () => (
  <BootstrapNavbar bg="light" expand="lg">
    <Container>
      <BootstrapNavbar.Brand href="/">WordPress App</BootstrapNavbar.Brand>
      <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BootstrapNavbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/utenti">
            Utenti
          </Nav.Link>
          <Nav.Link as={Link} to="/posts">
            Articoli
          </Nav.Link>
        </Nav>
      </BootstrapNavbar.Collapse>
    </Container>
  </BootstrapNavbar>
);

export default Navbar;
