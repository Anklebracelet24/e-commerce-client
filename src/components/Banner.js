import { Carousel } from "react-bootstrap";

export default function Banner({ data }) {
  const { title, content, destination, buttonLabel } = data;

  return (
    <section className="banner py-5">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            {/* Dynamic Banner Title */}
            <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">
              {title}
            </h1>
            {/* Dynamic Banner Text */}
            <p className="lead">{content}</p>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
              <a
                href={destination}
                className="btn btn-dark btn-lg px-4 me-md-2"
              >
                {buttonLabel}
              </a>
            </div>
          </div>
          <div className="col-lg-6">
            {/* Banner Carousel with no arrows, no indicators, and custom interval */}
            <Carousel controls={false} indicators={false} interval={3000}>
              <Carousel.Item>
                <img
                  className="d-block w-100 carousel-img"
                  src="https://images.pexels.com/photos/5112581/pexels-photo-5112581.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Customizable Treat Boxes"
                />
              </Carousel.Item>

              <Carousel.Item>
                <img
                  className="d-block w-100 carousel-img"
                  src="https://images.pexels.com/photos/227432/pexels-photo-227432.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Gourmet and Gluten-Free Options"
                />
              </Carousel.Item>

              <Carousel.Item>
                <img
                  className="d-block w-100 carousel-img"
                  src="https://images.pexels.com/photos/295043/pexels-photo-295043.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Same-Day Delivery"
                />
              </Carousel.Item>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
