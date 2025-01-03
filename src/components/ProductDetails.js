import React, { useContext, useState } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { Notyf } from "notyf";
import UserContext from "../context/UserContext";
import { useCart } from "../context/CartContext";

export default function ProductDetails({ product, onClose }) {
  const { user } = useContext(UserContext);
  const { addToCart } = useCart();
  const [showPrompt, setShowPrompt] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const notyf = new Notyf();

  const handleAddToCart = async () => {
    if (user.id) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/cart/add-to-cart`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              productId: product._id,
              price: product.price,
              quantity: parseInt(quantity),
              subtotal: product.price * parseInt(quantity),
            }),
          }
        );

        const data = await response.json();

        if (data.cart) {
          addToCart(data.cart.cartItems, data.cart.totalPrice);

          notyf.success("Product added to cart successfully!");
          onClose();
        } else {
          console.log("Failed to add item to cart:", data.message);
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        notyf.error("Failed to add product to cart.");
      }
    } else {
      setShowPrompt(true);
    }
  };

  const handleRedirectToLogin = () => {
    setShowPrompt(false);
    setRedirectToLogin(true);
  };

  const handleClosePrompt = () => {
    setShowPrompt(false);
  };

  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Modal show={true} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{product.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {/* Product Image */}
            <Col
              xs={12}
              md={4}
              className="d-flex align-items-center justify-content-center"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="img-fluid"
                style={{ maxHeight: "300px", objectFit: "contain" }}
              />
            </Col>

            {/* Product Details */}
            <Col xs={12} md={8}>
              <h5>Description</h5>
              <p>{product.description}</p>

              <p>
                <strong>Price:</strong> PhP {product.price}
              </p>

              {/* Quantity Selector */}
              <Form.Group controlId="quantity" className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min={1}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Login Prompt Modal for when user is not logged in */}
      <Modal show={showPrompt} onHide={handleClosePrompt} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You must be logged in to add this item to the cart.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleRedirectToLogin}>
            Login
          </Button>
          <Button variant="secondary" onClick={handleClosePrompt}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
