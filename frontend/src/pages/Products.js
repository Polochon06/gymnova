import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../config/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedCategory = searchParams.get('category') || '';
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, searchQuery]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data || []);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCategory) params.append('category', selectedCategory);
            if (searchQuery) params.append('search', searchQuery);

            const response = await api.get(`/products?${params.toString()}`);
            const data = response.data.products || response.data;
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (filterType, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(filterType, value);
        } else {
            params.delete(filterType);
        }
        setSearchParams(params);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const search = formData.get('search');
        handleFilterChange('search', search);
    };

    return (
        <div className="products-container">
            <h1 className="section-title" style={{ marginTop: 'var(--spacing-md)' }}>
                Our Catalog
            </h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="search-bar">
                <input
                    type="text"
                    name="search"
                    placeholder="Search for a product..."
                    defaultValue={searchQuery}
                    className="search-input"
                />
                <button type="submit" className="btn btn-primary">
                    Search
                </button>
            </form>

            {/* Category Filters */}
            <div>
                <div className="filters" style={{ justifyContent: 'center' }}>
                    <button
                        onClick={() => handleFilterChange('category', '')}
                        className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
                    >
                        All
                    </button>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => handleFilterChange('category', category.id)}
                            className={`filter-btn ${selectedCategory === String(category.id) ? 'active' : ''}`}
                        >
                            {category.nom}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="loading">
                    <div className="spinner"></div>
                </div>
            ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    <p style={{ fontSize: '1.2rem' }}>No products found.</p>
                </div>
            ) : (
                <div className="products-grid">
                    {products.map(product => (
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
                                    {product.stock > 0 ? (
                                        <span className="product-stock in-stock">
                                            In Stock ({product.stock})
                                        </span>
                                    ) : (
                                        <span className="product-stock out-of-stock">
                                            Out of Stock
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;