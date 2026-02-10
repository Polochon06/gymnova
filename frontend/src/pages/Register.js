import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        prenom: '',
        nom: '',
        telephone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);

        const result = await register({
            email: formData.email,
            password: formData.password,
            nom: formData.nom,
            prenom: formData.prenom,
            telephone: formData.telephone
        });

        if (result.success) {
            alert('Registration successful! You can now log in.');
            navigate('/login');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="auth-container" style={{ maxWidth: '550px' }}>
            <div className="auth-form">
                <h1>REGISTER</h1>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 'var(--spacing-md)'
                    }}>
                        <div className="form-group">
                            <label className="form-label">First Name *</label>
                            <input
                                type="text"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="John"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Last Name *</label>
                            <input
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                className="form-input"
                                placeholder="Doe"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input
                            type="tel"
                            name="telephone"
                            value={formData.telephone}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="+33 6 12 34 56 78"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password * (min. 6 characters)</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Create a password"
                            required
                            minLength="6"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password *</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="form-input"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ opacity: loading ? 0.6 : 1 }}
                    >
                        {loading ? 'Registering...' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-link">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;