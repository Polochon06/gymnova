import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

const Profile = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: ''
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (user) {
            setFormData({
                nom: user.nom || '',
                prenom: user.prenom || '',
                email: user.email || '',
                telephone: user.telephone || ''
            });
        }
    }, [user, isAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await api.put('/auth/profile', formData);
            setMessage('Profile updated successfully!');
            setEditing(false);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="products-container">
            <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>MY PROFILE</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--spacing-xl)'
            }}>
                {/* Profile Info */}
                <div className="page-panel">
                    <h2 className="page-panel-heading">
                        PERSONAL INFORMATION
                    </h2>

                    {message && (
                        <div style={{
                            padding: 'var(--spacing-sm)',
                            marginBottom: 'var(--spacing-md)',
                            background: message.includes('success') ? 'var(--success)' : 'var(--primary)',
                            color: 'white',
                            textAlign: 'center'
                        }}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                                <div>
                                    <label className="form-label">First Name</label>
                                    <input
                                        type="text"
                                        name="prenom"
                                        value={formData.prenom}
                                        onChange={handleChange}
                                        className="form-input"
                                        disabled={!editing}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Last Name</label>
                                    <input
                                        type="text"
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        className="form-input"
                                        disabled={!editing}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-input"
                                    disabled={!editing}
                                />
                            </div>

                            <div>
                                <label className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                    className="form-input"
                                    disabled={!editing}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-sm)' }}>
                                {editing ? (
                                    <>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setEditing(false)}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setEditing(true)}
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Account Info */}
                <div>
                    <div className="page-panel" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <h2 className="page-panel-heading">
                            ACCOUNT STATUS
                        </h2>

                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <div style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '4px' }}>
                                Account Type
                            </div>
                            <span style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                background: user.role === 'admin' ? 'var(--primary)' : 'var(--success)',
                                color: 'white',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                fontSize: '0.85rem'
                            }}>
                                {user.role === 'admin' ? 'Administrator' : 'Customer'}
                            </span>
                        </div>

                        <div>
                            <div style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '4px' }}>
                                Member Since
                            </div>
                            <div style={{ fontWeight: '600' }}>
                                {new Date(user.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="page-panel">
                        <h2 className="page-panel-heading">
                            QUICK LINKS
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                            <a href="/orders" className="quick-link">
                                View My Orders
                            </a>
                            <a href="/cart" className="quick-link">
                                View Cart
                            </a>
                            <a href="/products" className="quick-link">
                                Browse Products
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;