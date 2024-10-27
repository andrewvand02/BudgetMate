import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate


const ExpenseInput = () => {
    const [expenseEntries, setExpenseEntries] = useState([{ category: '', amount: '', frequency: 'weekly' }]); 
    const navigate = useNavigate(); // Init navigate, which is used to go back to Dashboard later 

    const handleAddEntry = () => {
        setExpenseEntries([...expenseEntries, { category: '', amount: '', frequency: 'weekly' }]); //Add expense, the "..." denotes spread, which keeps the previous entries while adding naother one, default value for frequency is "weekly"
    };

    const handleRemoveEntry = (index) => {
        const updatedEntries = [...expenseEntries]; //Copy the current list of expenses
        updatedEntries.splice(index, 1); //Remove the entry at the given index
        setExpenseEntries(updatedEntries); //Set the expenseEntries as the upadted one with the removal. 
    };

    const handleInputChange = (index, field, value) => {
        const updatedEntries = [...expenseEntries]; // Create a copy of current list of expenses
        updatedEntries[index][field] = value; //Update the given index/category witht the value
        setExpenseEntries(updatedEntries); //Set the expenseEntries as our newly updated entries
    };

    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = 'user1'; // Hardcoded for demo
            const response = await axios.post('http://localhost:8080/api/expenses', { userId, expenseEntries }); //Send to backend
            alert(response.data.message); //Alert user of success/unsuccess
            navigate('/');
        } catch (error) {
            console.error('Error submitting expenses:', error); //Error catching stuff
        }
    };

    return (
        <div>
            <h1>Enter Your Expenses</h1>
            <form onSubmit={handleExpenseSubmit}>
                {expenseEntries.map((entry, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="Expense Category"
                            value={entry.category}
                            onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={entry.amount}
                            onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                            required
                        />
                        <select
                            value={entry.frequency}
                            onChange={(e) => handleInputChange(index, 'frequency', e.target.value)}
                        >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                        </select>
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
