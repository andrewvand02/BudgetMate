import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Budget.css';

// Registering necessary chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

const Budget = () => {
    // State for storing budget entries and actual expenses
    const [budgetEntries, setBudgetEntries] = useState([{ category: '', amount: '' }]); // Array of budget entries
    const [actualExpenses, setActualExpenses] = useState({}); // Object to store actual expenses by category
    const [selectedCategory, setSelectedCategory] = useState(null); // Added useState for selectedCategory
    const validBudgetEntries = budgetEntries.filter(entry => entry.category && entry.amount); // Filter valid entries with both category and amount
    const [minimizeInputSection, setMinimizeInputSection] = useState(false); // State to toggle visibility of the input section
    const [isDarkMode, setIsDarkMode] = useState(false); // State to manage dark mode styling
    const navigate = useNavigate(); // Hook for navigating programmatically

    // List of available budget categories
    const categoryOptions = {
        weekly: ["Groceries", "Restaurant/Takeout", "Home Supplies", "Personal Care", "Transportation", "Entertainment", "Clothing", "Hobbies", "Pets", "Other"]
    };

    // Handler to add a new budget entry input field
    const handleAddEntry = () => {
        setBudgetEntries([...budgetEntries, { category: '', amount: '' }]); // Append a new empty entry to the array
    };

    // Handler to remove a budget entry
    const handleRemoveEntry = (index) => { 
        const updatedEntries = [...budgetEntries]; // Copy the current entries
        updatedEntries.splice(index, 1); // Remove the entry at the specified index
        setBudgetEntries(updatedEntries); // Update state with the new entries array
    };

    // Handler for input changes in budget entries
    const handleInputChange = (index, field, value) => {
        const updatedEntries = [...budgetEntries]; // Copy current entries
        updatedEntries[index][field] = value; // Update the specified field (category or amount)
        setBudgetEntries(updatedEntries); // Update state with modified entries
    };

    // Handler for submitting budget data to the server
    const handleBudgetSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const userId = 'user1'; // Hardcoded user ID
            const response = await axios.post('http://localhost:8080/api/budget', { userId, budgetEntries }); // POST request to server with budget data
            alert(response.data.message); // Alert the user with response message
            setMinimizeInputSection(true); // Minimize the input section after submission
        } catch (error) {
            console.error('Error submitting budgets:', error); // Log error to the console
            alert('There was an error submitting your budgets. Please try again.'); // Display error message to user
        }
    };

    // Fetch actual expenses from server and filter by current week
    useEffect(() => {
        const fetchActualExpenses = async () => {
            try {
                const userId = 'user1'; // Hardcoded user ID
                const response = await axios.get(`http://localhost:8080/api/expenses/${userId}`); // GET request to fetch expenses
                const expenses = response.data.expenseEntries; // Extract expense entries from response
    
                // Get today's date
                const today = new Date();
    
                // Get the current day of the week (0 for Sunday, 6 for Saturday)
                const currentDayOfWeek = today.getDay();
    
                // Calculate the start of the week (Sunday)
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - currentDayOfWeek); // Set to last Sunday
    
                // Calculate the end of the week (Saturday)
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to next Saturday
    
                // Filter expenses that are within the current week
                const filteredExpenses = expenses.filter((entry) => {
                    const entryDate = new Date(entry.date); // Convert entry date to Date object
                    return (
                        entry.frequency === 'daily' &&
                        entryDate >= startOfWeek && entryDate <= endOfWeek
                    );
                });
    
                // Aggregate the filtered expenses by category
                const aggregatedExpenses = filteredExpenses.reduce((acc, entry) => {
                    const { category, amount } = entry;
                    acc[category] = (acc[category] || 0) + Number(amount); // Accumulate total amount per category
                    return acc;
                }, {});
    
                setActualExpenses(aggregatedExpenses); // Update state with aggregated expenses
            } catch (error) {
                console.error('Error fetching actual expenses:', error); // Log error to the console
            }
        };
    
        fetchActualExpenses(); // Call the function to fetch expenses on component mount
    }, []); 

    // Fetch budget entries from the server
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

    // Data for Doughnut chart
    const data = {
        labels: validBudgetEntries.map(entry => entry.category), // Use category names as labels
        datasets: [
            {
                label: 'Budget',
                data: validBudgetEntries.map(entry => parseFloat(entry.amount)), // Use amounts for data points
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] // Define colors for each segment
            },
        ],
    };

    // Options for Doughnut chart with custom tooltip
    const options = {
        plugins: {
            tooltip: {
                enabled: false,
            },// Disable default tooltips
        },
        onClick: (event, chartElement) => {
            console.log("Chart clicked:", chartElement); // Add this to see if an element is detected
    
            if (chartElement && chartElement.length > 0) { // Check that chartElement is defined
                const index = chartElement[0].index;
                const category = data.labels[index];
                const budgetedAmount = data.datasets[0].data[index];
                const spentAmount = actualExpenses[category] || 0;
                const remainingAmount = budgetedAmount - spentAmount;
                const exceededBudget = spentAmount - budgetedAmount;

                /* // Notify user if they execeed/reached the budget
                if (spentAmount > budgetedAmount) {
                    alert(`You have exceeded your budget for ${category}. You have spent $${exceededBudget} over.`)
                };

                if (spentAmount == budgetedAmount) {
                    alert(`You have reached your budget for ${category}.`)
                };
                */
    
                // Set selected category with budget details
                setSelectedCategory({
                    category,
                    budgetedAmount: budgetedAmount.toLocaleString(),
                    spentAmount: spentAmount.toLocaleString(),
                    remainingAmount: remainingAmount > 0 ? remainingAmount.toLocaleString() : remainingAmount,
                    exceededBudget, 
                });
            } else {
                setSelectedCategory(null); // Clear selected category if clicked outside
            }
 
        },
    };
    

    return (
        <div className="budgetContainer">
            <h1>Your Weekly Budget</h1>

            {/* Toggle button for budget input section */}
            <button 
                onClick={() => setMinimizeInputSection(!minimizeInputSection)}
                style={{ marginBottom: '10px'}}
                className={isDarkMode ? 'dark' : 'light'}
            >   
                {minimizeInputSection ? 'Show Budget Input' : 'Hide Budget Input'}
            </button>

            {/* Budget input section */}
            {!minimizeInputSection && (
                <div className="budgetInputDiv">
                    <form onSubmit={handleBudgetSubmit}>
                        {budgetEntries.map((entry, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                {/* Category selection dropdown */}
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
                                
                                {/* Budget amount input */}
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Amount"
                                    value={entry.amount}
                                    onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                                    required
                                />

                                {/* Remove entry button */}
                                {budgetEntries.length > 1 && (
                                    <button type="button" onClick={() => handleRemoveEntry(index)} className={isDarkMode ? 'dark' : 'light'}>
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}

                        {/* Add and submit budget buttons */}
                        <button type="button" onClick={handleAddEntry} className={isDarkMode ? 'dark' : 'light'}>
                            Add Another Budget
                        </button>

                        <button type="submit" className={isDarkMode ? 'dark' : 'light'}>
                            Submit Budget
                        </button>
                    </form>
                </div>
            )}

            {/* Doughnut chart displaying budget data */}
            <div style={{ display: 'flex', marginTop: '20px' }}>
                <Doughnut className="doughnut" data={data} options={options} />

                {/* Tooltip showing selected category details */}
                {selectedCategory && (
                    <div className={`tooltip ${isDarkMode ? 'dark' : 'light' }`}>
                        <p><strong>Category:</strong> {selectedCategory.category}</p>
                        <p><strong>Budgeted:</strong> ${selectedCategory.budgetedAmount}</p>
                        {/* Check if the user's expenses exceed their budget, use CSS to notify user by adding a red dot next to 'Spent' */}
                        <p className="spent-amount">
                            <strong>Spent:</strong> ${selectedCategory.spentAmount}
                            {selectedCategory.exceededBudget > 0 && (
                                <span className="exceeded-budget-indicator"></span>
                            )}
                        </p>
                        <p><strong>Remaining:</strong> ${selectedCategory.remainingAmount}</p>
                    </div>
                )}
            </div>

            {/* Button to navigate back to Dashboard */}
            <button
                type="button"
                className={isDarkMode ? 'dark' : 'light'}
                onClick={() => navigate('/')}
                style={{ marginTop: '20px' }}
            >
                Back to Dashboard
            </button>
        </div>
    );
};

export default Budget;