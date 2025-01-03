import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Form,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Notyf } from "notyf";
import UserContext from "../context/UserContext";

export default function CartView() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeProductId, setRemoveProductId] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // Memoize notyf instance to ensure it remains stable
  const notyf = useMemo(() => new Notyf(), []);

  // Now include notyf in the dependencies since it's memoized
  const fetchCartItems = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/cart/get-cart`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      if (data && data.cart && data.cart.cartItems) {
        setCartItems(data.cart.cartItems);
        setTotalPrice(data.cart.totalPrice);

        const productDetails = {};
        await Promise.all(
          data.cart.cartItems.map(async (item) => {
            const productRes = await fetch(
              `${process.env.REACT_APP_API_BASE_URL}/products/${item.productId}`
            );
            const productData = await productRes.json();
            productDetails[item.productId] = productData;
          })
        );
        setProducts(productDetails);
      } else {
        setCartItems([]);
        setTotalPrice(0);
        setProducts({});
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      notyf.error("Failed to load cart items");
    }
  }, [notyf]); // Add notyf as dependency

  useEffect(() => {
    if (!user.id) {
      navigate("/login");
    } else if (user.isAdmin) {
      navigate("/");
    } else {
      fetchCartItems();
    }
  }, [user, navigate, fetchCartItems]);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/update-cart-quantity`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ productId, newQuantity }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchCartItems();
        notyf.success("Quantity updated");
      })
      .catch((error) => {
        console.error("Error updating quantity:", error);
        notyf.error("Failed to update quantity");
      });
  };

  const removeFromCart = () => {
    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/cart/${removeProductId}/remove-from-cart`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then(() => {
        fetchCartItems();
        notyf.success("Item removed from cart");
        setShowRemoveModal(false);
      })
      .catch((error) => {
        console.error("Error removing item:", error);
        notyf.error("Failed to remove item");
        setShowRemoveModal(false);
      });
  };

  const clearCart = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/cart/clear-cart`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        setCartItems([]);
        setTotalPrice(0);
        setProducts({});
        notyf.success("Cart cleared");
        setShowClearModal(false);
      })
      .catch((error) => {
        console.error("Error clearing cart:", error);
        notyf.error("Failed to clear cart");
        setShowClearModal(false);
      });
  };

  const checkout = () => {
    const orderData = {
      totalPrice: totalPrice,
    };

    fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(orderData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Ordered successfully") {
          notyf.success("Order placed successfully");
          clearCart();
          navigate("/orders");
        } else {
          notyf.error("Failed to place order: " + data.error);
        }
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        notyf.error("Failed to place order");
      });
  };

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">Your Cart</h3>
      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty</p>
      ) : (
        <>
          {cartItems.map((item) => {
            const product = products[item.productId] || {};
            return (
              <Card className="mb-3 shadow-sm" key={item.productId}>
                <Card.Body>
                  <Row>
                    <Col md={2} className="d-flex justify-content-center">
                      <Card.Img
                        variant="top"
                        src={product.imageUrl}
                        style={{ maxHeight: "150px", objectFit: "contain" }}
                      />
                    </Col>
                    <Col md={6}>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>PhP {product.price}</Card.Text>
                      <Card.Text>
                        <strong>Subtotal: </strong>PhP {item.subtotal}
                      </Card.Text>
                    </Col>
                    <Col md={2}>
                      <Form.Control
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) =>
                          updateQuantity(
                            item.productId,
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </Col>
                    <Col
                      md={2}
                      className="d-flex align-items-center justify-content-center"
                    >
                      <Button
                        variant="danger"
                        onClick={() => {
                          setShowRemoveModal(true);
                          setRemoveProductId(item.productId);
                        }}
                        className="w-100"
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            );
          })}

          <Row className="mt-4">
            <Col md={6}>
              <h4>Total: PhP {totalPrice}</h4>
            </Col>
            <Col md={6} className="d-flex justify-content-end">
              <div className="d-flex gap-2">
                <Button
                  variant="warning"
                  onClick={() => setShowClearModal(true)}
                >
                  Clear Cart
                </Button>
                <Button
                  variant="success"
                  onClick={() => setShowCheckoutModal(true)} // Show the checkout modal
                  disabled={cartItems.length === 0}
                >
                  Checkout
                </Button>
              </div>
            </Col>
          </Row>
        </>
      )}

      {/* Confirmation Modal for clearing cart */}
      <Modal show={showClearModal} onHide={() => setShowClearModal(false)}>
        <Modal.Header>
          <Modal.Title>Clear Cart Confirmation</Modal.Title>
          <Button
            variant="link"
            className="text-danger p-0"
            onClick={() => setShowClearModal(false)}
            style={{ position: "absolute", right: "10px", top: "10px" }}
          >
            <span className="text-dark">X</span>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to clear all items from your cart?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={clearCart}>
            Proceed
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal for checkout */}
      <Modal
        show={showCheckoutModal}
        onHide={() => setShowCheckoutModal(false)}
      >
        <Modal.Header>
          <Modal.Title>Checkout Confirmation</Modal.Title>
          <Button
            variant="link"
            className="text-danger p-0"
            onClick={() => setShowCheckoutModal(false)}
            style={{ position: "absolute", right: "10px", top: "10px" }}
          >
            <span className="text-dark">X</span>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to proceed to checkout?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={checkout}>
            Proceed
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal for removing item */}
      <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)}>
        <Modal.Header>
          <Modal.Title>Remove Item Confirmation</Modal.Title>
          <Button
            variant="link"
            className="text-danger p-0"
            onClick={() => setShowRemoveModal(false)}
            style={{ position: "absolute", right: "10px", top: "10px" }}
          >
            <span className="text-dark">X</span>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <p>Remove this item from your cart?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={removeFromCart}>
            Proceed
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
