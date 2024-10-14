import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component

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
        <Route path="/test" element={<ProtectedRoute Component={Login} />} />
      </Routes>
    </>
  );
}

export default App;
