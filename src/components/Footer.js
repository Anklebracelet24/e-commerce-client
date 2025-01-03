import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <Row>
          {/* Left side: Company Info */}
          <Col md={4} className="mb-3">
            <h4>Dessert Haven</h4>
            <p>
              We are committed to providing quality products and services. Reach
              out to us for more information or inquiries.
            </p>
          </Col>

          {/* Middle: Quick Links */}
          <Col md={4} className="mb-3">
            <h5>Quick Links</h5>
            <Nav className="flex-column">
              <Nav.Item>
                <Link to="/" className="text-white text-decoration-none">
                  Home
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/about" className="text-white text-decoration-none">
                  About Us
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link to="/contact" className="text-white text-decoration-none">
                  Contact Us
                </Link>
              </Nav.Item>
              <Nav.Item>
                <Link
                  to="/products"
                  className="text-white text-decoration-none"
                >
                  Products
                </Link>
              </Nav.Item>
            </Nav>
          </Col>

          {/* Right side: Social Media Links with Bootstrap Icons */}
          <Col md={4} className="mb-3">
            <h5>Follow Us</h5>
            <Nav>
              <Nav.Item className="me-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white"
                >
                  <i
                    className="bi bi-facebook"
                    style={{ fontSize: "24px" }}
                  ></i>
                </a>
              </Nav.Item>
              <Nav.Item className="me-3">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white"
                >
                  <i className="bi bi-twitter" style={{ fontSize: "24px" }}></i>
                </a>
              </Nav.Item>
              <Nav.Item className="me-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white"
                >
                  <i
                    className="bi bi-instagram"
                    style={{ fontSize: "24px" }}
                  ></i>
                </a>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
        {/* Bottom: Copyright */}
        <Row>
          <Col className="text-center mt-2">
            <p>
              &copy; {new Date().getFullYear()} Dessert Haven. All Rights
              Reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
