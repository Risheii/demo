import React, { useState } from 'react';
import { IoMdAdd } from 'react-icons/io';

const containerStyle = {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontFamily: "'Inter', sans-serif",
    color: '#fff',
    padding: '40px 20px',
    boxSizing: 'border-box',
};

const glassFormStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '520px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
};

const titleStyle = {
    marginTop: 0,
    marginBottom: '24px',
    fontSize: '28px',
    fontWeight: '600',
    textAlign: 'center',
    background: 'linear-gradient(to right, #00f2fe 0%, #4facfe 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
};

const labelStyle = {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '6px',
    fontSize: '13px',
    letterSpacing: '0.5px',
    color: 'black',
};

const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    color: 'black',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
};

const buttonStyle = {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#000',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '16px',
};

const iconBtnStyle = {
    border: '1px solid black',
    backgroundColor: '#00FFFF',
    borderRadius: '8px',
    padding: '6px 10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};

const smallBtnStyle = {
    padding: '5px 12px',
    background: 'rgba(79, 172, 254, 0.2)',
    border: '1px solid black',
    borderRadius: '6px',
    color: 'black',
    fontSize: '12px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
};

const tagStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(79, 172, 254, 0.15)',
    border: '1px solid black',
    borderRadius: '20px',
    padding: '3px 10px',
    fontSize: '12px',
    color: 'black',
};

const sectionStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '16px',
};

