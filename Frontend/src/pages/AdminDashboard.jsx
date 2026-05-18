import React, { useState } from 'react';
import { Container, Row, Col, Nav, Card, Tab } from 'react-bootstrap';
import AllSubmissions from '../component/admin/AllSubmissions';
import AllUsers from '../component/admin/AllUsers';
import ManagerManagement from '../component/admin/ManagerManagement';
import ReactBootstrapForm from '../component/ReactBootstrapForm'; // Reusing for "My Submissions"
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeKey, setActiveKey] = useState('all-submissions');

    return (
        <div className="admin-dashboard py-5">
            <Container fluid="lg">
                <div className="dashboard-header mb-4">
                    <h2 className="fw-bold text-dark">Admin Dashboard</h2>
                    <p className="text-muted">Manage your application, submissions, and team members.</p>
                </div>

                <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
                    <Row>
                        <Col lg={3} className="mb-4">
                            <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
                                <Card.Body className="p-0">
                                    <Nav variant="pills" className="flex-column admin-nav">
                                        <Nav.Item>
                                            <Nav.Link eventKey="all-submissions" className="p-3 border-bottom rounded-0">
                                                <i className="bi bi-list-check me-2"></i> All Submissions
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="all-users" className="p-3 border-bottom rounded-0">
                                                <i className="bi bi-people me-2"></i> All Users
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="manager-management" className="p-3 border-bottom rounded-0">
                                                <i className="bi bi-person-badge me-2"></i> Manager Management
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="my-submissions" className="p-3 rounded-0">
                                                <i className="bi bi-person me-2"></i> My Submissions
                                            </Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="all-submissions">
                                    <AllSubmissions />
                                </Tab.Pane>
                                <Tab.Pane eventKey="all-users">
                                    <AllUsers />
                                </Tab.Pane>
                                <Tab.Pane eventKey="manager-management">
                                    <ManagerManagement />
                                </Tab.Pane>
                                <Tab.Pane eventKey="my-submissions">
                                    <Card className="border-0 shadow-sm rounded-4">
                                        <Card.Body className="p-4">
                                            <h4 className="fw-bold mb-4">My Submissions</h4>
                                            <ReactBootstrapForm />
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Container>
        </div>
    );
};

export default AdminDashboard;
