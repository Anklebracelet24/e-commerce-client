import { useState, useEffect } from "react";
import { Button, Table, Modal } from "react-bootstrap";
import EditProduct from "./EditProduct";
import ArchiveProduct from "./ArchiveProduct";
import AddProduct from "./AddProduct";
import AllOrders from "./AllOrders"; // Import AllOrders

export default function AdminView({ productsData, fetchData }) {
  const [products, setProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  // Mapping the products data
  useEffect(() => {
    const productsArr = productsData.map((product) => {
      return (
        <tr key={product._id}>
          <td>{product.name}</td>
          <td>{product.description}</td>
          <td>{product.price}</td>
          <td className={product.isActive ? "text-success" : "text-danger"}>
            {product.isActive ? "Available" : "Unavailable"}
          </td>
          <td className="text-center">
            <EditProduct product={product} fetchData={fetchData} />
          </td>
          <td className="text-center">
            <ArchiveProduct
              product={product}
              isActive={product.isActive}
              fetchData={fetchData}
            />
          </td>
        </tr>
      );
    });

    setProducts(productsArr);
  }, [productsData]);

  const handleShowAddProduct = () => setShowAddProduct(true);
  const handleCloseAddProduct = () => setShowAddProduct(false);

  const handleShowOrders = () => setShowOrders(true);
  const handleCloseOrders = () => setShowOrders(false);

  return (
    <>
      <h1 className="text-center my-4">Admin Dashboard</h1>

      <div className="d-flex justify-content-center align-items-center">
        <Button
          variant="primary"
          onClick={handleShowAddProduct}
          className="mb-4 mx-3 px-5"
        >
          Add Product
        </Button>

        <Button
          variant="success"
          onClick={handleShowOrders}
          className="mb-4 mx-3 px-5"
        >
          Orders
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr className="text-center">
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Availability</th>
            <th colSpan="2">Actions</th>
          </tr>
        </thead>
        <tbody>{products}</tbody>
      </Table>

      <Modal show={showAddProduct} onHide={handleCloseAddProduct}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddProduct fetchData={fetchData} />
        </Modal.Body>
      </Modal>

      {/* Orders Modal */}
      <Modal show={showOrders} onHide={handleCloseOrders} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>All Orders</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AllOrders token={localStorage.getItem("token")} />
        </Modal.Body>
      </Modal>
    </>
  );
}
