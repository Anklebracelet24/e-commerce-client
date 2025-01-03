import React, { useState, useEffect } from "react";
import { ListGroup, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Notyf } from "notyf";

export default function Orders() {
  const [orderHistory, setOrderHistory] = useState([]);
  const notyf = new Notyf();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/orders/my-orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await res.json();

      if (data.orders) {
        // Fetch product names for each item in each order
        const ordersWithProductNames = await Promise.all(
          data.orders.map(async (order) => {
            const productsWithNames = await Promise.all(
              order.productsOrdered.map(async (item) => {
                const productRes = await fetch(
                  `${process.env.REACT_APP_API_BASE_URL}/products/${item.productId}`
                );
                const productData = await productRes.json();
                return {
                  ...item,
                  productName: productData.name,
                };
              })
            );
            return {
              ...order,
              productsOrdered: productsWithNames,
            };
          })
        );
        setOrderHistory(ordersWithProductNames);
      } else {
        notyf.error("No orders found");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      notyf.error("Failed to load orders");
      navigate("/login");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Order History</h2>
      {orderHistory.length === 0 ? (
        <p className="text-center">No orders placed yet.</p>
      ) : (
        <ListGroup>
          {orderHistory.map((order) => (
            <ListGroup.Item key={order._id} className="mb-3">
              <h6>Order ID: {order._id}</h6>
              {order.productsOrdered.map((item) => (
                <div key={item.productId} className="ml-3">
                  <h4>
                    <strong>
                      <span className="orders-itemname">
                        {item.productName}
                      </span>
                    </strong>{" "}
                    - Quantity: {item.quantity}
                  </h4>
                </div>
              ))}
              <div className="mt-2">
                <strong>Total Price:</strong>{" "}
                <span className="orders-totalprice">
                  {" "}
                  PhP {order.totalPrice}
                </span>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
}
