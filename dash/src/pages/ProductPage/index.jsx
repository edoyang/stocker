import React, { useEffect, useState } from 'react';
import './style.css';
import { useSelector } from 'react-redux';
import axios from 'axios';

const ProductPage = () => {
    const token = useSelector((state) => state.auth.token);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const defaultImage = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setError('Failed to fetch products.');
                setLoading(false);
            }
        };

        if (token) {
            fetchProducts();
        }
    }, [token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='products-page'>
            <h1>Product Page</h1>
            <div className="products-container">
                {products.map((product) => (
                    <div key={product._id} className="product-card">
                        <div className="image-container">
                            <img
                                src={product.productImage || defaultImage}
                                alt={product.name}
                                onError={(e) => e.target.src = defaultImage}
                            />
                        </div>
                        <h4>{product.productName}</h4>
                        <p>{product.productBarcode}</p>
                        <p>Expiry Date: {product.expiryDate}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductPage;
