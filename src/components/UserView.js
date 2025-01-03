import { Row, Col } from "react-bootstrap";
import ProductCard from "../components/ProductCard";

export default function UserView({ productsData, handleProductSelect }) {
  return (
    <div className="product-list">
      <Row xs={1} sm={2} lg={3} xl={3} className="g-4">
        {productsData.map((product) => (
          <Col key={product._id}>
            <ProductCard
              productProp={product}
              onSelect={() => handleProductSelect(product)} // Pass selected product to handleProductSelect
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}
