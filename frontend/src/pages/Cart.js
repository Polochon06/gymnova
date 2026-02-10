import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';

const Cart = () => {
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await api.get('/cart');
            setCart(response.data);
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        try {
            await api.put(`/cart/${productId}`, { quantite: newQuantity });
            fetchCart();
        } catch (error) {
            alert(error.response?.data?.message || 'Error updating quantity');
        }
    };

    const removeItem = async (productId) => {
        try {
            await api.delete(`/cart/${productId}`);
            fetchCart();
        } catch (error) {
            alert('Error removing item');
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (cart.items.length === 0) {
        return (
            <div className="products-container" style={{ textAlign: 'center', padding: 'var(--spacing-2xl) 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>&#128722;</div>
                <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>YOUR CART</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-lg)' }}>
                    Your cart is empty
                </p>
                <Link to="/products" className="btn btn-primary">
                    Discover Our Products
                </Link>
            </div>
        );
    }

    return (
        <div className="products-container">
            <h1 className="section-title" style={{ marginTop: 'var(--spacing-md)' }}>YOUR CART</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: 'var(--spacing-lg)'
            }}>
                {/* Items List */}
                <div>
                    {cart.items.map(item => (
                        <div key={item.id} className="cart-item">
                            <img
                                src={item.image_url || 'https://placehold.co/120x120/1D3557/ffffff?text=Gymnova'}
                                alt={item.nom}
                                className="cart-item-image"
                            />

                            <div style={{ flex: 1 }}>
                                <Link
                                    to={`/products/${item.product_id}`}
                                    style={{ textDecoration: 'none', color: 'var(--gold)' }}
                                >
                                    <h3 style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '1.3rem',
                                        marginBottom: '6px',
                                        textTransform: 'none'
                                    }}>
                                        {item.nom}
                                    </h3>
                                </Link>

                                <div style={{
                                    color: 'var(--primary)',
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '1.5rem',
                                    marginBottom: 'var(--spacing-sm)'
                                }}>
                                    {item.prix} &euro;
                                </div>

                                <div className="quantity-selector">
                                    <label style={{
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '0.85rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        Qty:
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max={item.stock}
                                        value={item.quantite}
                                        onChange={(e) => updateQuantity(item.product_id, parseInt(e.target.value))}
                                        className="quantity-input"
                                        style={{ width: '70px' }}
                                    />
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        ({item.stock} available)
                                    </span>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'flex-end'
                            }}>
                                <div style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '2rem',
                                    color: 'var(--gold)'
                                }}>
                                    {(item.prix * item.quantite).toFixed(2)} &euro;
                                </div>

                                <button
                                    onClick={() => removeItem(item.product_id)}
                                    style={{
                                        background: 'var(--primary-light)',
                                        border: 'none',
                                        color: 'var(--primary)',
                                        cursor: 'pointer',
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '0.85rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        padding: '6px 14px',
                                        borderRadius: 'var(--radius-sm)',
                                        transition: 'var(--transition)'
                                    }}
                                    onMouseEnter={e => { e.target.style.background = 'var(--primary)'; e.target.style.color = 'white'; }}
                                    onMouseLeave={e => { e.target.style.background = 'var(--primary-light)'; e.target.style.color = 'var(--primary)'; }}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="summary-card">
                    <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        marginBottom: 'var(--spacing-md)',
                        fontSize: '1.8rem'
                    }}>
                        SUMMARY
                    </h2>

                    <div style={{
                        borderTop: '1px solid var(--dark-border)',
                        paddingTop: 'var(--spacing-md)',
                        marginBottom: 'var(--spacing-md)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: 'var(--spacing-sm)',
                            fontSize: '1.1rem'
                        }}>
                            <span>Subtotal:</span>
                            <span>{cart.total.toFixed(2)} &euro;</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: 'var(--spacing-md)',
                            fontSize: '1rem',
                            color: 'var(--text-muted)'
                        }}>
                            <span>Shipping:</span>
                            <span>Calculated at checkout</span>
                        </div>
                    </div>

                    <div style={{
                        borderTop: '2px solid var(--gold)',
                        paddingTop: 'var(--spacing-md)',
                        marginBottom: 'var(--spacing-lg)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.3rem'
                            }}>
                                TOTAL:
                            </span>
                            <span style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '2.5rem',
                                color: 'var(--primary)'
                            }}>
                                {cart.total.toFixed(2)} &euro;
                            </span>
                        </div>
                    </div>

                    <Link
                        to="/checkout"
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            fontSize: '1.1rem',
                            padding: '16px'
                        }}
                    >
                        Proceed to Checkout
                    </Link>

                    <Link
                        to="/products"
                        style={{
                            display: 'block',
                            textAlign: 'center',
                            marginTop: 'var(--spacing-md)',
                            color: 'var(--gold)',
                            textDecoration: 'none',
                            fontFamily: 'var(--font-heading)',
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;