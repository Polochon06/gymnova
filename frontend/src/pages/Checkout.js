import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

const Checkout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [address, setAddress] = useState({
        nom: '',
        adresse: '',
        code_postal: '',
        ville: '',
        pays: 'France',
        telephone: ''
    });
    const [cardInfo, setCardInfo] = useState({
        number: '',
        expiry: '',
        cvc: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await api.get('/cart');
            if (response.data.items.length === 0) {
                navigate('/cart');
                return;
            }
            setCart(response.data);
        } catch (error) {
            console.error('Error loading cart:', error);
            navigate('/cart');
        } finally {
            setLoading(false);
        }
    };

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleCardChange = (e) => {
        let value = e.target.value;
        const name = e.target.name;

        if (name === 'number') {
            value = value.replace(/\D/g, '').slice(0, 16);
            value = value.replace(/(.{4})/g, '$1 ').trim();
        } else if (name === 'expiry') {
            value = value.replace(/\D/g, '').slice(0, 4);
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
        } else if (name === 'cvc') {
            value = value.replace(/\D/g, '').slice(0, 3);
        }

        setCardInfo({ ...cardInfo, [name]: value });
    };

    const validateForm = () => {
        if (!address.nom || !address.adresse || !address.code_postal || !address.ville) {
            setError('Please fill in all required address fields');
            return false;
        }

        if (paymentMethod === 'card') {
            if (cardInfo.number.replace(/\s/g, '').length !== 16) {
                setError('Please enter a valid card number');
                return false;
            }
            if (!cardInfo.expiry || cardInfo.expiry.length !== 5) {
                setError('Please enter a valid expiry date');
                return false;
            }
            if (!cardInfo.cvc || cardInfo.cvc.length !== 3) {
                setError('Please enter a valid CVC');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setProcessing(true);

        try {
            // Create order
            const addressStr = `${address.nom}\n${address.adresse}\n${address.code_postal} ${address.ville}\n${address.pays}\nTel: ${address.telephone}`;

            const orderResponse = await api.post('/orders', {
                adresse_livraison: addressStr
            });

            // Create payment intent (simulation for demo)
            await api.post('/orders/payment-intent', {
                orderId: orderResponse.data.orderId
            });

            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Confirm payment
            await api.post('/orders/confirm-payment', {
                orderId: orderResponse.data.orderId
            });

            // Redirect to success page
            navigate('/order-success', {
                state: {
                    orderId: orderResponse.data.orderId,
                    total: orderResponse.data.total
                }
            });

        } catch (error) {
            setError(error.response?.data?.message || 'Payment failed. Please try again.');
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="products-container">
            <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>CHECKOUT</h1>

            <form onSubmit={handleSubmit}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.5fr 1fr',
                    gap: 'var(--spacing-xl)'
                }}>
                    {/* Left Column - Forms */}
                    <div>
                        {/* Shipping Address */}
                        <div className="page-panel" style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <h2 className="page-panel-heading">
                                SHIPPING ADDRESS
                            </h2>

                            <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                                <div>
                                    <label className="form-label">Full Name *</label>
                                    <input
                                        type="text"
                                        name="nom"
                                        value={address.nom}
                                        onChange={handleAddressChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="form-label">Address *</label>
                                    <input
                                        type="text"
                                        name="adresse"
                                        value={address.adresse}
                                        onChange={handleAddressChange}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--spacing-md)' }}>
                                    <div>
                                        <label className="form-label">Postal Code *</label>
                                        <input
                                            type="text"
                                            name="code_postal"
                                            value={address.code_postal}
                                            onChange={handleAddressChange}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">City *</label>
                                        <input
                                            type="text"
                                            name="ville"
                                            value={address.ville}
                                            onChange={handleAddressChange}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                    <div>
                                        <label className="form-label">Country</label>
                                        <select
                                            name="pays"
                                            value={address.pays}
                                            onChange={handleAddressChange}
                                            className="form-input"
                                        >
                                            <option value="France">France</option>
                                            <option value="Belgium">Belgium</option>
                                            <option value="Switzerland">Switzerland</option>
                                            <option value="Germany">Germany</option>
                                            <option value="Spain">Spain</option>
                                            <option value="Italy">Italy</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">Phone</label>
                                        <input
                                            type="tel"
                                            name="telephone"
                                            value={address.telephone}
                                            onChange={handleAddressChange}
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="page-panel">
                            <h2 className="page-panel-heading">
                                PAYMENT METHOD
                            </h2>

                            {/* Payment Options */}
                            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        style={{ marginRight: 'var(--spacing-md)' }}
                                    />
                                    <span style={{
                                        fontFamily: 'var(--font-heading)',
                                        flex: 1
                                    }}>
                                        Credit/Debit Card
                                    </span>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <span style={{ background: '#1a1f71', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>VISA</span>
                                        <span style={{ background: '#eb001b', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>MC</span>
                                    </div>
                                </label>

                                <label className={`payment-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="paypal"
                                        checked={paymentMethod === 'paypal'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        style={{ marginRight: 'var(--spacing-md)' }}
                                    />
                                    <span style={{
                                        fontFamily: 'var(--font-heading)',
                                        flex: 1
                                    }}>
                                        PayPal
                                    </span>
                                    <span style={{ background: '#003087', color: 'white', padding: '2px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>PayPal</span>
                                </label>

                                <label className={`payment-option ${paymentMethod === 'bank' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="bank"
                                        checked={paymentMethod === 'bank'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        style={{ marginRight: 'var(--spacing-md)' }}
                                    />
                                    <span style={{
                                        fontFamily: 'var(--font-heading)',
                                        flex: 1
                                    }}>
                                        Bank Transfer
                                    </span>
                                    <span style={{ background: '#2ecc71', color: 'white', padding: '2px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>SEPA</span>
                                </label>
                            </div>

                            {/* Card Details */}
                            {paymentMethod === 'card' && (
                                <div style={{
                                    borderTop: '1px solid var(--dark-border)',
                                    paddingTop: 'var(--spacing-md)'
                                }}>
                                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                        <label className="form-label">Card Number</label>
                                        <input
                                            type="text"
                                            name="number"
                                            value={cardInfo.number}
                                            onChange={handleCardChange}
                                            placeholder="1234 5678 9012 3456"
                                            className="form-input"
                                            style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                        <div>
                                            <label className="form-label">Expiry Date</label>
                                            <input
                                                type="text"
                                                name="expiry"
                                                value={cardInfo.expiry}
                                                onChange={handleCardChange}
                                                placeholder="MM/YY"
                                                className="form-input"
                                                style={{ fontFamily: 'monospace' }}
                                            />
                                        </div>
                                        <div>
                                            <label className="form-label">CVC</label>
                                            <input
                                                type="text"
                                                name="cvc"
                                                value={cardInfo.cvc}
                                                onChange={handleCardChange}
                                                placeholder="123"
                                                className="form-input"
                                                style={{ fontFamily: 'monospace' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PayPal Message */}
                            {paymentMethod === 'paypal' && (
                                <div style={{
                                    borderTop: '1px solid var(--dark-border)',
                                    paddingTop: 'var(--spacing-md)',
                                    textAlign: 'center',
                                    color: 'var(--text-light)'
                                }}>
                                    <p>You will be redirected to PayPal to complete your payment.</p>
                                </div>
                            )}

                            {/* Bank Transfer Message */}
                            {paymentMethod === 'bank' && (
                                <div style={{
                                    borderTop: '1px solid var(--dark-border)',
                                    paddingTop: 'var(--spacing-md)',
                                    color: 'var(--text-light)'
                                }}>
                                    <p>Bank transfer details will be sent to your email after order confirmation.</p>
                                    <p style={{ marginTop: 'var(--spacing-sm)', fontSize: '0.9rem' }}>
                                        <strong>IBAN:</strong> FR76 1234 5678 9012 3456 7890 123
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div>
                        <div className="page-panel" style={{ position: 'sticky', top: 'calc(var(--spacing-md) + 70px)' }}>
                            <h2 className="page-panel-heading">
                                ORDER SUMMARY
                            </h2>

                            {/* Items */}
                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                {cart.items.map(item => (
                                    <div key={item.id} style={{
                                        display: 'flex',
                                        gap: 'var(--spacing-sm)',
                                        marginBottom: 'var(--spacing-sm)',
                                        paddingBottom: 'var(--spacing-sm)',
                                        borderBottom: '1px solid var(--dark-border)'
                                    }}>
                                        <img
                                            src={item.image_url || 'https://placehold.co/60x60?text=Product'}
                                            alt={item.nom}
                                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{item.nom}</div>
                                            <div style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                                                Qty: {item.quantite}
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: '600' }}>
                                            ${(item.prix * item.quantite).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div style={{ borderTop: '1px solid var(--dark-border)', paddingTop: 'var(--spacing-md)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xs)' }}>
                                    <span>Subtotal:</span>
                                    <span>${cart.total.toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xs)', color: 'var(--text-light)' }}>
                                    <span>Shipping:</span>
                                    <span>Free</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-xs)', color: 'var(--text-light)' }}>
                                    <span>Tax (20% VAT):</span>
                                    <span>${(cart.total * 0.2).toFixed(2)}</span>
                                </div>
                            </div>

                            <div style={{
                                borderTop: '2px solid var(--gold)',
                                paddingTop: 'var(--spacing-md)',
                                marginTop: 'var(--spacing-md)',
                                marginBottom: 'var(--spacing-lg)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem' }}>TOTAL:</span>
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--primary)' }}>
                                        ${(cart.total * 1.2).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div style={{
                                    background: 'var(--primary)',
                                    color: 'white',
                                    padding: 'var(--spacing-sm)',
                                    marginBottom: 'var(--spacing-md)',
                                    textAlign: 'center'
                                }}>
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={processing}
                                style={{
                                    width: '100%',
                                    fontSize: '1.1rem',
                                    opacity: processing ? 0.7 : 1
                                }}
                            >
                                {processing ? 'Processing...' : `Pay $${(cart.total * 1.2).toFixed(2)}`}
                            </button>

                            {/* Security Badge */}
                            <div style={{
                                marginTop: 'var(--spacing-md)',
                                textAlign: 'center',
                                color: 'var(--text-light)',
                                fontSize: '0.85rem'
                            }}>
                                <span style={{ color: 'var(--success)' }}>&#128274;</span> Secure payment with SSL encryption
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;