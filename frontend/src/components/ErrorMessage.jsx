import React from 'react';

const ErrorMessage = ({ message, onClose }) => {
    return (
        <div className="error-message">
            <span>{message}</span>
            <button onClick={onClose}>X</button>
        </div>
    );
};


export default ErrorMessage;