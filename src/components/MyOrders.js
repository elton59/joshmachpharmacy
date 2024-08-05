import React, { useState, useEffect } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography
} from '@mui/material';
import './MyOrders.css';

const MyOrders = () => {
    const [processingOrders, setProcessingOrders] = useState([]);
    const [orderHistory, setOrderHistory] = useState([]);
    const email = localStorage.getItem('email');
    const phoneNumber = localStorage.getItem('phone_number');

    const fetchOrders = async () => {
        try {
            const responseProcessing = await fetch(`http://https://joshmachpharmacy-e682e263652d.herokuapp.com:4000/api/cartItems/email/${email}/status/processing`);
            const responseOrdered = await fetch(`http://https://joshmachpharmacy-e682e263652d.herokuapp.com:4000/api/cartItems/email/${email}/status/ordered`);

            if (!responseProcessing.ok || !responseOrdered.ok) {
                throw new Error('Failed to fetch orders');
            }

            const processingData = await responseProcessing.json();
            const orderedData = await responseOrdered.json();

            setProcessingOrders(processingData);
            setOrderHistory(orderedData);
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

            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <Box className="myOrdersContainer">
            {/* <Typography variant="h4" className="title">My Orders</Typography> */}

            <Box className="ordersSection">
                <Typography variant="h6" className="sectionTitle">Pending Orders</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {processingOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.product_name}</TableCell>
                                    <TableCell>{order.quantity}</TableCell>
                                    <TableCell>{order.price}</TableCell>
                                    <TableCell>{(order.price * order.quantity).toFixed(2)}</TableCell>
                                    <TableCell>{order.order_status}</TableCell>
                                    <TableCell>
                                        {email === 'joshmachadmin2024' && phoneNumber === '0741225424' && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleCompleteOrder(order.id)}
                                            >
                                                Complete
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box className="ordersSection">
                <Typography variant="h6" className="sectionTitle">Order History</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderHistory.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.product_name}</TableCell>
                                    <TableCell>{order.quantity}</TableCell>
                                    <TableCell>{order.price}</TableCell>
                                    <TableCell>{(order.price * order.quantity).toFixed(2)}</TableCell>
                                    <TableCell>{order.order_status}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default MyOrders;
