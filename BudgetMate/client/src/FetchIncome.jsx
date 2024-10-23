import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './FetchIncome.css';

const FetchIncome = () => {
    const [incomeEntries, setIncomeEntries] = useState([]);
    const navigate = useNavigate(); // Initialize the navigate hook

    // Fetch the income from the backend when the component mounts
    useEffect(() => {
        const fetchIncome = async () => {
            try {
                const userId = 'user1'; // Hardcoded for demo, you can use actual user id if needed
                const response = await axios.get(`http://localhost:8080/api/income/${userId}`);
                setIncomeEntries(response.data.incomeEntries);
            } catch (error) {
                console.error('Error fetching income:', error);
            }
        };

        fetchIncome();
    }, []);

    // Function to navigate back to the dashboard
    const goBackToDashboard = () => {
        navigate('/');  // Redirect to the dashboard route ("/")
    };

    return (
        <div className="income-container">
            <h1>Your Weekly Income Breakdown</h1>
            {incomeEntries.length > 0 ? (
                <ul>
                    {incomeEntries.map((entry, index) => (
                        <li key={index}>
                            {entry.category}: ${entry.amount}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No income data available.</p>
            )}
            <button onClick={goBackToDashboard} className="back-button">
                Back to Dashboard
            </button>
        </div>
    );
};

export default FetchIncome;
