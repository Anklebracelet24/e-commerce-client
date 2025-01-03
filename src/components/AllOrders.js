import { useState, useEffect } from "react";
import { Table } from "react-bootstrap";

export default function AllOrders({ token }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (token) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/all-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setOrders(data);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        });
    }
  }, [token]);

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr className="text-center">
          <th>Order ID</th>
          <th>User</th>
          <th>Product</th>
          <th>Quantity</th>
          <th>Total Price</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.length > 0 ? (
          orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user.name}</td>
              <td>{order.product.name}</td>
              <td>{order.quantity}</td>
              <td>{order.totalPrice}</td>
              <td>{order.status}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center">
              No orders found.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}
