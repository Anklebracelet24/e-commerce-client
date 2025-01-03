import { useState, useEffect, useContext } from "react";
import { Form, Button, FloatingLabel } from "react-bootstrap";
import { Navigate, Link } from "react-router-dom";
import { Notyf } from "notyf";
import UserContext from "../context/UserContext";

export default function Login() {
  const notyf = new Notyf();
  const { user, setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(false);

  function authenticate(e) {
    e.preventDefault();

    if (!email || !password) {
      notyf.error("Please fill in both fields.");
      return;
    }

    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access) {
          localStorage.setItem("token", data.access);
          retrieveUserDetails(data.access);

          setEmail("");
          setPassword("");
          notyf.success(`Successful Login`);
        } else {
          if (data.message === "Incorrect email or password") {
            notyf.error(`Incorrect Credentials. Try Again.`);
          } else {
            notyf.error(`${email} does not exist. Try Again.`);
          }
        }
      })
      .catch((error) => {
        notyf.error("An error occurred. Please try again.");
        console.error("Error:", error);
      });
  }

  function retrieveUserDetails(token) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user && data.user._id) {
          setUser({
            id: data.user._id,
            isAdmin: data.user.isAdmin,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching user details:", error);
        notyf.error("Failed to fetch user details.");
      });
  }

  useEffect(() => {
    if (email !== "" && password !== "") {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [email, password]);

  if (user.id !== null) {
    return <Navigate to="/" />;
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
      <Form onSubmit={(e) => authenticate(e)}>
        <h1 className="my-4 text-center">Login</h1>

        <FloatingLabel controlId="email" label="Email address" className="mb-3">
          <Form.Control
            type="email"
            placeholder="Enter email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FloatingLabel>

        <FloatingLabel controlId="password" label="Password" className="mb-3">
          <Form.Control
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FloatingLabel>

        <Button
          variant={isActive ? "primary" : "danger"}
          type="submit"
          id="loginBtn"
          disabled={!isActive}
          className="w-100"
        >
          Submit
        </Button>

        <div className="text-center mt-3">
          <p>
            Don't have an account yet? <Link to="/register">Click here</Link> to
            register.
          </p>
        </div>
      </Form>
    </div>
  );
}
