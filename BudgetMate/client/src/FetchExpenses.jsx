import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './FetchExpenses.css';

const FetchExpenses = () => {
    const [expenseEntries, setExpenseEntries] = useState([]);
    const navigate = useNavigate();
    // Fetch the expenses from the backend when the component mounts
    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const userId = 'user1'; // Hardcoded for demo
                const response = await axios.get(`http://localhost:8080/api/expenses/${userId}`);
                setExpenseEntries(response.data.expenseEntries);
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        fetchExpenses();
    }, []);

    return (
        <div className="expense-container">
            <h1>Your Expenses</h1>
            {expenseEntries.length > 0 ? (
                <ul>
                    {expenseEntries.map((entry, index) => (
                        <li key={index}>
                            {entry.category}: ${entry.amount} ({entry.frequency})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No expense data available.</p>
            )}
        <button 
                type="button" 
                onClick={() => navigate('/')} 
                style={{ marginTop: '20px' }}>
                Back to Dashboard
        </button>
        </div>
    );
};

export default FetchExpenses;
