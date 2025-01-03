import Banner from "../components/Banner";
import Highlights from "../components/Highlights";
import FeaturedProducts from "../components/FeaturedProducts";

export default function Home() {
  const data = {
    title: "Dessert Haven",
    content:
      "Welcome to your sweet escape—a haven of indulgent delights crafted to satisfy every craving. From decadent treats to irresistible creations, we’re here to sweeten every moment and make life a little more delicious.",
    destination: "/products",
    buttonLabel: "Check our Desserts",
  };

  return (
    <>
      {/* Banner Section */}
      <Banner data={data} />
      {/* Highlights Section */}
      <Highlights />
      {/* Featured Products Section */}
      <FeaturedProducts />
    </>
  );
}
