import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDescription.css';

const ProductDescription = () => {
    const { id } = useParams();
    const [sessionId, setSessionId] = useState(null);
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [cartId, setCartId] = useState(localStorage.getItem('cart_id'));
    const [quantity, setQuantity] = useState(1);
    const [email, setEmail] = useState(localStorage.getItem('email') || '');
    const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem('phone_number') || '');

    useEffect(() => {
        const fetchSessionId = async () => {
            try {
                const response = await fetch('https://joshmachpharmacy-e682e263652d.herokuapp.com/api/create-session');
                if (!response.ok) {
                    throw new Error('Failed to fetch session ID');
                }
                const data = await response.json();
                setSessionId(data.session_id);
                console.log("Session ID fetched:", data.session_id);
            } catch (error) {
                console.error('Error fetching session ID:', error);
            }
        };

        fetchSessionId();
    }, []);

    useEffect(() => {
        if (sessionId && !cartId) {
            fetchCartId(sessionId);
        }
        if (sessionId) {
            fetchProductDetails(id);
        }
    }, [id, sessionId, cartId]);

    const createCart = useCallback(async (session_id) => {
        try {
            console.log('Creating cart with session ID:', session_id);
            const response = await fetch('https://joshmachpharmacy-e682e263652d.herokuapp.com/api/carts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ session_id })
            });
            const data = await response.json();
            console.log('Create cart response:', data);
            if (!response.ok) {
                console.error('Error creating cart:', data.message);
                throw new Error('Failed to create cart');
            }
            setCartId(data.id);
            localStorage.setItem('cart_id', data.id);
            console.log(`Cart created with ID: ${data.id}`);
        } catch (error) {
            console.error('Error creating cart:', error);
        }
    }, []);

    const fetchCartId = useCallback(async (session_id) => {
        try {
            console.log('Fetching cart ID with session ID:', session_id);
            const response = await fetch(`https://joshmachpharmacy-e682e263652d.herokuapp.com/api/carts/session/${session_id}`);
            const data = await response.json();
            console.log('Fetch cart ID response:', data);
            if (response.ok && data.length > 0) {
                setCartId(data[0].id);
                localStorage.setItem('cart_id', data[0].id);
                console.log(`Cart ID fetched: ${data[0].id}`);
            } else {
                await createCart(session_id);
            }
        } catch (error) {
            console.error('Error fetching cart ID:', error);
        }
    }, [createCart]);

    const fetchProductDetails = useCallback(async (productId) => {
        try {
            console.log('Fetching product details for product ID:', productId);
            const response = await fetch(`https://joshmachpharmacy-e682e263652d.herokuapp.com/api/products/details?id=${productId}`);
            const data = await response.json();
            console.log('Fetch product details response:', data);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setProduct(data);
            fetchRelatedProducts(data.category, data.id);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    }, []);

    const fetchRelatedProducts = useCallback(async (category, currentProductId) => {
        try {
            console.log('Fetching related products for category:', category);
            const response = await fetch(`https://joshmachpharmacy-e682e263652d.herokuapp.com/api/products/by-category?category=${category}`);
            const data = await response.json();
            console.log('Fetch related products response:', data);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const filteredProducts = data.filter(product => product.id !== currentProductId);
            setRelatedProducts(filteredProducts.slice(0, 3));
        } catch (error) {
            console.error('Error fetching related products:', error);
        }
    }, []);

    const addToCart = async () => {
        if (!cartId || cartId === "0") {
            console.error('Invalid cart ID');
            return;
        }

        try {
            console.log('Adding to cart:', {
                cart_id:cartId,
                product_id: product.id,
                quantity,
                price: product.price,
                email,
                phone_number: phoneNumber,
                attributes: { size: 'M', color: 'red' }
            });
            const response = await fetch('https://joshmachpharmacy-e682e263652d.herokuapp.com/api/cartItems', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cart_id: cartId,
                    product_id: product.id,
                    quantity,
                    price: product.price,
                    email,
                    phone_number: phoneNumber,
                    attributes: JSON.stringify({ size: 'M', color: 'red' })
                })
            });
            
            const data = await response.json();
            console.log('Add to cart response:', data);
            if (!response.ok) {
                console.error('Error adding item to cart:', data.message);
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            alert('Item added to cart');
            fetchCartItemsCount(cartId);
            window.location.reload(); // Reload the page after the alert is closed
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    const fetchCartItemsCount = useCallback(async (cartId) => {
        try {
            console.log('Fetching cart items count for cart ID:', cartId);
            const response = await fetch(`https://joshmachpharmacy-e682e263652d.herokuapp.com/api/cartItems/count?cart_id=${cartId}`);
            const data = await response.json();
            console.log('Fetch cart items count response:', data);
            if (!response.ok) {
                throw new Error('Failed to fetch cart items count');
            }
            if (window.updateCartItemsCount) {
                window.updateCartItemsCount(data.count);
            }
        } catch (error) {
            console.error('Error fetching cart items count:', error);
        }
    }, []);

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="product-description-container">
            <div className="product-details">
                <img src={`https://joshmachpharmacy-e682e263652d.herokuapp.com${product.image_path}`} alt={product.product_name} className="product-image" />
                <div className="product-info">
                    <span className="product-tag">{product.category}</span>
                    <div className="product-pricing">
                        <span className="original-price">{product.original_price}</span>
                        <span className="discounted-price">Ksh{product.price}</span>
                    </div>
                    <p className="product-text">{product.description}</p>
                    <div className="add-to-cart">
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Input Quantity"
                            className="quantity-input"
                        />
                        <button className="add-to-cart-button" onClick={addToCart}>ADD TO CART</button>
                    </div>
                </div>
            </div>
            <div className="related-products">
                <h2>Related Products</h2>
                <p>As you delve deeper into the realm of {product.category} with our featured {product.product_name}, prepare to be tantalized by more marvels from our collection. Each product crafted to perfection, beckoning you to explore their unique allure. Embrace the essence of indulgence and sophistication as you discover these handpicked treasures. Don't resist—embrace the adventure and uncover your next obsession!</p>
                <div className="related-products-list">
                    {relatedProducts.length > 0 ? (
                        relatedProducts.map(relatedProduct => (
                            <div key={relatedProduct.id} className="related-product-item" onClick={() => fetchProductDetails(relatedProduct.id)}>
                                <img src={`https://joshmachpharmacy-e682e263652d.herokuapp.com/${relatedProduct.image_path}`} alt={`Related Product ${relatedProduct.id}`} />
                                <p>{relatedProduct.product_name}</p>
                            </div>
                        ))
                    ) : (
                        <p>No related products found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDescription;
    