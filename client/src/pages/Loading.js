import React from 'react';
import './Loading.css'; // Ensure this CSS file contains the loading styles

const Loading = () => {
    return (
        <div className="loading">
            <svg className="ip" viewBox="0 0 80 40" style={{ width: '100%', height: 'auto' }}>
                <g fill="none">
                    <path className="ip__track" d="M 0 20 Q 20 0, 40 20 T 80 20" />
                    <path className="ip__worm1" d="M 0 20 Q 20 40, 40 20 T 80 20" />
                    <path className="ip__worm2" d="M 0 20 Q 20 0, 40 20 T 80 20" />
                </g>
            </svg>
        </div>
    );
};

export default Loading;
