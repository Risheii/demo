import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmationPopup = ({ 
    show, 
    onHide, 
    onConfirm, 
    title, 
    body, 
    confirmText = 'Confirm', 
    cancelText = 'Cancel',
    isAlert = false // If true, only show "OK" button and do not require onConfirm
}) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {body}
            </Modal.Body>
            <Modal.Footer>
                {!isAlert && (
                    <Button variant="secondary" onClick={onHide}>
                        {cancelText}
                    </Button>
                )}
                <Button variant={isAlert ? "primary" : "danger"} onClick={isAlert ? onHide : onConfirm}>
                    {isAlert ? "OK" : confirmText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmationPopup;
