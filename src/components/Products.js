import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner from './Banner';
import Navigation from './Navigation';
import './Products.css';
import ChatBot from './ChatBot';
const Products = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://joshmachpharmacy-e682e263652d.herokuapp.com/api/products/all');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const formatPrice = (price) => {
        return `KES ${price.toLocaleString('en-US')}`;
    };

    const handleProductClick = async (id) => {
        try {
            const response = await fetch(`https://joshmachpharmacy-e682e263652d.herokuapp.com/api/products/details?id=${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // Navigate to product details page with product data
            navigate(`/product/${id}`, { state: { product: data } });
        } catch (error) {
            console.error('Error fetching product details:', error);
            // Handle error as needed (e.g., show error message)
        }
    };

    return (
        <div className="products-container">
            <Banner />
            <Navigation />
            {products.map(product => (
                <div key={product.id} className="product" onClick={() => handleProductClick(product.id)}>
                    {product.discount && <div className="sale-badge">Save {product.discount}%</div>}
                    <img src={`https://joshmachpharmacy-e682e263652d.herokuapp.com${product.image_path}`} alt={product.product_name} />
                    <div className="product-info">
                        <span className="category">{product.category}</span>
                        <span className="name">{product.product_name}</span>
                        <div>
                            <span className="price">{formatPrice(product.price)}</span>
                            {product.original_price && <span className="old-price">{formatPrice(product.original_price)}</span>}
                        </div>
                    </div>
                </div>
            ))}
            <ChatBot/>
        </div>
    );
};

export default Products;
