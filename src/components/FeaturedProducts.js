import { useState, useEffect } from "react";
import { CardGroup, Button, Modal, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // For modal
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/active`)
      .then((res) => res.json())
      .then((data) => {
        const featuredProducts = [];
        const usedIndices = new Set();

        // Select 3 random unique products
        while (
          featuredProducts.length < 3 &&
          data.length > featuredProducts.length
        ) {
          const randomIndex = Math.floor(Math.random() * data.length);
          if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            featuredProducts.push(data[randomIndex]);
          }
        }

        setProducts(featuredProducts);
      });
  }, []);

  // Open the modal with selected product details
  const handleShowModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setShowModal(false);
  };

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Featured Products</h2>
      <Row className="row-cols-1 row-cols-md-3 g-4 justify-content-center">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            productProp={product}
            onSelect={() => handleShowModal(product)}
          />
        ))}

        <Link to={`/products`} className="btn btn-secondary">
          Go to Products
        </Link>
      </Row>

      {/* Product Details Modal */}
      {selectedProduct && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedProduct.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{selectedProduct.description}</p>
            <p>
              <strong>Price:</strong> PhP {selectedProduct.price}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Link to={`/products`} className="btn btn-secondary">
              Go to Products
            </Link>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}
