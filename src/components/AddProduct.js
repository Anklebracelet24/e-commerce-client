import { useState, useEffect, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { Notyf } from "notyf";

export default function AddProduct({ fetchData }) {
  const notyf = new Notyf();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  // input states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // New state for image URL

  function createProduct(e) {
    e.preventDefault();

    let token = localStorage.getItem("token");

    fetch(`${process.env.REACT_APP_API_BASE_URL}/products/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        description: description,
        price: price,
        imageUrl: imageUrl, // Include imageUrl in the request body
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setName("");
          setDescription("");
          setPrice(0);
          setImageUrl(""); // Clear image URL input
          notyf.success("Product Added");
          fetchData(); // Refresh product list
          navigate("/products");
        } else {
          notyf.error("Error: Something Went Wrong.");
        }
      });
  }

  return user.isAdmin === true ? (
    <>
      <h1 className="my-5 text-center">Add Product</h1>
      <Form onSubmit={(e) => createProduct(e)}>
        <Form.Group>
          <Form.Label>Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Price:</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Price"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Image URL:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Image URL"
            required
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="my-5">
          Submit
        </Button>
      </Form>
    </>
  ) : (
    <Navigate to="/products" />
  );
}
