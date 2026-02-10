import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                api.get('/products?limit=6'),
                api.get('/categories')
            ]);

            const products = productsRes.data.products || productsRes.data;
            setFeaturedProducts(Array.isArray(products) ? products.slice(0, 6) : []);
            setCategories(categoriesRes.data || []);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
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
        <div>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-video-wrapper">
                    <iframe
                        src="https://www.youtube.com/embed/jqP1koB603k?autoplay=1&mute=1&loop=1&playlist=jqP1koB603k&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3"
                        title="Background video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="hero-video"
                    ></iframe>
                </div>
                <div className="hero-content">
                    <h1>EQUIP YOUR <span>PASSION</span></h1>
                    <p>Professional gymnastics equipment for demanding athletes</p>
                    <Link to="/products" className="btn btn-primary">
                        Discover the Collection
                    </Link>
                </div>
            </section>

            {/* Categories */}
            <section className="products-container">
                <h2 className="section-title">Categories</h2>
                <div className="categories-grid">
                    {categories.map(category => (
                        <Link
                            key={category.id}
                            to={`/products?category=${category.id}`}
                            className="category-chip"
                        >
                            {category.nom}
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="products-container">
                <h2 className="section-title">Popular Products</h2>
                <div className="products-grid">
                    {featuredProducts.map(product => (
                        <Link
                            key={product.id}
                            to={`/products/${product.id}`}
                            style={{ textDecoration: 'none' }}
                        >
                            <div className="product-card">
                                <div className="product-image-wrapper">
                                    <img
                                        src={product.image_url || 'https://placehold.co/400x300/1D3557/ffffff?text=Gymnova'}
                                        alt={product.nom}
                                        className="product-image"
                                    />
                                    <div className="product-image-overlay"></div>
                                </div>
                                <div className="product-info">
                                    <div className="product-category">{product.categorie_nom}</div>
                                    <h3 className="product-title">{product.nom}</h3>
                                    <div className="product-price">{product.prix} &euro;</div>
                                    <button className="btn btn-secondary" style={{ width: '100%', marginTop: '8px' }}>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
                    <Link to="/products" className="btn btn-primary">
                        View All Products
                    </Link>
                </div>
            </section>

            {/* Benefits */}
            <section className="products-container" style={{ textAlign: 'center' }}>
                <h2 className="section-title">Why Gymnova?</h2>
                <div className="benefits-grid">
                    <div className="benefit-card">
                        <span className="benefit-icon">&#127942;</span>
                        <h3>PRO QUALITY</h3>
                        <p>FIG certified equipment meeting international standards</p>
                    </div>
                    <div className="benefit-card">
                        <span className="benefit-icon">&#128666;</span>
                        <h3>FAST SHIPPING</h3>
                        <p>Worldwide shipping within 48 hours</p>
                    </div>
                    <div className="benefit-card">
                        <span className="benefit-icon">&#128737;&#65039;</span>
                        <h3>2-YEAR WARRANTY</h3>
                        <p>All our products come with a 2-year warranty</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;