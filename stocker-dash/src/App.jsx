import { useState } from "react";
import axios from "axios";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import AddProduct from "./pages/AddProduct/AddProduct";
import Test from "./pages/Test";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/add-product" Component={AddProduct} />
        <Route path="/test" Component={Test} />
      </Routes>
    </>
  );
}

export default App;
