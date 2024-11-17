import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TaxHelp.css'

const TaxHelp = () => {
    const navigate = useNavigate();// Initializing the navigate function for navigation
    const goBackToDashboard = () => {// Function to handle navigation back to the dashboard
        navigate('/'); // Redirects to the dashboard route ('/')
    };

    return (
        <div className='tex-help-cont'>
            <h1>Tax Help</h1>

            <div className='tax-help-info'>

            </div>

            <div className='dashboard-button'>
                <button onClick={goBackToDashboard} className='button type1'>
                    <span className="btn-txt">Dashboard</span> {/* Button to go back to the dashboard*/}
                </button>
            </div>
        </div>
    );
};

export default TaxHelp;