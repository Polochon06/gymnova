import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
    const location = useLocation();
    const { orderId, total } = location.state || {};

    return (
        <div className="products-container" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <div className="success-container">
                <div className="success-icon">
                    &#10003;
                </div>

                <h1 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '2.5rem',
                    marginBottom: 'var(--spacing-md)',
                    color: 'var(--gold)'
                }}>
                    ORDER CONFIRMED!
                </h1>

                <p style={{
                    fontSize: '1.2rem',
                    color: 'var(--text-light)',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    Thank you for your purchase. Your order has been successfully placed.
                </p>

                {orderId && (
                    <div className="info-highlight" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <p style={{ marginBottom: 'var(--spacing-xs)' }}>
                            <strong>Order Number:</strong> #{orderId}
                        </p>
                        {total && (
                            <p style={{ fontSize: '1.5rem', color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
                                Total: ${total.toFixed(2)}
                            </p>
                        )}
                    </div>
                )}

                <p style={{
                    color: 'var(--text-light)',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    A confirmation email has been sent to your email address.
                    You can track your order status in your account.
                </p>

                <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
                    <Link to="/orders" className="btn btn-primary">
                        View My Orders
                    </Link>
                    <Link to="/products" className="btn btn-secondary">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;