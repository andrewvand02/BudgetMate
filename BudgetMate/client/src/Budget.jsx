import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

const Budget = () => {
    const [budgetEntries, setBudgetEntries] = useState([{ category: '', amount: '' }]);
    const [actualExpenses, setActualExpenses] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null); // Added useState for selectedCategory
    const validBudgetEntries = budgetEntries.filter(entry => entry.category && entry.amount);

    const categoryOptions = {
        weekly: ["Groceries", "Restaurant/Takeout", "Home Supplies", "Personal Care", "Transportation", "Entertainment", "Clothing", "Hobbies", "Pets", "Other"]
    };
    const navigate = useNavigate();

    const handleAddEntry = () => {
        setBudgetEntries([...budgetEntries, { category: '', amount: '' }]);
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
            const response = await axios.post('http://localhost:8080/api/budget', { userId, budgetEntries });
            alert(response.data.message);
        } catch (error) {
            console.error('Error submitting budgets:', error);
            alert('There was an error submitting your budgets. Please try again.');
        }
    };

    useEffect(() => {
        const fetchActualExpenses = async () => {
            try {
                const userId = 'user1';
                const response = await axios.get(`http://localhost:8080/api/expenses/${userId}`);
                const expenses = response.data.expenseEntries;

                const aggregatedExpenses = expenses.reduce((acc, entry) => {
                    const { category, amount, frequency } = entry;
                    if (frequency === 'daily') {
                        acc[category] = (acc[category] || 0) + Number(amount);
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

    useEffect(() => {
        const fetchBudgetInfo = async () => {
            try {
                const userId = 'user1';
                const response = await axios.get(`http://localhost:8080/api/budget/${userId}`);
                setBudgetEntries(response.data.budgetEntries);
            } catch (error) {
                console.error('Error fetching budget info:', error);
            }
        };

        fetchBudgetInfo();
    }, []);

    const data = {
        labels: validBudgetEntries.map(entry => entry.category),
        datasets: [
            {
                label: 'Budget',
                data: validBudgetEntries.map(entry => parseFloat(entry.amount)),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                enabled: false,
            },
        },
        onClick: (event, chartElement) => {
            console.log("Chart clicked:", chartElement); // Add this to see if an element is detected
    
            if (chartElement && chartElement.length > 0) { // Check that chartElement is defined
                const index = chartElement[0].index;
                const category = data.labels[index];
                const budgetedAmount = data.datasets[0].data[index];
                const spentAmount = actualExpenses[category] || 0;
                const remainingAmount = budgetedAmount - spentAmount;
    
                setSelectedCategory({
                    category,
                    budgetedAmount: budgetedAmount.toLocaleString(),
                    spentAmount: spentAmount.toLocaleString(),
                    remainingAmount: remainingAmount > 0 ? remainingAmount.toLocaleString() : 0,
                });
            } else {
                setSelectedCategory(null);
            }
 
        },
    };
    

    return (
        <div className="budgetContainer">
            <h1>Your Weekly Budget</h1>

            <div className="budgetInputDiv">
                <form onSubmit={handleBudgetSubmit}>
                    {budgetEntries.map((entry, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            <select
                                value={entry.category}
                                onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                                required
                            >
                                <option value="">Select Category</option>
                                {categoryOptions.weekly.map((category, idx) => (
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

                            {budgetEntries.length > 1 && (
                                <button type="button" onClick={() => handleRemoveEntry(index)}>
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}

                    <button type="button" onClick={handleAddEntry}>
                        Add Another Budget
                    </button>

                    <button type="submit">
                        Submit Budget
                    </button>
                </form>
            </div>

            <div style={{ display: 'flex', marginTop: '20px' }}>
                <Doughnut data={data} options={options} />

                {selectedCategory && (
                    <div style={{ marginLeft: '20px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                        <p><strong>Category:</strong> {selectedCategory.category}</p>
                        <p><strong>Budgeted:</strong> ${selectedCategory.budgetedAmount}</p>
                        <p><strong>Spent:</strong> ${selectedCategory.spentAmount}</p>
                        <p><strong>Remaining:</strong> ${selectedCategory.remainingAmount}</p>
                    </div>
                )}
            </div>

            <button
                type="button"
                onClick={() => navigate('/')}
                style={{ marginTop: '20px' }}
            >
                Back to Dashboard
            </button>
        </div>
    );
};

export default Budget;
