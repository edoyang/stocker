import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import axios from "axios";

function AddProduct() {
  const [barcode, setBarcode] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);

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

    const finalData = {
      ...formData,
      productBarcode: barcode,
    };

    axios
      .post(`${import.meta.env.VITE_API_URL}/api/products`, finalData)
      .then((response) => {
        console.log("Product submitted successfully:", response.data);
        alert("Product submitted successfully!");
      })
      .catch((error) => {
        console.error("There was an error submitting the product:", error);
      });
  };

  const handleScan = (err, result) => {
    if (result) {
      setBarcode(result.text);
      setIsScannerOpen(false);
    }
  };

  const handleBarcodeClick = () => {
    const confirmUseCamera = window.confirm(
      "Do you want to use the camera for scanning?"
    );
    if (confirmUseCamera) {
      setIsScannerOpen(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="input">
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            name="productName"
            placeholder="Product Name"
            value={formData.productName}
            onChange={handleInputChange}
          />
        </div>

        <div className="input">
          <label htmlFor="productBarcode">Product Barcode</label>
          <input
            type="text"
            name="productBarcode"
            id="productBarcode"
            placeholder="Product Barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onClick={() => handleBarcodeClick()}
          />
        </div>

        <div className="input">
          <label htmlFor="productImage">Product Image</label>
          <input
            type="text"
            name="productImage"
            placeholder="Product Image"
            value={formData.productImage}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit">Submit</button>
      </form>

      {isScannerOpen && (
        <BarcodeScannerComponent
          width={500}
          height={500}
          onUpdate={handleScan}
        />
      )}
    </>
  );
}

export default AddProduct;
