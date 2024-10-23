import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const IncomeInput = () => {
    const [incomeEntries, setIncomeEntries] = useState([{ category: '', amount: '' }]);
    const navigate = useNavigate();  // To handle navigation after submission

    // Add new income entry
    const handleAddEntry = () => {
        setIncomeEntries([...incomeEntries, { category: '', amount: '' }]);
    };

    // Remove a specific income entry
    const handleRemoveEntry = (index) => {
        const updatedEntries = [...incomeEntries];
        updatedEntries.splice(index, 1);
        setIncomeEntries(updatedEntries);
    };

    // Handle input changes for both category and amount
    const handleInputChange = (index, field, value) => {
        const updatedEntries = [...incomeEntries];
        updatedEntries[index][field] = value;
        setIncomeEntries(updatedEntries);
    };

    // Submit income data to the backend
    const handleIncomeSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = 'user1';  // Hardcoded user ID for demo purposes
            const response = await axios.post('http://localhost:8080/api/income', { userId, incomeEntries });
            alert(response.data.message);  // Notify user of successful submission

            // Navigate back to dashboard after submission
            navigate('/');
        } catch (error) {
            console.error('Error submitting income:', error);
            alert('There was an error submitting your income. Please try again.');
        }
    };

    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <h1>Enter Your Weekly Income</h1>
            <form onSubmit={handleIncomeSubmit}>
                {incomeEntries.map((entry, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="Income Category"
                            value={entry.category}
                            onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                            required
                            style={{ marginRight: '10px' }}
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={entry.amount}
                            onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                            required
                            style={{ marginRight: '10px' }}
                        />
                        {incomeEntries.length > 1 && (
                            <button 
                                type="button" 
                                onClick={() => handleRemoveEntry(index)} 
                                style={{ marginLeft: '5px' }}>
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={handleAddEntry} style={{ marginRight: '10px' }}>
                        Add Another Income Category
                    </button>
                    <button type="submit">Submit Income</button>
                </div>
            </form>

            {/* Button to return to dashboard without submitting */}
            <button 
                type="button" 
                onClick={() => navigate('/')} 
                style={{ marginTop: '20px' }}>
                Back to Dashboard
            </button>
        </div>
    );
};

export default IncomeInput;
