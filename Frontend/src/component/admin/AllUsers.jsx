import React, { useEffect, useState } from 'react';
import { Table, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AllUsers = () => {
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
                const result = response.data;
                const userData = result.data || result;
                setUsers(Array.isArray(userData) ? userData : []);
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

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading users...</p>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold mb-0">All Users</h4>
                    <Badge bg="primary" className="px-3 py-2 rounded-pill">
                        {users.length} Total
                    </Badge>
                </div>

                <div className="table-responsive">
                    <Table hover className="align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="border-0 rounded-start">ID</th>
                                <th className="border-0">Username</th>
                                <th className="border-0">Email</th>
                                <th className="border-0">Role</th>
                                <th className="border-0 rounded-end text-end">Joined At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="fw-medium text-secondary">#{user.id}</td>
                                    <td>
                                        <div className="fw-bold text-dark">{user.username || user.name || 'N/A'}</div>
                                    </td>
                                    <td className="text-muted">{user.email}</td>
                                    <td>
                                        <Badge bg="info" className="bg-opacity-10 text-info px-3 py-2 rounded-pill">
                                            {user.role}
                                        </Badge>
                                    </td>
                                    <td className="text-end text-muted">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4 text-muted">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
        </Card>
    );
};

export default AllUsers;
