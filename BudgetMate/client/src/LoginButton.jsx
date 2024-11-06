// LoginButton.jsx
import React from 'react';
//import axios from 'axios';
import "./LoginButton.css";

// Function to handle navigation back to the dashboard
const goBackToDashboard = () => {
    navigate('/'); // Redirects to the dashboard route ('/')
};
const LoginButton = () => {
    return (
        <div class="login-page">
            <div class="form">
                <form class="register-form">
                    <input type="text" placeholder="name" />
                    <input type="password" placeholder="password" />
                    <input type="text" placeholder="email address" />
                    <button>create</button>
                    <p class="message">Already registered? <a href="#">Sign In</a></p>
                </form>
                <form class="login-form">
                    <input type="text" placeholder="username" />
                    <input type="password" placeholder="password" />
                    <button className="login-button"><span className='btn-txt'>Login</span></button>
                    <p class="message">Not registered? <a href="#">Create an account</a></p>
                </form>
            </div>
            <button onClick={goBackToDashboard} className='button type1'> {/* Button to go back to dashboard */}
                <span className="btn-txt">Dashboard</span> {/* Button label */}
            </button>
        </div>
    );
};

export default LoginButton;