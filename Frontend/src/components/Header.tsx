import { signOut } from "firebase/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { cartReducerInitialState } from "../types/reducer-types";
import { User } from "../types/types";


interface PropsType {
  user: User | null
}

const Header = ({user}:PropsType) => {

  const { cartItems } =
    useSelector(
      (state: { cartReducer: cartReducerInitialState }) => state.cartReducer
    );

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const logoutHandler = async () => {
      try {
        await signOut(auth);
        toast.success("Sign Out Successfully")
        setIsOpen(false)
      } catch (error) {
        toast.error("Sign out failed")
      }
    }


  return (
    <nav className="header">
      <Link onClick={() => setIsOpen(false)} to={"/"}>Home</Link>
      <Link onClick={() => setIsOpen(false)} to={"/search"}>
        <FaSearch />
      </Link>
      <Link className="item-number-parent" onClick={() => setIsOpen(false)} to={"/cart"}>
        <FaShoppingBag />
        <span className="cart-item-number" >{cartItems.length}</span>
      </Link>

      {user?._id ? (
        <>
          <button onClick={() => setIsOpen(prev => !prev)}>
            <FaUser />
          </button>
          <dialog open={isOpen}>
            <div>
                {
                    user?.role === "admin" && <Link to={'/admin/dashboard'}>
                    Admin</Link>
                }
                <Link to={"/orders"} >Orders</Link>
                <button onClick={logoutHandler} >
                    <FaSignOutAlt />
                </button>
            </div>
          </dialog>
        </>
      ) : (
        <Link to={"/login"}>
          <FaSignInAlt />
        </Link>
      )}
    </nav>
  );
};

export default Header;
