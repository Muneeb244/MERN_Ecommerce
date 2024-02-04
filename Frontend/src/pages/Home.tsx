import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const Home = () => {

  const addToCartHandler = () => {}

  return (
    <div className="home">
      <section></section>

      <h1>
        Latest Products
        <Link to={"/search"} className="findmore">
          More
        </Link>
      </h1>

      <main>
      <ProductCard
              productId={"ahfa"}
              name={"macbook"}
              price={3434}
              stock={34}
              handler={addToCartHandler}
              photo={"https://d1iv6qgcmtzm6l.cloudfront.net/products/lg_npXwHYuAuabxaCdxYw56ouORuEsgAhrczzoCmEOz.jpg"}
            />
      </main>
    </div>
  );
};

export default Home;
