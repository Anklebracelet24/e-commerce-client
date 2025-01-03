import { Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./PreviewProducts.css"; // Import custom CSS

export default function PreviewProducts(props) {
  const { breakpoint, data } = props;
  const { _id, name, description, price } = data;

  return (
    <Col xs={12} md={breakpoint}>
      <Card className="product-preview-card mx-2">
        <Card.Body>
          <Card.Title className="text-center product-name">
            <Link to={`/products/${_id}`}>{name}</Link>
          </Card.Title>
          <Card.Text className="product-description">{description}</Card.Text>
        </Card.Body>
        <Card.Footer className="product-footer">
          <h5 className="text-center product-price">₱{price}</h5>
          <Link
            className="btn btn-primary details-btn d-block"
            to={`/products/${_id}`}
          >
            Details
          </Link>
        </Card.Footer>
      </Card>
    </Col>
  );
}
