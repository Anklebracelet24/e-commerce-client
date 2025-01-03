import { useState } from "react";
import { Button, Form, Spinner, Row, Col } from "react-bootstrap";
import { Notyf } from "notyf";

export default function UpdateProfile({ userDetails, onUpdate }) {
  const notyf = new Notyf();
  const [formData, setFormData] = useState({
    firstName: userDetails.firstName || "",
    lastName: userDetails.lastName || "",
    mobileNo: userDetails.mobileNo || "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      notyf.success("Profile updated successfully!");
      onUpdate(formData); // Callback to update parent component state
    } catch (error) {
      notyf.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-light p-4 rounded shadow-sm">
      <h3 className="mb-4">Update Your Profile</h3>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="border-secondary"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="border-secondary"
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="mobileNo" className="mb-3">
          <Form.Label>Mobile No</Form.Label>
          <Form.Control
            type="text"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            required
            className="border-secondary"
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          disabled={isLoading}
          className="w-100"
        >
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />{" "}
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </Button>
      </Form>
    </div>
  );
}
