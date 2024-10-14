import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { useDispatch, useSelector } from "react-redux";
import {
  setProductName,
  setProductBarcode,
  setProductImage,
} from "../../redux/slices/productSlice";
import axios from "axios";

function AddProduct() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const { productName, productBarcode, productImage } = useSelector(
    (state) => state.product
  );

  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "productName") {
      dispatch(setProductName(value));
    } else if (name === "productBarcode") {
      dispatch(setProductBarcode(value));
    } else if (name === "productImage") {
      dispatch(setProductImage(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalData = {
      productName,
      productBarcode,
      productImage,
    };

    axios
      .post(`${import.meta.env.VITE_API_URL}/api/products`, finalData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        alert("Product submitted successfully!");
      })
      .catch((error) => {
        console.error("There was an error submitting the product:", error);
      });
  };

  const handleScan = (err, result) => {
    if (result) {
      dispatch(setProductBarcode(result.text));
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
            value={productName}
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
            value={productBarcode}
            onChange={handleInputChange}
            onClick={handleBarcodeClick}
          />
        </div>

        <div className="input">
          <label htmlFor="productImage">Product Image</label>
          <input
            type="text"
            name="productImage"
            placeholder="Product Image"
            value={productImage}
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
