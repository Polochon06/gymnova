import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error loading product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            await api.post('/cart', {
                product_id: product.id,
                quantite: quantity
            });
            setMessage('success');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('error');
            setTimeout(() => setMessage(''), 3000);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="products-container" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                <h2>Product not found</h2>
                <Link to="/products" className="btn btn-primary" style={{ marginTop: 'var(--spacing-md)', display: 'inline-block' }}>
                    Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="products-container">
            {/* Breadcrumb */}
            <div style={{
                marginBottom: 'var(--spacing-md)',
                marginTop: 'var(--spacing-sm)',
                fontSize: '0.9rem',
                color: 'var(--text-muted)'
            }}>
                <Link to="/products" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Products</Link>
                <span style={{ margin: '0 8px' }}>/</span>
                <span>{product.nom}</span>
            </div>

            <div className="product-detail">
                {/* Product Image */}
                <div>
                    <img
                        src={product.image_url || 'https://placehold.co/600x600/1D3557/ffffff?text=Gymnova'}
                        alt={product.nom}
                        className="product-detail-image"
                    />
                </div>

                {/* Product Info */}
                <div className="product-detail-info">
                    <div className="product-category" style={{ fontSize: '0.9rem' }}>
                        {product.categorie_nom}
                    </div>

                    <h1 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                        textTransform: 'none',
                        lineHeight: '1.2'
                    }}>
                        {product.nom}
                    </h1>

                    <div className="product-detail-price">
                        {product.prix} &euro;
                    </div>

                    {/* Stock */}
                    {product.stock > 0 ? (
                        <span className="product-stock in-stock" style={{ alignSelf: 'flex-start' }}>
                            In Stock ({product.stock} available)
                        </span>
                    ) : (
                        <span className="product-stock out-of-stock" style={{ alignSelf: 'flex-start' }}>
                            Out of Stock
                        </span>
                    )}

                    {/* Description */}
                    <p className="product-detail-description">
                        {product.description}
                    </p>

                    {/* Quantity + Add to Cart */}
                    {product.stock > 0 && (
                        <div style={{ marginTop: 'var(--spacing-sm)' }}>
                            <div className="quantity-selector" style={{ marginBottom: 'var(--spacing-md)' }}>
                                <label className="form-label" style={{ margin: 0 }}>Quantity:</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.stock}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                    className="quantity-input"
                                />
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="btn btn-primary"
                                style={{
                                    width: '100%',
                                    fontSize: '1.2rem',
                                    padding: '18px'
                                }}
                            >
                                Add to Cart
                            </button>
                        </div>
                    )}

                    {/* Confirmation Message */}
                    {message && (
                        <div className={message === 'success' ? 'message-success' : 'message-error'}
                            style={{ marginTop: 'var(--spacing-md)' }}>
                            {message === 'success' ? 'Product added to cart!' : 'Error adding to cart'}
                        </div>
                    )}

                    {/* Features */}
                    <div style={{
                        marginTop: 'var(--spacing-lg)',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 'var(--spacing-sm)'
                    }}>
                        <div className="feature-badge">
                            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>&#128666;</div>
                            <div className="feature-badge-label">Free Shipping</div>
                        </div>
                        <div className="feature-badge">
                            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>&#128737;&#65039;</div>
                            <div className="feature-badge-label">2-Year Warranty</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;