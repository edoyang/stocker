import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const navigate = useNavigate();

  // Get the token from Redux store
  const token = useSelector(
    (state) => state.auth?.token || localStorage.getItem("jwtToken")
  ); // Check Redux first, then localStorage

  useEffect(() => {
    // If no token is found, redirect to login
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <div>
      <h1>This is home</h1>
      <Link to="/add-product">Add Product</Link>
      <Link to="/test">Test</Link>
    </div>
  );
};

export default Home;
