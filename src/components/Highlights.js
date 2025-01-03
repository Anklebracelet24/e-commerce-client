import "bootstrap-icons/font/bootstrap-icons.css";

export default function Highlights() {
  return (
    <section className="highlights py-5">
      <div className="container">
        <div className="row py-5 row-cols-1 row-cols-lg-3 feature-border">
          <div className="col d-flex align-items-start feature-box">
            <div className="icon-square text-body-emphasis  d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
              <i className="bi bi-box2-heart"></i>
            </div>
            <div>
              <h3 className="fs-2 text-body-emphasis">
                Customizable Treat Boxes
              </h3>
              <p>
                Allow customers to mix and match from a selection of premium
                desserts, from macarons to brownies, creating the perfect treat
                box for any occasion.
              </p>
            </div>
          </div>
          <div className="col d-flex align-items-start feature-box">
            <div className="icon-square text-body-emphasis  d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
              <i className="bi bi-cake2"></i>
            </div>
            <div>
              <h3 className="fs-2 text-body-emphasis">Gluten-Free Options</h3>
              <p>
                Include a range of gourmet, gluten-free, and dairy-free
                desserts, making indulgence accessible to everyone.
              </p>
            </div>
          </div>
          <div className="col d-flex align-items-start feature-box">
            <div className="icon-square text-body-emphasis d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
              <i className="bi bi-truck"></i>
            </div>
            <div>
              <h3 className="fs-2 text-body-emphasis">Same-Day Delivery</h3>
              <p>
                Offer convenient same-day delivery options to satisfy cravings
                or handle last-minute gift needs, perfect for birthdays or
                celebrations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