const Form = () => {
    const [formData, setFormData] = useState({ name: '', email: '', mobile: '' });
    const [submittedData, setSubmittedData] = useState(null);

    const [fieldType, setFieldType] = useState('');
    const [fieldName, setFieldName] = useState('');
    const [optionInput, setOptionInput] = useState('');
    const [pendingOptions, setPendingOptions] = useState([]);
    const [dynamicFields, setDynamicFields] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "mobile") {
            if (!/^\d*$/.test(value)) {
                alert("Only numbers are allowed");
                return;
            }
            if (value.length > 10) {
                alert("Mobile number must be 10 digits");
                return;
            }
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddOption = () => {
        const trimmed = optionInput.trim();
        if (!trimmed) return;
        if (pendingOptions.includes(trimmed)) return;
        setPendingOptions(prev => [...prev, trimmed]);
        setOptionInput('');
    };

    const handleRemovePendingOption = (opt) => {
        setPendingOptions(prev => prev.filter(o => o !== opt));
    };

    const needsOptions = fieldType === 'radio' || fieldType === 'checkbox';

    const handleAddField = () => {
        if (!fieldType || !fieldName.trim()) return;
        if (needsOptions && pendingOptions.length === 0) {
            alert('Please add at least one option for radio / checkbox fields.');
            return;
        }

        const newField = {
            id: Date.now(),
            type: fieldType,
            name: fieldName.trim(),
            options: needsOptions ? [...pendingOptions] : [],
        };

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
    };

    const handleDynamicText = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDynamicCheckbox = (fieldName, option, checked) => {
        setFormData(prev => {
            const current = prev[fieldName] || [];
            return {
                ...prev,
                [fieldName]: checked
                    ? [...current, option]
                    : current.filter(v => v !== option),
            };
        });
    };

    const handleDynamicRadio = (fieldName, value) => {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const jsonData = JSON.stringify(formData, null, 2);
        console.log('Form Data', formData);
        setSubmittedData(jsonData);
    };

    return (
        <div style={containerStyle}>
            <div style={glassFormStyle}>
                <h2 style={titleStyle}>Personal Details</h2>
                <form onSubmit={handleSubmit}>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange}
                            style={inputStyle} required placeholder="Enter your name" />
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={labelStyle}>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange}
                            style={inputStyle} required placeholder="Enter your email" />
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                        <label htmlFor="mobile" style={labelStyle}>Mobile</label>
                        <input type="text" name="mobile" pattern="[0-9]{10}"
                            title="Please enter exactly 10 digits (numbers only)" id="mobile" value={formData.mobile}
                            onChange={handleChange} style={inputStyle} required placeholder="Enter your mobile number" />
                    </div>

                    <div style={{ ...sectionStyle, marginBottom: '24px' }}>
                        <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#4facfe', fontWeight: '600', letterSpacing: '0.5px' }}>
                            + ADD DYNAMIC FIELD
                        </p>

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Field Type</label>
                                <select value={fieldType} onChange={e => { setFieldType(e.target.value); setPendingOptions([]); setOptionInput(''); }}
                                    style={inputStyle}>
                                    <option value="">Select Type</option>
                                    <option value="textbox">Textbox</option>
                                    <option value="checkbox">Checkbox</option>
                                    <option value="radio">Radio Button</option>
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Field Label</label>
                                <input type="text" value={fieldName} onChange={e => setFieldName(e.target.value)}
                                    style={inputStyle} placeholder="Enter field name" />
                            </div>
                        </div>

                        {needsOptions && (
                            <div style={{ marginBottom: '12px' }}>
                                <label style={labelStyle}>Options</label>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                    <input
                                        type="text"
                                        value={optionInput}
                                        onChange={e => setOptionInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddOption(); } }}
                                        style={{ ...inputStyle, flex: 1 }}
                                        placeholder="Enter option name"
                                    />
                                    <button type="button" onClick={handleAddOption} style={smallBtnStyle}>
                                        Add
                                    </button>
                                </div>

                                {pendingOptions.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {pendingOptions.map((opt, i) => (
                                            <span key={i} style={tagStyle}>
                                                {opt}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemovePendingOption(opt)}
                                                    style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: '14px' }}
                                                >×</button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleAddField}
                            disabled={!fieldType || !fieldName.trim()}
                            style={{
                                ...iconBtnStyle,
                                width: '100%',
                                backgroundColor: '#4facfe',
                                justifyContent: 'center',
                                gap: '6px',
                            }}
                        >
                            <IoMdAdd color="black" size={20} />
                            <span style={{ color: 'black', fontSize: '14px', fontWeight: 'bold' }}>Add Field</span>
                        </button>
                    </div>

                    {dynamicFields.map((field) => (
                        <div key={field.id} style={{ ...sectionStyle, position: 'relative' }}>
                            <label style={{ ...labelStyle, marginBottom: '10px', fontSize: '14px' }}>
                                {field.name}
                                {/* <span style={{ marginLeft: '8px', fontSize: '10px', color: '#888', fontWeight: 'normal', textTransform: 'uppercase' }}>
                                    ({field.type})
                                </span> */}
                            </label>

                            {field.type === 'textbox' && (
                                <input
                                    type="text"
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleDynamicText}
                                    style={inputStyle}
                                    placeholder={`Enter ${field.name}`}
                                />
                            )}

                            {field.type === 'checkbox' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {field.options.map((opt, i) => (
                                        <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'black', fontSize: '14px' }}>
                                            <input
                                                type="checkbox"
                                                name={field.name}
                                                value={opt}
                                                checked={(formData[field.name] || []).includes(opt)}
                                                onChange={e => handleDynamicCheckbox(field.name, opt, e.target.checked)}
                                                style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#4facfe' }}
                                            />
                                            {opt}
                                        </label>
                                    ))}
                                </div>
                            )}

                            {field.type === 'radio' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {field.options.map((opt, i) => (
                                        <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'black', fontSize: '14px' }}>
                                            <input
                                                type="radio"
                                                name={field.name}
                                                value={opt}
                                                checked={formData[field.name] === opt}
                                                onChange={() => handleDynamicRadio(field.name, opt)}
                                                style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#4facfe' }}
                                            />
                                            {opt}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <button type="submit" style={buttonStyle}>Submit as JSON</button>
                </form>

                {submittedData && (
                    <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(79,172,254,0.25)', borderRadius: '8px' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '12px', fontSize: '15px', color: 'black' }}>Submitted JSON</h3>
                        <pre style={{ margin: 0, wordBreak: 'break-word', fontFamily: 'monospace', fontSize: '13px', color: 'black', whiteSpace: 'pre-wrap' }}>
                            {submittedData}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Form;