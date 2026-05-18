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
                                <th className="border-0">User Email</th>
                                <th className="border-0">Form Details</th>
                                <th className="border-0">Submitted At</th>
                                <th className="border-0 rounded-end text-end">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.map((sub) => (
                                <tr key={sub.id}>
                                    <td className="fw-medium text-secondary">#{sub.id}</td>
                                    <td>{sub.user_email || 'N/A'}</td>
                                    <td>
                                        <div className="small">
                                            {sub.fields && sub.fields.map((field, idx) => (
                                                <div key={idx}>
                                                    <span className="text-muted">{field.fieldName}:</span> {field.fieldValue}
                                                </div>
                                            ))}
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
                                    <td colSpan="5" className="text-center py-4 text-muted">
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
