import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Modal, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchManagers, createManager, updateManager, deleteManager } from '../../store/managerSlice';

const ManagerManagement = () => {
    const dispatch = useDispatch();
    const { managers, loading, submitting, error } = useSelector(state => state.manager);
    const { token } = useSelector(state => state.auth);

    const [showModal, setShowModal] = useState(false);
    const [currentManager, setCurrentManager] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'manager'
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [managerToDelete, setManagerToDelete] = useState(null);

    useEffect(() => {
        if (token) {
            dispatch(fetchManagers());
        }
    }, [dispatch, token]);

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
        try {
            if (currentManager) {
                await dispatch(updateManager({ ...formData, id: currentManager.id })).unwrap();
            } else {
                await dispatch(createManager(formData)).unwrap();
            }
            dispatch(fetchManagers());
            handleCloseModal();
        } catch (err) {
            console.error('Submit failed:', err);
        }
    };

    const handleDeleteClick = (id) => {
        setManagerToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await dispatch(deleteManager(managerToDelete)).unwrap();
            setShowDeleteModal(false);
        } catch (err) {
            alert(err || 'Delete failed');
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
                                            onClick={() => handleDeleteClick(m.id)}
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

                {/* Delete Confirmation Modal */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                    <Modal.Header closeButton className="border-0 pb-0">
                        <Modal.Title className="fw-bold">Confirm Delete</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="pt-4">
                        <p>Are you sure you want to delete this manager? This action cannot be undone.</p>
                    </Modal.Body>
                    <Modal.Footer className="border-0 pt-0 pb-4">
                        <Button variant="light" className="px-4 rounded-pill fw-medium" onClick={() => setShowDeleteModal(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" className="px-4 rounded-pill fw-medium shadow-sm" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Card.Body>
        </Card>
    );
};

export default ManagerManagement;
