import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "./Logout";
import Theme from "./Theme";

const Navbar = () => {
  const token = useSelector(
    (state) => state.auth?.token || localStorage.getItem("jwtToken")
  );

  return (
    <div>
      <Link to="/">Home</Link>

      {token ? (
        <>
          <Link to="/add-product">Add Product</Link>
          <Logout />
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}

      <Theme />
    </div>
  );
};

export default Navbar;
