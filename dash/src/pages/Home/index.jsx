import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>This is home</h1>
      <Link to="/add-product">Add Product</Link>
      <Link to="/test">Test</Link>
    </div>
  );
};

export default Home;
