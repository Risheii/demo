import React, { useState, useEffect } from 'react'
import { Button, Card, Col, Container, Form, Row, Table, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSubmissions, createSubmission, deleteSubmission, updateSubmission, fetchSubmissionById, clearCurrentSubmission } from '../store/formSlice'
import ConfirmationPopup from './ConfirmationPopup'

const ReactBootstrapForm = () => {

    const dispatch = useDispatch();
    const { submissions, currentSubmission, loading } = useSelector(state => state.form);
    const { token } = useSelector(state => state.auth);

    const [fieldType, setFieldType] = useState('');
    const [fieldName, setFieldName] = useState('');
    const [optionInput, setOptionInput] = useState('');
    const [pendingOptions, setPendingOptions] = useState([]);
    const [dynamicFields, setDynamicFields] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '' });
    const [hasoptions, setHasoptions] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [popupConfig, setPopupConfig] = useState({ show: false, title: '', body: '', isAlert: false, onConfirm: null });

    useEffect(() => {
        if (token) {
            dispatch(fetchSubmissions());
        }
    }, [dispatch, token]);

    const handlefieldtype = (e) => {
        const { name, value } = e.target;
        setFieldType(value);
        if (value === 'textbox') {
            setHasoptions(false);
        } else {
            setHasoptions(true);
        }
    }

    const handlefieldname = (e) => {
        const { name, value } = e.target;
        setFieldName(value);
    }

    const handleaddoptions = (e) => {
        e.preventDefault();
        const trimmed = optionInput.trim();
        if (!trimmed) return;
        if (pendingOptions.includes(trimmed)) return;
        setPendingOptions(prev => [...prev, trimmed]);
        setOptionInput('');
    }

    const handleAddField = (e) => {
        e.preventDefault();
        console.log(fieldType, 'from the handleaddfield function')
        if (!fieldType || !fieldName || !fieldName.trim()) return;
        if (hasoptions && pendingOptions.length === 0) {
            setPopupConfig({
                show: true,
                title: 'Missing Options',
                body: 'Please add at least one option for radio / checkbox fields.',
                isAlert: true
            });
            return;
        }
        const newField = {
            id: Date.now(),
            type: fieldType,
            name: fieldName.trim(),
            options: hasoptions ? [...pendingOptions] : [],
        };
        console.log(newField, 'from the add field function')

        setDynamicFields(prev => [...prev, newField]);

        setFormData(prev => ({
            ...prev,
            [fieldName.trim()]: fieldType === 'checkbox' ? [] : '',
        }));

        // reset builder
        setFieldType('');
        setFieldName('');
        setPendingOptions([]);
        setOptionInput('');
        setHasoptions(false);
    };

    const handlechange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData(prev => {
                const prevValues = prev[name] || [];
                if (checked) {
                    return { ...prev, [name]: [...prevValues, value] };
                } else {
                    return {
                        ...prev,
                        [name]: prevValues.filter(v => v !== value)
                    };
                }
            });
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', mobile: '' });
        setDynamicFields([]);
        setEditingId(null);
        setFieldType('');
        setFieldName('');
        setPendingOptions([]);
        setOptionInput('');
        setHasoptions(false);
    };

    const handlesubmit = (e) => {
        e.preventDefault();

        if (!token) {
            setPopupConfig({
                show: true,
                title: 'Login Required',
                body: 'Please login to save your form submission.',
                isAlert: true
            });
            return;
        }

        const payload = {
            ...formData,
            fields: dynamicFields.map(field => ({
                name: field.name,
                type: field.type,
                value: formData[field.name],
                options: field.options
            }))
        };

        const jsondata = JSON.stringify(payload, null, 2);
        setSubmittedData(jsondata);

        if (editingId) {
            dispatch(updateSubmission({ id: editingId, data: payload })).then((res) => {
                if (!res.error) resetForm();
            });
        } else {
            dispatch(createSubmission(payload)).then((res) => {
                if (!res.error) resetForm();
            });
        }
    }

    const handleEdit = (submission) => {
        const baseData = {
            name: submission.name,
            email: submission.email,
            mobile: submission.mobile
        };

        const dynamicValues = {};
        const loadedFields = submission.fields.map(field => {
            let value = field.field_value;
            if (field.field_type === 'checkbox') {
                try {
                    value = JSON.parse(field.field_value || '[]');
                } catch (e) {
                    value = [];
                }
            }
            dynamicValues[field.field_name] = value;

            let options = [];
            try {
                options = field.field_options ? JSON.parse(field.field_options) : [];
            } catch (e) {
                options = [];
            }

            return {
                id: field.id,
                name: field.field_name,
                type: field.field_type,
                options: options
            };
        });

        setFormData({ ...baseData, ...dynamicValues });
        setDynamicFields(loadedFields);
        setEditingId(submission.id);
    };

    const handleDelete = (id) => {
        setPopupConfig({
            show: true,
            title: 'Delete Submission',
            body: 'Are you sure you want to delete this submission?',
            isAlert: false,
            onConfirm: () => {
                dispatch(deleteSubmission(id));
                setPopupConfig(prev => ({ ...prev, show: false }));
            }
        });
    };

    const handleView = (id) => {
        dispatch(fetchSubmissionById(id));
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        dispatch(clearCurrentSubmission());
    };

    return (
        <div className='h-100 w-100 d-flex justify-content-center align-items-center' style={{ background: 'linear-gradient(135deg, #667eea22, #764ba222)' }}>
            <Container className='w-100'>
                <Row>
                    <Col className='w-100' xs={12} md={10} lg={4}>
                        <Card className='p-3 border-0 shadow-lg border-0 rounded-4 shadow-gray-500 mt-5'>
                            <Card.Body>
                                <Card.Title className='text-center text-secondary fs-1 fw-bold text-grey'>Personal Details</Card.Title>
                                <p className='text-center text-dark fw-medium'>Please enter your details for the verification</p>
                                <Form onSubmit={handlesubmit}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label className='fw-semibold text-secondary fs-5'>Name</Form.Label>
                                        <Form.Control className='border-1 rounded-3 py-2' name='name' value={formData.name} onChange={handlechange} type="text" placeholder="Enter your name" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label className='fw-semibold text-secondary fs-5'>Email</Form.Label>
                                        <Form.Control className='border-1 rounded-3 py-2' type="email" value={formData.email} name='email' onChange={handlechange} placeholder="Enter your email" />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                        <Form.Label className='fw-semibold text-secondary fs-5'>Mobile</Form.Label>
                                        <Form.Control className='border-1 rounded-3 py-2' type="text" required={true} value={formData.mobile} name='mobile' onChange={handlechange} placeholder="Enter your mobile" />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                        <Row className='d-flex mb-3'>
                                            <Col xs={6} md={6}>
                                                <Form.Label className='fw-semibold text-secondary fs-5'>Field Type</Form.Label>
                                                <Form.Select aria-label="Default select example" value={fieldType} onChange={handlefieldtype}>
                                                    <option>See options</option>
                                                    <option value="textbox" >Textbox</option>
                                                    <option value="radio" >Radio</option>
                                                    <option value="checkbox" >Checkbox</option>
                                                </Form.Select>
                                            </Col>
                                            <Col xs={6} md={6}>
                                                <Form.Label className='fw-semibold text-secondary fs-5'>Field Name</Form.Label>
                                                <Form.Control className='border-1 rounded-3 py-2' type="text" value={fieldName} onChange={handlefieldname} placeholder="Enter your field name" />
                                            </Col>
                                        </Row>
                                        {fieldType === 'checkbox' && (
                                            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                                <Form.Label className='fw-semibold text-secondary fs-5'>Options</Form.Label>
                                                <Row>
                                                    <Col xs={6} md={10}>
                                                        <Form.Control className='border-1 rounded-3 py-2' type="text" value={optionInput} onChange={(e) => setOptionInput(e.target.value)} placeholder="Enter your options" />
                                                    </Col>
                                                    <Col xs={6} md={2}>
                                                        <Button variant="primary" type="button" onClick={handleaddoptions}>Add Option</Button>
                                                    </Col>
                                                </Row>
                                                {pendingOptions.length > 0 && (
                                                    <Row>
                                                        <Col xs={12} md={12}>
                                                            <Form.Label className='fw-semibold text-secondary fs-5'>Options</Form.Label>
                                                            <Form.Control className='border-1 rounded-3 py-2' type="text" value={pendingOptions.join(', ')} disabled />
                                                        </Col>
                                                    </Row>
                                                )}
                                            </Form.Group>
                                        )}
                                        {fieldType === 'radio' && (
                                            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                                <Form.Label className='fw-semibold text-secondary fs-5'>Options</Form.Label>
                                                <Row>
                                                    <Col xs={6} md={10}>
                                                        <Form.Control className='border-1 rounded-3 py-2' type="text" value={optionInput} onChange={(e) => setOptionInput(e.target.value)} placeholder="Enter your options" />
                                                    </Col>
                                                    <Col xs={6} md={2}>
                                                        <Button variant="primary" type="button" onClick={handleaddoptions}>Add Option</Button>
                                                    </Col>
                                                </Row>
                                                {pendingOptions.length > 0 && (
                                                    <Row>
                                                        <Col xs={12} md={12}>
                                                            <Form.Label className='fw-semibold text-secondary fs-5'>Options</Form.Label>
                                                            <Form.Control className='border-1 rounded-3 py-2' type="text" value={pendingOptions.join(', ')} disabled />
                                                        </Col>
                                                    </Row>
                                                )}
                                            </Form.Group>
                                        )}
                                        <Row>
                                            <Button className='mb-3' variant="primary" type="button" onClick={handleAddField}>
                                                Add Field
                                            </Button>
                                        </Row>

                                        {dynamicFields.map(field => (
                                            <Form.Group key={field.id}>
                                                <Form.Label className='fw-semibold text-secondary fs-5'>{field.name}</Form.Label>
                                                {field.type === 'textbox' && (
                                                    <Form.Control className='border-1 rounded-3 py-2 mb-3' type="text" value={formData[field.name]} name={field.name} onChange={handlechange} />
                                                )}
                                                {field.type === 'radio' && (
                                                    <Form.Group className='mb-3'>
                                                        {field.options.map(option => (
                                                            <Form.Check
                                                                type="radio"
                                                                label={option}
                                                                name={field.name}
                                                                value={option}
                                                                checked={formData[field.name] === option}
                                                                onChange={handlechange}
                                                            />
                                                        ))}
                                                    </Form.Group>
                                                )}
                                                {field.type === 'checkbox' && (
                                                    <Form.Group className='mb-3'>
                                                        {field.options.map(option => (
                                                            <Form.Check
                                                                type="checkbox"
                                                                label={option}
                                                                name={field.name}
                                                                value={option}
                                                                checked={formData[field.name]?.includes(option)}
                                                                onChange={handlechange}
                                                            />
                                                        ))}
                                                    </Form.Group>
                                                )}
                                            </Form.Group>
                                        ))}
                                    </Form.Group>
                                    <Button className='mb-3' variant="primary" type="submit" disabled={loading}>
                                        {editingId ? 'Update' : 'Submit'}
                                    </Button>
                                </Form>
                                {/* add css to make it look cool */}
                                {submittedData && (
                                    <Card className='mb-3 bg-dark text-white'>
                                        <Card.Body>
                                            <Card.Title>Submitted Data</Card.Title>
                                            <Card.Text className='text-white break-all wrap-break-word' style={{ margin: 0, wordBreak: 'break-word', fontFamily: 'monospace', fontSize: '13px', color: 'black', whiteSpace: 'pre-wrap' }}>{submittedData}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {submissions.length > 0 && (
                        <Col className='w-100 mt-5' xs={12} md={12} lg={8}>
                            <Card className='p-3 border-0 shadow-lg border-0 rounded-4 shadow-gray-500'>
                                <Card.Body>
                                    <Card.Title className='text-center text-secondary fs-3 fw-bold text-grey mb-4'>Saved Submissions</Card.Title>
                                    <Table responsive hover className="align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Mobile</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {submissions.map((sub) => (
                                                <tr key={sub.id}>
                                                    <td>{sub.name}</td>
                                                    <td>{sub.email}</td>
                                                    <td>{sub.mobile}</td>
                                                    <td>
                                                        <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleView(sub.id)}>View</Button>
                                                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(sub)}>Edit</Button>
                                                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(sub.id)}>Delete</Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>
                    )}
                </Row>
            </Container>

            {/* Modal for viewing submission details */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Submission Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <p>Loading details...</p>
                    ) : currentSubmission ? (
                        <div>
                            <h5 className="text-primary mb-3">Core Details</h5>
                            <Table bordered>
                                <tbody>
                                    <tr>
                                        <th>Name</th>
                                        <td>{currentSubmission.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <td>{currentSubmission.email}</td>
                                    </tr>
                                    <tr>
                                        <th>Mobile</th>
                                        <td>{currentSubmission.mobile}</td>
                                    </tr>
                                </tbody>
                            </Table>

                            {currentSubmission.fields && currentSubmission.fields.length > 0 && (
                                <>
                                    <h5 className="text-primary mt-4 mb-3">Dynamic Fields</h5>
                                    <Table bordered>
                                        <thead>
                                            <tr>
                                                <th>Field Name</th>
                                                <th>Type</th>
                                                <th>Options</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentSubmission.fields.map(field => {
                                                const options = field.field_options ? JSON.parse(field.field_options) : [];
                                                return (
                                                    <tr key={field.id}>
                                                        <td>{field.field_name}</td>
                                                        <td><span className="badge bg-secondary">{field.field_type}</span></td>
                                                        <td>{options.length > 0 ? options.join(', ') : '-'}</td>
                                                        <td>
                                                            {field.field_type === 'checkbox'
                                                                ? JSON.parse(field.field_value || '[]').join(', ')
                                                                : field.field_value}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </>
                            )}
                        </div>
                    ) : (
                        <p className="text-danger">Failed to load details.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <ConfirmationPopup
                show={popupConfig.show}
                onHide={() => setPopupConfig({ ...popupConfig, show: false })}
                onConfirm={popupConfig.onConfirm}
                title={popupConfig.title}
                body={popupConfig.body}
                isAlert={popupConfig.isAlert}
            />
        </div>
    )
}

export default ReactBootstrapForm