import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { VscError } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItems from "../components/CartItems";
import {
  addToCart,
  calculatePrice,
  discountApplied,
  removeCartitem,
} from "../redux/reducer/cartReducer";
import { cartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import axios from "axios";
import { server } from "../redux/store";

const Cart = () => {
  const { cartItems, subtotal, total, tax, shippingCharges, discount } =
    useSelector(
      (state: { cartReducer: cartReducerInitialState }) => state.cartReducer
    );

  const dispatch = useDispatch();

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock)
      return toast.error("Max quantity reached");

    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };

  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1)
      return toast.error("Press delete to remove item");

    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };

  const removeHandler = (productId: string) => {
    dispatch(removeCartitem(productId));
  };

  useEffect(() => {
    const { token, cancel } = axios.CancelToken.source();

    const timeoutId = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {
          cancelToken: token,
        })
        .then((res) => {
          dispatch(discountApplied(res.data.discount));
          setIsValidCouponCode(true);
          dispatch(calculatePrice());
        })
        .catch(() => {
          dispatch(discountApplied(0));
          setIsValidCouponCode(false);
          dispatch(calculatePrice());
        });

      if (Math.random() > 0.5) setIsValidCouponCode(true);
      else setIsValidCouponCode(false);
    }, 500);
    return () => {
      clearTimeout(timeoutId);
      cancel();
      setIsValidCouponCode(false);
    };
  }, [couponCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((i, index) => (
            <CartItems
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
              key={index}
              cartItem={i}
            />
          ))
        ) : (
          <h1>No Items added</h1>
        )}
      </main>

      <aside>
        <p>Subtotal: Rs.{subtotal}</p>
        <p>Shipping Charges: Rs.{shippingCharges}</p>
        <p>Tax: Rs.{tax}</p>
        <p>
          Discount: <em className="red"> - Rs.{discount}</em>
        </p>
        <p>
          <b>Total: Rs.{total}</b>
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
              Rs.{discount} off using code
              <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid Coupon code
              <VscError />
            </span>
          ))}

        {cartItems.length > 0 && <Link to={"/shipping"}>Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
