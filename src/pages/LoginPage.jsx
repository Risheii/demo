import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token, user } = useSelector(state => state.auth);

    useEffect(() => {
        if (token && user) {
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (user.role === 'manager') {
                navigate('/manager/dashboard');
            } else {
                navigate('/');
            }
        }
    }, [token, user, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className='h-100 w-100 d-flex justify-content-center align-items-center' style={{ minHeight: '80vh', background: 'linear-gradient(135deg, #667eea22, #764ba222)' }}>
            <Container className='d-flex justify-content-center'>
                <Card className='p-4 border-0 shadow-lg rounded-4' style={{ width: '400px' }}>
                    <Card.Title className='text-center fs-2 fw-bold text-secondary mb-4'>Login</Card.Title>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label className='fw-semibold'>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className='fw-semibold'>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className='w-100' disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form>
                </Card>
            </Container>
        </div>
    );
};

export default LoginPage;
