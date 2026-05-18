import React, { useEffect, useState } from 'react';
import { Container, Table, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ManagerDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/manager/getusers', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch users');
                setLoading(false);
            }
        };

        if (token) {
            fetchUsers();
        }
    }, [token]);

    return (
        <div className="manager-dashboard py-5 bg-light min-vh-100">
            <Container>
                <div className="dashboard-header mb-4">
                    <h2 className="fw-bold text-dark">Manager Dashboard</h2>
                    <p className="text-muted">View and manage users assigned to you.</p>
                </div>

                <Card className="border-0 shadow-sm rounded-4">
                    <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold mb-0">Registered Users</h4>
                            <Badge bg="info" className="bg-opacity-10 text-info px-3 py-2 rounded-pill">
                                {users.length} Users
                            </Badge>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2 text-muted">Loading users...</p>
                            </div>
                        ) : error ? (
                            <Alert variant="danger">{error}</Alert>
                        ) : (
                            <div className="table-responsive">
                                <Table hover className="align-middle">
                                    <thead className="bg-light">
                                        <tr>
                                            <th className="border-0 rounded-start">ID</th>
                                            <th className="border-0">Username</th>
                                            <th className="border-0">Email</th>
                                            <th className="border-0 rounded-end">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u.id}>
                                                <td className="text-muted">#{u.id}</td>
                                                <td><span className="fw-bold">{u.username}</span></td>
                                                <td className="text-secondary">{u.email}</td>
                                                <td>
                                                    <Badge bg="secondary" className="bg-opacity-10 text-secondary px-3 py-2 rounded-pill">
                                                        {u.role}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="text-center py-4 text-muted">
                                                    No users found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default ManagerDashboard;
