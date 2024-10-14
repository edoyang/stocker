import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "./Logout";
import Theme from "./Theme";

const Navbar = () => {
  const token = useSelector(
    (state) => state.auth?.token || localStorage.getItem("jwtToken")
  );
  const username = useSelector((state) => state.auth?.user?.username);

  return (
    <div className="navbar">
      <Link className="logo" to="/">
        <h2>Hello {username}</h2>
      </Link>
      <Theme />
      <Link to="/products">Products</Link>
    </div>
  );
};

export default Navbar;
