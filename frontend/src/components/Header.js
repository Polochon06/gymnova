import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCartCount();
        }
    }, [isAuthenticated]);

    const fetchCartCount = async () => {
        try {
            const response = await api.get('/cart');
            setCartCount(response.data.items.length);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo">
                    GYMNOVA
                </Link>

                <nav className="nav">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/products" className="nav-link">Products</Link>
                    <Link to="/athletes" className="nav-link">Athletes</Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/cart" className="nav-link" style={{ position: 'relative' }}>
                                Cart
                                {cartCount > 0 && (
                                    <span className="cart-badge">{cartCount}</span>
                                )}
                            </Link>
                            <Link to="/orders" className="nav-link">Orders</Link>
                            <Link to="/profile" className="nav-link">
                                {user?.prenom || 'Profile'}
                            </Link>
                            <button
                                onClick={logout}
                                className="nav-link"
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link">Register</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;