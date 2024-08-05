import React, { useEffect, useState } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import './AdminOrders.css';

const AdminOrders = () => {
    const [processingOrders, setProcessingOrders] = useState([]);
    const [orderedOrders, setOrderedOrders] = useState([]);
    const email = localStorage.getItem('email');
    const phoneNumber = localStorage.getItem('phone_number');

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://https://joshmachpharmacy-e682e263652d.herokuapp.com:4000/api/cartitems');
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await response.json();
            const processing = data.filter(order => order.order_status === 'processing');
            const ordered = data.filter(order => order.order_status === 'ordered');
            setProcessingOrders(processing);
            setOrderedOrders(ordered);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleCompleteOrder = async (orderId) => {
        try {
            const response = await fetch(`http://https://joshmachpharmacy-e682e263652d.herokuapp.com:4000/api/cartItems/update-status/id/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ order_status: 'ordered' }),
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            // Update the order status locally
            setProcessingOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
            setOrderedOrders(prevOrders => [
                ...prevOrders,
                ...processingOrders.filter(order => order.id === orderId).map(order => ({ ...order, order_status: 'ordered' }))
            ]);
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <Box className="myOrders">
            <Typography variant="h4" gutterBottom>
                My Orders
            </Typography>
            <Box className="orderTable">
                <Typography variant="h5" gutterBottom>
                    Orders Being Processed
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product ID</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {processingOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.product_id}</TableCell>
                                <TableCell>{order.quantity}</TableCell>
                                <TableCell>{order.price}</TableCell>
                                <TableCell>{order.email}</TableCell>
                                <TableCell>{order.phone_number}</TableCell>
                                <TableCell>
                                    {(email === 'joshmachadmin2024' && phoneNumber === '0741225424') && (
                                        <Button variant="contained" color="primary" onClick={() => handleCompleteOrder(order.id)}>
                                            Complete
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
            <Box className="orderTable">
                <Typography variant="h5" gutterBottom>
                    Order History
                </Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product ID</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone Number</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderedOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.product_id}</TableCell>
                                <TableCell>{order.quantity}</TableCell>
                                <TableCell>{order.price}</TableCell>
                                <TableCell>{order.email}</TableCell>
                                <TableCell>{order.phone_number}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
};

export default AdminOrders;
