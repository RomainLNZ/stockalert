import React, { useEffect } from 'react';

function Toast({ message, duration = 3000, type = 'warning', onClose }) {
    const bgColor = type === 'warning' ? 'bg-orange-500' :
        type === 'error' ? 'bg-red-500' : 'bg-green-500';

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`
            fixed top-5 left-1/2 transform -translate-x-1/2
            ${bgColor}
            text-white px-8 py-4 rounded-lg shadow-lg z-50
        `}>
            {message}
        </div>
    );
}

export default Toast;