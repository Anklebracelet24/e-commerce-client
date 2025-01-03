import React, { useState } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
  Container,
  ToggleButton,
  ButtonGroup,
} from "react-bootstrap";

const ProductSearch = ({ onSearchResults }) => {
  const [searchType, setSearchType] = useState("name"); // Toggle between 'name' and 'price'
  const [name, setName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle search based on selected type
  const handleSearch = async () => {
    setLoading(true);
    setError("");

    const requestBody =
      searchType === "name"
        ? { name }
        : {
            minPrice: parseFloat(minPrice),
            maxPrice: parseFloat(maxPrice),
          };

    const endpoint =
      searchType === "name"
        ? `${process.env.REACT_APP_API_URL}/products/search-by-name`
        : `${process.env.REACT_APP_API_URL}/products/search-by-price`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      onSearchResults(data); // Pass search results to parent component
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle fetching all products
  const handleShowAllProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/products/active`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch all products");
      }

      const data = await response.json();
      onSearchResults(data); // Pass all products to parent component
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <h3 className="mb-4 text-center">Search for Products</h3>

      {/* Toggle Between Search Options */}
      <Row className="justify-content-center mb-4">
        <ButtonGroup>
          <ToggleButton
            id="toggle-name"
            type="radio"
            variant="outline-dark"
            name="searchType"
            value="name"
            checked={searchType === "name"}
            onChange={(e) => setSearchType(e.target.value)}
          >
            Search by Name
          </ToggleButton>
          <ToggleButton
            id="toggle-price"
            type="radio"
            variant="outline-dark"
            name="searchType"
            value="price"
            checked={searchType === "price"}
            onChange={(e) => setSearchType(e.target.value)}
          >
            Search by Price Range
          </ToggleButton>
        </ButtonGroup>
      </Row>

      {/* Search Form */}
      {searchType === "name" ? (
        <Row className="justify-content-center align-items-center">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      ) : (
        <Row className="justify-content-center align-items-center">
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Min Price:</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
              <Form.Label>Max Price:</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      )}

      {/* Search and Show All Buttons */}
      <Row className="justify-content-center">
        <Col md={3}>
          <Button
            variant="dark"
            onClick={handleSearch}
            className="w-100 mb-2"
            disabled={
              loading ||
              (searchType === "name" ? !name.trim() : !minPrice || !maxPrice)
            }
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Search"}
          </Button>
        </Col>
        <Col md={3}>
          <Button
            variant="light"
            onClick={handleShowAllProducts}
            className="w-100"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Show All"}
          </Button>
        </Col>
      </Row>

      {/* Error Message */}
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default ProductSearch;
