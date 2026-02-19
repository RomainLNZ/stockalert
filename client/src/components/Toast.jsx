import React, { useEffect } from 'react';

function Toast({ message, duration = 3000, type = 'warning', onClose }) {
    const colors = {
        warning: 'orange',
        error: 'red',
        success: 'green'
    };

    const backgroundColor = colors[type];

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: backgroundColor,  // ← Utilise la variable
            color: 'white',
            padding: '15px 30px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 1000
        }}>
            {message}
        </div>
    );
}

export default Toast;