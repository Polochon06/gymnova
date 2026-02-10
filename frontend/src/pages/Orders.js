import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'en_attente': '#f39c12',
            'payee': '#3498db',
            'en_preparation': '#9b59b6',
            'expediee': '#2ecc71',
            'livree': '#27ae60',
            'annulee': '#e74c3c'
        };
        return colors[status] || '#95a5a6';
    };

    const getStatusLabel = (status) => {
        const labels = {
            'en_attente': 'Pending',
            'payee': 'Paid',
            'en_preparation': 'Processing',
            'expediee': 'Shipped',
            'livree': 'Delivered',
            'annulee': 'Cancelled'
        };
        return labels[status] || status;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="products-container" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                <h1 style={{ marginBottom: 'var(--spacing-md)' }}>MY ORDERS</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-lg)', color: 'var(--text-light)' }}>
                    You haven't placed any orders yet.
                </p>
                <Link to="/products" className="btn btn-primary">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="products-container">
            <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>MY ORDERS</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {orders.map(order => (
                    <div
                        key={order.id}
                        className="order-card"
                    >
                        {/* Order Header */}
                        <div
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            className={`order-card-header ${expandedOrder === order.id ? 'expanded' : ''}`}
                        >
                            <div>
                                <div style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '4px' }}>
                                    Order Number
                                </div>
                                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: '600' }}>
                                    #{order.id}
                                </div>
                            </div>

                            <div>
                                <div style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '4px' }}>
                                    Date
                                </div>
                                <div>
                                    {formatDate(order.created_at)}
                                </div>
                            </div>

                            <div>
                                <div style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '4px' }}>
                                    Total
                                </div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--primary)' }}>
                                    ${parseFloat(order.total).toFixed(2)}
                                </div>
                            </div>

                            <div>
                                <div style={{ color: 'var(--text-light)', fontSize: '0.85rem', marginBottom: '4px' }}>
                                    Status
                                </div>
                                <span style={{
                                    display: 'inline-block',
                                    padding: '4px 12px',
                                    background: getStatusColor(order.statut),
                                    color: 'white',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    textTransform: 'uppercase'
                                }}>
                                    {getStatusLabel(order.statut)}
                                </span>
                            </div>

                            <div style={{
                                fontSize: '1.5rem',
                                transform: expandedOrder === order.id ? 'rotate(180deg)' : 'rotate(0)',
                                transition: 'transform 0.2s'
                            }}>
                                &#9660;
                            </div>
                        </div>

                        {/* Order Details */}
                        {expandedOrder === order.id && (
                            <div className="order-card-detail">
                                {/* Shipping Address */}
                                {order.adresse_livraison && (
                                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                        <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--spacing-xs)' }}>
                                            Shipping Address
                                        </h4>
                                        <pre style={{
                                            fontFamily: 'var(--font-body)',
                                            margin: 0,
                                            whiteSpace: 'pre-wrap',
                                            color: 'var(--text-light)'
                                        }}>
                                            {order.adresse_livraison}
                                        </pre>
                                    </div>
                                )}

                                {/* Order Items */}
                                <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--spacing-sm)' }}>
                                    Items
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                    {order.items && order.items.map(item => (
                                        <div
                                            key={item.id}
                                            className="order-item-row"
                                        >
                                            <img
                                                src={item.image_url || 'https://placehold.co/80x80?text=Product'}
                                                alt={item.nom}
                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <Link
                                                    to={`/products/${item.product_id}`}
                                                    style={{
                                                        textDecoration: 'none',
                                                        color: 'var(--gold)',
                                                        fontWeight: '600'
                                                    }}
                                                >
                                                    {item.nom}
                                                </Link>
                                                <div style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                                                    Qty: {item.quantite} x ${parseFloat(item.prix_unitaire).toFixed(2)}
                                                </div>
                                            </div>
                                            <div style={{
                                                fontFamily: 'var(--font-display)',
                                                fontSize: '1.2rem'
                                            }}>
                                                ${(item.quantite * item.prix_unitaire).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;