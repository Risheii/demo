import { Container, Card, Form, Button, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, uploadProfileImage } from '../store/authSlice';
import { useEffect, useRef, useState } from 'react';

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        username: '',
        mobile: '',
    });
    // const [selectedFile, setSelectedFile] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                mobile: user.phone || '',
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            setSuccessMessage('');
            setErrorMessage('Invalid file type. Only JPEG, PNG, and JPG are allowed.');
            return;
        }

        if (file.size > maxSize) {
            setSuccessMessage('');
            setErrorMessage('File size should be less than 5MB');
            return;
        }

        setUpdating(true);
        setSuccessMessage('');
        const data = new FormData();
        data.append('profileimage', file);

        try {
            await dispatch(uploadProfileImage(data)).unwrap();
            setSuccessMessage('Profile image updated successfully');
            setErrorMessage('');
            e.target.value = ''; // Reset input
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setSuccessMessage('');        
        try {
            await dispatch(updateProfile(formData)).unwrap();
            setSuccessMessage('Profile updated successfully');
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    if (!user) {
        return (
            <Container className="py-5 text-center">
                <p>Please log in to view your profile.</p>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="border-0 shadow-sm rounded-4">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center mb-4">
                                <div className="me-4 position-relative" style={{ cursor: 'pointer' }} onClick={() => fileInputRef.current.click()} title="Click to change profile picture">
                                    {user.profileImage ? (
                                        <img
                                            src={user.profileImage.startsWith('http') ? user.profileImage : encodeURI(`/uploads/${user.profileImage}`)}
                                            alt="profile"
                                            className="rounded-circle"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <i className="bi bi-person-circle text-secondary" style={{ fontSize: '100px' }}></i>
                                    )}
                                    <div className="position-absolute bottom-0 end-0 bg-white rounded-circle p-1 shadow-sm border" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className="bi bi-camera-fill text-primary"></i>
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept=".jpg, .jpeg, .png"
                                        style={{ display: 'none' }}
                                    />
                                </div>
                                <div>
                                    <h3 className="fw-bold mb-1">{user.username}</h3>
                                    <p className="text-muted mb-0">{user.email}</p>
                                    <Badge bg="primary" className="mt-1">{user.role}</Badge>
                                </div>
                            </div>

                            {successMessage && <Alert variant="success">{successMessage}</Alert>}
                            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                            <hr className="my-4" />

                            <h5 className="fw-bold mb-3">Update Profile Details</h5>
                            <Form onSubmit={handleProfileUpdate}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        placeholder="Enter username"
                                        className="rounded-3 py-2"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold">Mobile</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        placeholder="Enter mobile number"
                                        className="rounded-3 py-2"
                                    />
                                </Form.Group>
                                <Button type="submit" variant="primary" className="px-4 rounded-pill fw-medium shadow-sm" disabled={updating}>
                                    {updating ? <Spinner size="sm" /> : 'Save Changes'}
                                </Button>
                            </Form>


                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage;
