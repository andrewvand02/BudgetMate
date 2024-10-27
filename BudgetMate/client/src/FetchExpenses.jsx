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
                const response = await axios.get(`http://localhost:8080/api/expenses/${userId}`); //Get the stored expenses from the backend
                setExpenseEntries(response.data.expenseEntries);//update expenseEntries with the data we get from the backend 
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
                    {expenseEntries.map((entry, index) => (  //Display expenses in a list format, displaying category, amount, and frequency
                        <li key={index}>
                            {entry.category}: ${entry.amount} ({entry.frequency}) 
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No expense data available.</p> //If user has no data inputted yet, display this
            )}
        <button // Back to dashboard button 
                type="button" 
                onClick={() => navigate('/')} 
                style={{ marginTop: '20px' }}>
                Back to Dashboard
        </button>
        </div>
    );
};

export default FetchExpenses;
