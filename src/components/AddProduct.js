import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css';
import { useNavigate } from 'react-router-dom'; // Use useNavigate hook for navigation

const AddProduct = () => {
    const [product, setProduct] = useState({
        product_name: '',
        price: '',
        stock_quantity: '',
        color: '',
        description: '',
        image: null,
        category: '' // Initialize category state
    });

    const [alert, setAlert] = useState('');
    const navigate = useNavigate(); // Use useNavigate hook for navigation

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleImageChange = (e) => {
        setProduct({ ...product, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', product.image);
        formData.append('product_name', product.product_name);
        formData.append('price', product.price);
        formData.append('stock_quantity', product.stock_quantity);
        formData.append('color', product.color);
        formData.append('description', product.description);
        formData.append('category', product.category); // Append category to formData

        try {
            const uploadResponse = await axios.post('http://https://joshmachpharmacy-e682e263652d.herokuapp.com:4000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const imagePath = uploadResponse.data.imagePath;

            const productData = {
                product_name: product.product_name,
                price: product.price,
                stock_quantity: product.stock_quantity,
                color: product.color,
                description: product.description,
                image_path: imagePath,
                category: product.category // Include category in productData
            };

            const createResponse = await axios.post('http://https://joshmachpharmacy-e682e263652d.herokuapp.com:4000/api/products/add', productData);
            console.log('Product created:', createResponse.data);

            setAlert('Product added successfully');
            setTimeout(() => {
                setAlert('');
                navigate('/'); // Use navigate for redirection
            }, 2000); // Redirect after 2 seconds

        } catch (error) {
            console.error('Error creating product:', error);
            // Handle error as needed (e.g., show error message)
        }
    };

    return (
        <div className="add-product-container">
            <h2>Add New Product</h2>
            {alert && <div className="alert">{alert}</div>}
            <form onSubmit={handleSubmit}>
                <label>
                    Product Name:
                    <input type="text" name="product_name" value={product.product_name} onChange={handleChange} required />
                </label>
                <label>
                    Price:
                    <input type="number" name="price" value={product.price} onChange={handleChange} required />
                </label>
                <label>
                    Stock Quantity:
                    <input type="number" name="stock_quantity" value={product.stock_quantity} onChange={handleChange} required />
                </label>
                <label>
                    Color:
                    <input type="text" name="color" value={product.color} onChange={handleChange} />
                </label>
                <label>
                    Description:
                    <textarea name="description" value={product.description} onChange={handleChange} required />
                </label>
                <label>
                    Category: {/* Input field for category */}
                    <input type="text" name="category" value={product.category} onChange={handleChange} />
                </label>
                <label>
                    Image:
                    <input type="file" accept="image/*" onChange={handleImageChange} required />
                </label>
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;
