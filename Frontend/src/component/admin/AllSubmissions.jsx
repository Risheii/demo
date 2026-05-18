import React, { useEffect, useState } from 'react';
import { Table, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AllSubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await axios.get('/api/admin/get-all-submissions', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSubmissions(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch submissions');
                setLoading(false);
            }
        };

        if (token) {
            fetchSubmissions();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading submissions...</p>
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
                    <h4 className="fw-bold mb-0">All Submissions</h4>
                    <Badge bg="primary" className="px-3 py-2 rounded-pill">
                        {submissions.length} Total
                    </Badge>
                </div>

                <div className="table-responsive">
                    <Table hover className="align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="border-0 rounded-start">ID</th>
                                <th className="border-0">User</th>
                                <th className="border-0">Mobile</th>
                                <th className="border-0">Form Details</th>
                                <th className="border-0">Submitted At</th>
                                <th className="border-0 rounded-end text-end">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((sub) => (
                                <tr key={sub.id}>
                                    <td className="fw-medium text-secondary">#{sub.id}</td>
                                    <td>
                                        <div className="fw-bold">{sub.name || 'N/A'}</div>
                                        <div className="text-muted small">{sub.email}</div>
                                    </td>
                                    <td>{sub.mobile || 'N/A'}</td>
                                    <td>
                                        <div className="small">
                                            {sub.fields && sub.fields.map((field, idx) => {
                                                let displayValue = field.field_value;
                                                if (displayValue && displayValue.startsWith('[')) {
                                                    try {
                                                        const parsed = JSON.parse(displayValue);
                                                        if (Array.isArray(parsed)) {
                                                            displayValue = parsed.join(', ');
                                                        }
                                                    } catch (e) {
                                                        // ignore
                                                    }
                                                }
                                                return (
                                                    <div key={idx}>
                                                        <span className="text-muted">{field.field_name}:</span> {displayValue}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </td>
                                    <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                                    <td className="text-end">
                                        <Badge bg="success" className="bg-opacity-10 text-success px-3 py-2 rounded-pill">
                                            Completed
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                            {submissions.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">
                                        No submissions found.
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

export default AllSubmissions;
