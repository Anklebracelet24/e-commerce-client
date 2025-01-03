import { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Button, Spinner, Modal } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { Notyf } from "notyf";
import ResetPassword from "../components/ResetPassword";
import UpdateProfile from "../components/UpdateProfile";
import UserContext from "../context/UserContext";

export default function Profile() {
  const notyf = new Notyf();
  const { user } = useContext(UserContext);

  const [details, setDetails] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false); // Reset password modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Success modal state

  // Fetch profile details on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      notyf.error("Please log in to view your profile");
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          setDetails(data.user);
        } else if (data.error) {
          notyf.error(data.error);
        } else {
          notyf.error("Unable to load profile data");
        }
      })
      .catch((error) => {
        console.error("Profile fetch error:", error);
        notyf.error("Error loading profile. Please try again later.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Handle profile update response
  const handleUpdate = (updatedData) => {
    const newDetails = updatedData.user || updatedData;
    setDetails(newDetails);
    setIsEditing(false);
    notyf.success("Profile updated successfully!");
  };

  if (user.id === null) {
    return <Navigate to="/products" />;
  }

  if (isLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Loading profile...</span>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col md={8} className="p-5 bg-muted text-dark rounded">
          <h1 className="my-5">Profile</h1>
          {details && (
            <>
              <h2 className="mt-3">
                {details.firstName || "First"} {details.lastName || "Last"}
              </h2>
              <hr />
              <h4>Contacts</h4>
              <ul>
                <li>Email: {details.email || "Not provided"}</li>
                <li>Mobile No: {details.mobileNo || "Not provided"}</li>
              </ul>
            </>
          )}

          <div className="d-flex gap-3 mt-4">
            <Button
              variant="light"
              onClick={() => setIsEditing(!isEditing)}
              disabled={!details}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>

            {/* Reset Password Button */}
            <Button
              variant="light"
              onClick={() => setShowResetPasswordModal(true)}
            >
              Reset Password
            </Button>
          </div>

          {isEditing && (
            <div className="mt-4">
              <UpdateProfile userDetails={details} onUpdate={handleUpdate} />
            </div>
          )}
        </Col>
      </Row>

      {/* Modal for Reset Password */}
      <Modal
        show={showResetPasswordModal}
        onHide={() => setShowResetPasswordModal(false)} // Close reset password modal
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ResetPassword
            closeResetModal={() => {
              setShowResetPasswordModal(false); // Close reset password modal
              setShowSuccessModal(true); // Immediately show success modal
            }}
          />
        </Modal.Body>
      </Modal>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)} // Close success modal
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Password Reset Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your password has been updated successfully.</Modal.Body>
      </Modal>
    </Container>
  );
}
