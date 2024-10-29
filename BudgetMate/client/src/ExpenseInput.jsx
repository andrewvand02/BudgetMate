import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExpenseInput = () => {
    const [expenseEntries, setExpenseEntries] = useState([{ name: '', category: '', amount: '', frequency: 'daily' }]);
    const navigate = useNavigate();

    const handleAddEntry = () => {
        setExpenseEntries([...expenseEntries, { name: '', category: '', amount: '', frequency: 'daily' }]);
    };

    const handleRemoveEntry = (index) => {
        const updatedEntries = [...expenseEntries];
        updatedEntries.splice(index, 1);
        setExpenseEntries(updatedEntries);
    };

    const handleInputChange = (index, field, value) => {
        const updatedEntries = [...expenseEntries];
        updatedEntries[index][field] = value;
        setExpenseEntries(updatedEntries);
    };

    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = 'user1';
            const response = await axios.post('http://localhost:8080/api/expenses', { userId, expenseEntries });
            alert(response.data.message);
            navigate('/');
        } catch (error) {
            console.error('Error submitting expenses:', error);
        }
    };

    const categoryOptions = {
        daily: ["Groceries", "Restaurant/Takeout", "Home Supplies", "Personal Care", "Transportation", "Entertainment", "Clothing", "Hobbies", "Pets", "Other" ],
        monthly: ["Rent/Mortgage", "Subscription", "Utilities", "Other"]
    };

    return (
        <div>
            <h1>Enter Your Expenses</h1>
            <form onSubmit={handleExpenseSubmit}>
                {expenseEntries.map((entry, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="Expense Name"
                            value={entry.name}
                            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                            required
                        />
                        <select
                            value={entry.frequency}
                            onChange={(e) => handleInputChange(index, 'frequency', e.target.value)}
                        >
                            <option value="daily">Daily</option>
                            <option value="monthly">Monthly</option>
                        </select>
                        <select
                            value={entry.category}
                            onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                            required
                        >
                            <option value="">Select Category</option>
                            {categoryOptions[entry.frequency].map((category, idx) => (
                                <option key={idx} value={category}>{category}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            placeholder="Amount"
                            value={entry.amount}
                            onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                            required
                        />
                        {expenseEntries.length > 1 && (
                            <button type="button" onClick={() => handleRemoveEntry(index)}>
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={handleAddEntry}>
                    Add Another Expense
                </button>
                <button type="submit">Submit Expenses</button>
            </form>
            <button 
                type="button" 
                onClick={() => navigate('/')} 
                style={{ marginTop: '20px' }}>
                Back to Dashboard
            </button>
        </div>
    );
};

export default ExpenseInput;
