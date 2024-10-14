import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedRoute Component={Home} />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/add-product"
          element={<ProtectedRoute Component={AddProduct} />}
        />
        <Route path="/products" element={<ProtectedRoute Component={ProductPage} />} />
      </Routes>
    </>
  );
}

export default App;
