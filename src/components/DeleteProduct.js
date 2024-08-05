import React, { useState, useEffect } from 'react';
import './DeleteProduct.css'; 

const DeleteProduct = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://https://joshmachpharmacy-e682e263652d.herokuapp.com:4000/api/products/all');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://https://joshmachpharmacy-e682e263652d.herokuapp.com:4000/api/products/delete/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Update state after successful deletion
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            // Handle error as needed
        }
    };

    return (
        <div className="delete-product-container"> {/* Specific class for DeleteProduct styling */}
            <h2>Delete Products</h2>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.product_name}</td>
                            <td>{product.category}</td>
                            <td>{product.price}</td>
                            <td>
                                <button onClick={() => handleDelete(product.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DeleteProduct;
