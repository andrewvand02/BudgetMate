import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


ChartJS.register(ArcElement, Tooltip, Legend);

const Budget = () => {
    const [budgetEntries, setBudgetEntries] = useState([{category: '', amount:''}]);
    const [actualExpenses, setActualExpenses] = useState({});
    const validBudgetEntries = budgetEntries.filter(entry => entry.category && entry.amount);
    const categoryOptions = {
        weekly: ["Groceries", "Restaurant/Takeout", "Home Supplies", "Personal Care", "Transportation", "Entertainment", "Clothing", "Hobbies", "Pets", "Other"]
    };
    const navigate = useNavigate();

    const handleAddEntry = () => {
        let entry = setBudgetEntries([...budgetEntries, {category: '', amount: ''}]);
    };

    const handleRemoveEntry = (index) => {
        const updatedEntries = [...budgetEntries];
        updatedEntries.splice(index, 1);
        setBudgetEntries(updatedEntries);
    };

    const handleInputChange = (index, field, value) => {
        const updatedEntries = [...budgetEntries];
        updatedEntries[index][field] = value;
        setBudgetEntries(updatedEntries);
    };

    const handleBudgetSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = 'user1';
            console.log(budgetEntries);
            const response = await axios.post('http://localhost:8080/api/budget', { userId, budgetEntries });
            alert(response.data.message);
        } catch (error) {
            console.error('Error submitting budgets:', error);
            alert('There was an error submitting your budgets. Please try again.')
        }
    };

    useEffect(() => {
        // Fetch actual expenses from the backend and aggregate by category
        const fetchActualExpenses = async () => {
            try {
                const userId = 'user1'; // Hardcoded user ID for demo purposes.
                const response = await axios.get(`http://localhost:8080/api/expenses/${userId}`);
                const expenses = response.data.expenseEntries;

                // Aggregate expenses by category, ensuring `amount` is treated as a number
                const aggregatedExpenses = expenses.reduce((acc, entry) => {
                    const { category, amount, frequency } = entry;
                    if (frequency === 'daily') { // Only add daily expenses
                        acc[category] = (acc[category] || 0) + Number(amount); // Convert `amount` to a number here
                    }
                    return acc;
                }, {});

                setActualExpenses(aggregatedExpenses);

            } catch (error) {
                console.error('Error fetching actual expenses:', error);
            }
        };

        fetchActualExpenses();
    }, []);

    const emptyData = {
        labels: ['Empty'],
        datasets: [
            {
                label: 'No Data',
                data: [1],
                backgroundColor: ['#e0e0e0']
            }
        ]
    };

    const data = {
        labels: validBudgetEntries.map(entry => entry.category),
        datasets: [
            {
                label: 'Budget',
                data: validBudgetEntries.map(entry => parseFloat(entry.amount)),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] // Need to add more colors
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const category = tooltipItem.label;
                        const budgetedAmount = tooltipItem.raw;
                        const spentAmount = actualExpenses[category] || 0;
                        const remainingAmount = budgetedAmount - spentAmount;

                        return [
                            `Category: ${category}`,
                            `Budgeted: $${budgetedAmount.toLocaleString()}`,
                            `Spent: $${spentAmount.toLocaleString()}`,
                            `Remaining: $${remainingAmount > 0 ? remainingAmount.toLocaleString() : 0}`,
                        ];
                    },
                },
            },
        },
    };

    return (
        <div className='budgetContainer'>
            <h1>Your Weekly Budget</h1>

                <div className='budgetInputDiv'>
                    <form onSubmit={handleBudgetSubmit}>
                        {budgetEntries.map((entry, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                <select
                                    className='select-pt-Cat'
                                    value={entry.category}
                                    onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categoryOptions.weekly.map((category, idx) => (
                                        <option key={idx} value={category}>{category}</option>
                                    ))}
                                </select>
                                <div className='pt_Quant'>
                                    <input
                                        type="number"
                                        placeholder="Amount"
                                        value={entry.amount}
                                        onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                                        required
                                    />
                                </div>

                                {budgetEntries.length > 1 && (
                                    <button className='button type1' type="button" onClick={() => handleRemoveEntry(index)}>
                                        <span className="btn-txt">Remove</span>
                                    </button>
                                )}
                            </div>
                        ))}

                        <button className='button type1' type="button" onClick={handleAddEntry}>
                            <span className="btn-txt">Add Another Budget</span>
                        </button>

                        <button className='button type1' type="submit">
                            <span className="btn-txt">Submit Budget</span>
                        </button>
                    </form>
                </div>
            
            <div className='chartDiv'>
                {validBudgetEntries.length > 0 ? (<Doughnut data={data} options={options} />) : (
                    <Doughnut data={emptyData} />
                )}
            </div>

            <div className='budgetInfoDiv'>
                <p>[BUDGET INFO WILL BE HERE]</p>
            </div>

            {/* Button to return to dashboard without submitting */}
            <button 
                className='button type1'
                type="button" 
                onClick={() => navigate('/')} 
                style={{ marginTop: '20px' }}>
                <span className="btn-txt">Dashboard</span>
            </button>
        </div>
    );

};

export default Budget;
