import Container from "react-bootstrap/Container";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext"; // Import CartProvider

import AppNavbar from "./components/AppNavbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Error from "./pages/Error";
import Profile from "./pages/Profile";
import CartView from "./pages/CartView";
import ProductDetails from "./components/ProductDetails";
import Orders from "./pages/Orders";
import Footer from "./components/Footer";

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <AppNavbar />
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:productId" element={<ProductDetails />} />
              <Route path="/cart" element={<CartView />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/register" element={<Register />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </Container>
          <Footer />
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
