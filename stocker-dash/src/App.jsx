import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    productName: "",
    productBarcode: "",
    productImage: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Make the POST request with Axios
    axios
      .post("http://localhost:5000/api/products", formData)
      .then((response) => {
        console.log("Product submitted successfully:", response.data);
        alert("Product submitted successfully!");
      })
      .catch((error) => {
        console.error("There was an error submitting the product:", error);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={formData.productName}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="productBarcode"
          placeholder="Product Barcode"
          value={formData.productBarcode}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="productImage"
          placeholder="Product Image"
          value={formData.productImage}
          onChange={handleInputChange}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default App;
