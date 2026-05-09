import React, { useState } from 'react'
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'

const ReactBootstrapForm = () => {

    console.log("hi everyone")

    const data10 = "data10";

    const [fieldType, setFieldType] = useState('');
    const [fieldName, setFieldName] = useState('');
    const [optionInput, setOptionInput] = useState('');
    const [pendingOptions, setPendingOptions] = useState([]);
    const [dynamicFields, setDynamicFields] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '' });
    const [hasoptions, setHasoptions] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);

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
            alert('Please add at least one option for radio / checkbox fields.');
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

    const handlesubmit = (e) => {
        e.preventDefault();
        const jsondata = JSON.stringify(formData, null, 2);
        console.log(jsondata, 'from the handlesubmit function')
        setSubmittedData(jsondata);
    }

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
                                    <Button className='mb-3' variant="primary" type="submit">
                                        Submit
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
                </Row>
            </Container>
        </div>
    )
}

export default ReactBootstrapForm