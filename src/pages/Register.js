import { useState, useEffect, useContext } from "react";
import { Form, Button, FloatingLabel } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import UserContext from "../context/UserContext";
import { Notyf } from "notyf";

export default function Register() {
  const notyf = new Notyf();
  const { user } = useContext(UserContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false); // New state

  useEffect(() => {
    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      mobileNo !== "" &&
      password !== "" &&
      confirmPassword !== "" &&
      password === confirmPassword &&
      mobileNo.length === 11
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [firstName, lastName, email, mobileNo, password, confirmPassword]);

  function registerUser(e) {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobileNo: mobileNo,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Registered successfully") {
          setFirstName("");
          setLastName("");
          setEmail("");
          setMobileNo("");
          setPassword("");
          setConfirmPassword("");
          notyf.success("Registration successful");
          setRedirectToLogin(true); // Redirect after successful registration
        } else if (data.message === "Email invalid") {
          notyf.error("Email is invalid");
        } else if (data.message === "Mobile number is invalid") {
          notyf.error("Mobile number is invalid");
        } else if (
          data.message === "Password must be at least 8 characters long"
        ) {
          notyf.error("Password must be at least 8 characters");
        } else {
          notyf.error("Something went wrong.");
        }
      });
  }

  if (user.id !== null) {
    return <Navigate to="/products" />;
  }

  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }

  return (
    <div
      className="form-container shadow-lg p-4 mt-5 mx-auto"
      style={{
        maxWidth: "400px",
        borderRadius: "8px",
        border: "1px solid #ddd",
      }}
    >
      <Form onSubmit={(e) => registerUser(e)}>
        <h1 className="my-4 text-center">Register</h1>

        <FloatingLabel
          controlId="firstName"
          label="First Name"
          className="mb-3"
        >
          <Form.Control
            type="text"
            placeholder="Enter First Name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </FloatingLabel>

        <FloatingLabel controlId="lastName" label="Last Name" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter Last Name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </FloatingLabel>

        <FloatingLabel controlId="email" label="Email" className="mb-3">
          <Form.Control
            type="email"
            placeholder="Enter Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="mobileNo"
          label="Mobile Number"
          className="mb-3"
        >
          <Form.Control
            type="text"
            placeholder="Enter 11 Digit No."
            required
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
          />
        </FloatingLabel>

        <FloatingLabel controlId="password" label="Password" className="mb-3">
          <Form.Control
            type="password"
            placeholder="Enter Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="confirmPassword"
          label="Confirm Password"
          className="mb-3"
        >
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FloatingLabel>

        <Button
          variant={isActive ? "primary" : "danger"}
          type="submit"
          id="submitBtn"
          disabled={!isActive}
          className="w-100"
        >
          Please enter your registration details
        </Button>

        <div className="text-center mt-3">
          <p>
            Already have an account? <Link to="/login">Click here</Link> to
            login.
          </p>
        </div>
      </Form>
    </div>
  );
}
