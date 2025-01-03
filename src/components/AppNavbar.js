import { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../context/UserContext";

// Bootstrap Icons CSS import
import "bootstrap-icons/font/bootstrap-icons.css";

export default function AppNavbar() {
  const { user } = useContext(UserContext);

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container fluid>
        {/* Left-aligned content: Brand with Home icon */}
        <Navbar.Brand as={NavLink} to="/">
          <i className="bi bi-house-door-fill"></i> {/* Home icon */}
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-responsive" />
        <Navbar.Collapse id="navbar-responsive">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/products" exact="true">
              Products
            </Nav.Link>
          </Nav>

          {/* Right-aligned content */}
          <Nav className="ms-auto">
            {/* Conditional rendering of Cart and Orders links for regular users only */}
            {user.id !== null && !user.isAdmin && (
              <>
                <Nav.Link as={NavLink} to="/cart">
                  Cart
                </Nav.Link>
                <Nav.Link as={NavLink} to="/orders">
                  Orders
                </Nav.Link>
              </>
            )}

            {/* Profile and Logout links */}
            {user.id !== null ? (
              user.isAdmin ? (
                <Nav.Link as={Link} to="/logout">
                  Logout
                </Nav.Link>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/profile" exact="true">
                    Profile
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/logout" exact="true">
                    Logout
                  </Nav.Link>
                </>
              )
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" exact="true">
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/register" exact="true">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
