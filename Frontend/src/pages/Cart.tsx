import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItems from "../components/CartItems";
import { Link } from "react-router-dom";

const cartItems = [
  {
    productId: "afadsf",
    photo:
      "https://d1iv6qgcmtzm6l.cloudfront.net/products/lg_npXwHYuAuabxaCdxYw56ouORuEsgAhrczzoCmEOz.jpg",
    name: "Macbook",
    price: 3000,
    quantity: 4,
    stock: 10,
  },
];
const subtotal = 4000;
const tax = Math.round(subtotal * 0.8);
const shippingCharges = 200;
const discount = 300;
const total = subtotal + shippingCharges + tax;

const Cart = () => {
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (Math.random() > 0.5) setIsValidCouponCode(true);
      else setIsValidCouponCode(false);
    }, 1000);
    return () => {
      clearTimeout(timeoutId);
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  return (
    <div className="cart">
      <main>
        { cartItems.length > 0 ? cartItems.map((i, index) => (
          <CartItems key={index} cartItem={i} />
        )) : <h1>No Items added</h1>
        
        }
      </main>

      <aside>
        <p>Subtotal: {subtotal}rs</p>
        <p>Shipping Charges:{shippingCharges}rs</p>
        <p>Tax Charges: {tax}rs</p>
        <p>
          Discount: <em className="red"> - {discount}rs</em>
        </p>
        <p>
          <b>Total: {total}rs</b>
        </p>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Coupon code"
        />

        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              {discount}rs off using the
              <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon code
              <VscError />
            </span>
          ))}

          {
            cartItems.length > 0 && <Link to={"/shipping"}>Checkout</Link>
          }
      </aside>
    </div>
  );
};

export default Cart;
