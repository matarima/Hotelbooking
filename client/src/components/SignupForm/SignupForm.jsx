import React, { useState } from 'react';
import './SignupForm.css';

const SignupForm = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Email Submitted: ', email);
        // Chỗ này bạn có thể thêm mã để gửi email tới server
    };

    return (
        <div className="signup-container">
            <h1>Save time, save money!</h1>
            <p>Sign up and we'll send the best deals to you</p>
            <form className="signup-form" onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Subscribe</button>
            </form>
        </div>
    );
};

export default SignupForm;