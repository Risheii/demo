import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Modal, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ManagerManagement = () => {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentManager, setCurrentManager] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'manager'
    });
    const [submitting, setSubmitting] = useState(false);

    const { token } = useSelector(state => state.auth);

    const fetchManagers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/admin/get-all-manager', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setManagers(response.data.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch managers');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchManagers();
        }
    }, [token]);

    const handleOpenModal = (manager = null) => {
        if (manager) {
            setCurrentManager(manager);
            setFormData({
                name: manager.username,
                email: manager.email,
                password: '',
                role: manager.role
            });
        } else {
            setCurrentManager(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'manager'
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setError(null);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (currentManager) {
                // Update
                await axios.put('/api/admin/update-manager', 
                    { ...formData, id: currentManager.id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                // Create
                await axios.post('/api/admin/create-manager', 
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            fetchManagers();
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this manager?')) {
            try {
                await axios.delete(`/api/admin/delete-manager/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchManagers();
            } catch (err) {
                alert(err.response?.data?.message || 'Delete failed');
            }
        }
    };

    if (loading && managers.length === 0) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading managers...</p>
            </div>
        );
    }

    return (
        <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold mb-0">Manager Management</h4>
                    <Button variant="primary" className="rounded-pill px-4 shadow-sm" onClick={() => handleOpenModal()}>
                        <i className="bi bi-plus-lg me-2"></i> Add Manager
                    </Button>
                </div>

                {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

                <div className="table-responsive">
                    <Table hover className="align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="border-0 rounded-start">Name</th>
                                <th className="border-0">Email</th>
                                <th className="border-0">Role</th>
                                <th className="border-0 rounded-end text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {managers.map((m) => (
                                <tr key={m.id}>
                                    <td>
                                        <div className="fw-bold text-dark">{m.username}</div>
                                    </td>
                                    <td className="text-muted">{m.email}</td>
                                    <td>
                                        <Badge bg="info" className="bg-opacity-10 text-info px-3 py-2 rounded-pill">
                                            {m.role}
                                        </Badge>
                                    </td>
                                    <td className="text-end">
                                        <Button 
                                            variant="light" 
                                            size="sm" 
                                            className="me-2 rounded-3"
                                            onClick={() => handleOpenModal(m)}
                                        >
                                            <i className="bi bi-pencil text-primary"></i>
                                        </Button>
                                        <Button 
                                            variant="light" 
                                            size="sm" 
                                            className="rounded-3"
                                            onClick={() => handleDelete(m.id)}
                                        >
                                            <i className="bi bi-trash text-danger"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {managers.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-muted">
                                        No managers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>

                {/* Create/Edit Modal */}
                <Modal show={showModal} onHide={handleCloseModal} centered className="manager-modal">
                    <Modal.Header closeButton className="border-0 pb-0">
                        <Modal.Title className="fw-bold">
                            {currentManager ? 'Edit Manager' : 'Create New Manager'}
                        </Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body className="pt-4">
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Full Name</Form.Label>
                                <Form.Control 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleInputChange} 
                                    placeholder="Enter manager name"
                                    required
                                    className="rounded-3 py-2"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Email Address</Form.Label>
                                <Form.Control 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleInputChange} 
                                    placeholder="manager@example.com"
                                    required
                                    className="rounded-3 py-2"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Password {currentManager && '(Leave blank to keep same)'}</Form.Label>
                                <Form.Control 
                                    type="password" 
                                    name="password" 
                                    value={formData.password} 
                                    onChange={handleInputChange} 
                                    placeholder="••••••••"
                                    required={!currentManager}
                                    className="rounded-3 py-2"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Role</Form.Label>
                                <Form.Select 
                                    name="role" 
                                    value={formData.role} 
                                    onChange={handleInputChange}
                                    className="rounded-3 py-2"
                                >
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </Form.Select>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer className="border-0 pt-0 pb-4">
                            <Button variant="light" className="px-4 rounded-pill fw-medium" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" className="px-4 rounded-pill fw-medium shadow-sm" disabled={submitting}>
                                {submitting ? <Spinner size="sm" /> : currentManager ? 'Save Changes' : 'Create Manager'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            </Card.Body>
        </Card>
    );
};

export default ManagerManagement;
