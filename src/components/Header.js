import React, { useState, useEffect, useCallback } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Badge from '@mui/material/Badge';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';
import { useMediaQuery, useTheme, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import './Header.css';

const Header = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [sessionId, setSessionId] = useState(localStorage.getItem('session_id'));
    const [cartId, setCartId] = useState(localStorage.getItem('cart_id'));
    const [email, setEmail] = useState(localStorage.getItem('email'));
    const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem('phone_number'));
    const [popupOpen, setPopupOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const fetchSessionInfo = useCallback(async () => {
        try {
            const response = await fetch('https://joshmachpharmacy-e682e263652d.herokuapp.com/api/create-session');
            if (!response.ok) {
                throw new Error('Failed to fetch session information');
            }
            const data = await response.json();
            localStorage.setItem('session_id', data.session_id);
            setSessionId(data.session_id);
        } catch (error) {
            console.error('Error fetching session information:', error);
        }
    }, []);

    const fetchProductDetails = async (productId) => {
        try {
            const response = await fetch(`https://joshmachpharmacy-e682e263652d.herokuapp.com/api/products/details?id=${productId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }
            return response.json();
        } catch (error) {
            console.error('Error fetching product details:', error);
            return null;
        }
    };

    const fetchCartItemsByEmail = useCallback(async (email) => {
        try {
            const order_status = 'pending'; // Set order status to 'pending'
            const response = await fetch(`https://joshmachpharmacy-e682e263652d.herokuapp.com/api/cartItems/email/${email}/status/${order_status}`);
            if (!response.ok) {
                throw new Error('Failed to fetch cart items by email');
            }
            const data = await response.json();
            const detailedItems = await Promise.all(
                data.map(async (item) => {
                    const productDetails = await fetchProductDetails(item.product_id);
                    return {
                        ...item,
                        image_path: productDetails ? productDetails.image_path : '',
                        product_name: productDetails ? productDetails.product_name : item.name,
                    };
                })
            );
            setCartItems(detailedItems);
        } catch (error) {
            console.error('Error fetching cart items by email:', error);
        }
    }, []);

    const fetchCartItemsById = useCallback(async (cartId) => {
        try {
            const response = await fetch(`https://joshmachpharmacy-e682e263652d.herokuapp.com/api/cartItems/${cartId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch cart items by ID');
            }
            const data = await response.json();
            const detailedItems = await Promise.all(
                data.map(async (item) => {
                    const productDetails = await fetchProductDetails(item.product_id);
                    return {
                        ...item,
                        image_path: productDetails ? productDetails.image_path : '',
                        product_name: productDetails ? productDetails.product_name : item.name,
                    };
                })
            );
            setCartItems(detailedItems);
        } catch (error) {
            console.error('Error fetching cart items by ID:', error);
        }
    }, []);

    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const toggleCartDropdown = () => {
        setCartDropdownOpen(!cartDropdownOpen);
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handleOrderNow = async () => {
        try {
            const orderDetails = cartItems.map(item => `${item.product_name} (x${item.quantity}) - Ksh${item.price}`).join('\n');
            const totalAmount = calculateTotal();
            const emailData = {
                to: email,
                subject: 'Your Order Details',
                body: `Your Order For the following items have been received:\n\n${orderDetails}\n\n we'll process it and give you a :\n\nYour contact details:\nEmail: ${email}\nPhone Number: ${phoneNumber}\: \n\n Total Ksh${totalAmount}\n\nThank you for shopping with us!`
            };

            const response = await fetch('https://joshmachpharmacy-e682e263652d.herokuapp.com/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData),
            });

            if (!response.ok) {
                throw new Error('Failed to send email');
            }
            const statusUpdatePromises = cartItems.map(item => {
                return fetch(`https://joshmachpharmacy-e682e263652d.herokuapp.com/api/cartItems/update-status/id/${item.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ order_status: 'ordered' }),
                }).then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to update status for item ${item.id}`);
                    }
                });
            });

            await Promise.all(statusUpdatePromises);

            alert('Order placed successfully');

        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    const handlePopupClose = () => {
        setPopupOpen(false);
    };

    const handlePopupSubmit = () => {
        localStorage.setItem('email', email);
        localStorage.setItem('phone_number', phoneNumber);
        setPopupOpen(false);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    useEffect(() => {
        if (!sessionId) {
            fetchSessionInfo();
        } else {
            if (email) {
                fetchCartItemsByEmail(email);
            } else if (cartId) {
                fetchCartItemsById(cartId);
            }
        }

        if (!email || !phoneNumber) {
            setPopupOpen(true);
        }
    }, [sessionId, cartId, email, phoneNumber, fetchSessionInfo, fetchCartItemsByEmail, fetchCartItemsById]);

    const cartDropdown = (
        <Box className="cartDropdown">
            <Typography variant="h6" gutterBottom>
                Shopping Cart
            </Typography>
            <List>
                {cartItems.map((item) => (
                    <ListItem key={item.id} className="cartItem">
                        <img src={`https://joshmachpharmacy-e682e263652d.herokuapp.com${item.image_path}`} alt={item.product_name} className="cartItemImage" />
                        <ListItemText
                            primary={<span className="cartItemText">{item.product_name}</span>}
                            secondary={`Quantity: ${item.quantity} | KSH ${item.price}`}
                        />
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCartItem(item.id)}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
            <Typography variant="subtitle1">
                <span className="cartItemText">Grand Total: Ksh{calculateTotal()}</span>
            </Typography>
            <Box className="orderNowButton">
                <Button variant="contained" className="whatsappButton" onClick={handleOrderNow}>
                    Order Now <WhatsAppIcon sx={{ ml: 1 }} />
                </Button>
            </Box>
        </Box>
    );
    const handleDeleteCartItem = async (itemId) => {
        try {
            const response = await fetch(`https://joshmachpharmacy-e682e263652d.herokuapp.com/api/cartItems/${itemId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete cart item');
            }
            setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        } catch (error) {
            console.error('Error deleting cart item:', error);
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" className="header">
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box className="logoTitle">
                        {isMobile && (
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={toggleDrawer(true)}
                                sx={{ mr: 2 }}
                            >
                                <MenuIcon />
                            </IconButton>
                            
                        )}
                         <Typography variant="h6" sx={{ flexGrow: 1, textAlign: isMobile ? 'center' : 'left' }}>
                    <RouterLink to="/">
                    <img src={require('../component_photos/logo.jpg')}  alt="Logo" className="logo" />
                    </RouterLink>
                </Typography>
                <Drawer
    anchor="left"
    open={drawerOpen}
    onClose={toggleDrawer(false)}
    sx={{
        '& .MuiDrawer-paper': {
            background: 'linear-gradient(90deg, #e0eafc, #cfdef3)',
            color: '#333333',
        },
    }}
>
    <Box sx={{ width: 250, height: '100%', overflowY: 'auto' }}  role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
    <IconButton
            edge="start"
            color="inherit"
            aria-label="close"
            onClick={toggleDrawer(false)}
            sx={{
                position: 'absolute',
                top: 10,
                right: 10,
            }}
        >
            <CloseIcon />
        </IconButton>
        <List>
            <ListItem button component={RouterLink} to="/">
                <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={RouterLink} to="/aboutus">
                <ListItemText primary="About Us" />
            </ListItem>
            <ListItem button component={RouterLink} to="/help">
                <ListItemText primary="Help" />
            </ListItem>
            <ListItem button component={RouterLink} to="/myorders">
                <ListItemText primary="My Orders" />
            </ListItem>
           
        </List>
        <Box sx={{ position: 'absolute', bottom: 0, width: '100%', display: 'flex', justifyContent: 'space-evenly', padding: '10px 0' }}>
            <IconButton href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                <FacebookIcon />
            </IconButton>
            <IconButton href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer">
                <TwitterIcon />
            </IconButton>
            <IconButton href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                <InstagramIcon />
            </IconButton>
        </Box>
        
    </Box>
</Drawer>

<Typography variant="h6" className="title">
JoshMachPharmacy
</Typography>

</Box>
{isMobile && (
<IconButton
color="inherit"
className="iconButton"
sx={{ ml: 1 }}
onClick={toggleCartDropdown}
aria-controls="cart-menu"
aria-haspopup="true"
>   
<Badge badgeContent={cartItems.length} color="secondary">
<ShoppingCartIcon />
{cartDropdownOpen && cartDropdown}
</Badge>
</IconButton>)}
{!isMobile && (
<Box className="desktopLinks">
<RouterLink to="/" className="navLink">
Home
</RouterLink>
<RouterLink to="/aboutus" className="navLink">
About Us
</RouterLink>
<RouterLink to="/help" className="navLink">
Help
</RouterLink>
<RouterLink to="/myorders" className="navLink">
    My Orders
</RouterLink>
<Box className="iconContainer">
<IconButton color="inherit" className="iconButton">
<FacebookIcon />
</IconButton>
<IconButton color="inherit" className="iconButton">
<TwitterIcon />
</IconButton>
<IconButton color="inherit" className="iconButton">
<InstagramIcon />
</IconButton>
<IconButton
color="inherit"
className="iconButton"
sx={{ ml: 1 }}
onClick={toggleCartDropdown}
aria-controls="cart-menu"
aria-haspopup="true"
>
    
<Badge badgeContent={cartItems.length} color="secondary">
<ShoppingCartIcon />
</Badge>
</IconButton>
{cartDropdownOpen && cartDropdown}
</Box>
</Box>
)}

</Toolbar>
</AppBar>
<Dialog open={popupOpen} onClose={handlePopupClose}>
<DialogTitle>Enter Your Details</DialogTitle>
<DialogContent>
<TextField
                     autoFocus
                     margin="dense"
                     label="Email"
                     type="email"
                     fullWidth
                     variant="standard"
                     value={email}
                     onChange={handleEmailChange}
                 />
<TextField
                     margin="dense"
                     label="Phone Number"
                     type="tel"
                     fullWidth
                     variant="standard"
                     value={phoneNumber}
                     onChange={handlePhoneNumberChange}
                 />
</DialogContent>
<DialogActions>
<Button onClick={handlePopupClose}>Cancel</Button>
<Button onClick={handlePopupSubmit}>Submit</Button>
</DialogActions>
</Dialog>
</Box>
);
};

export default Header;