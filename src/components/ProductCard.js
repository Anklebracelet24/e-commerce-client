import { Link } from "react-router-dom";

export default function ProductCard({ productProp, isFeatured }) {
  const { _id, name, description, price, imageUrl } = productProp;

  return (
    <div className="col">
      <div
        className="card card-cover overflow-hidden text-bg-dark rounded-4 shadow-lg position-relative"
        style={{
          backgroundImage: `url(${imageUrl || "placeholder-image.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "400px", // Fixed height for consistency
        }}
      >
        {/* Always-visible Overlay */}
        <div className="overlay d-flex flex-column justify-content-end p-5 text-white text-shadow-1 position-absolute top-0 bottom-0 start-0 end-0">
          <h3 className="display-6 lh-1 fw-bold card-title">{name}</h3>
          <p className="fw-bold card-price">Price: PhP {price}</p>

          {/* Remove the "Details" button for featured products */}
          {!isFeatured && (
            <Link
              to={`/products/${_id}`}
              className="btn btn-light w-100 card-btn"
            >
              Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
