// Import necessary dependencies and components from React, axios, and react-router-dom
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import './BreakdownExpenses.css';
import { Link } from 'react-router-dom';

// Register Chart.js components needed for charts
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const BreakdownExpenses = () => {
    // Define state variables to store fetched data, selected options, and chart data
    const [actualExpenses, setActualExpenses] = useState({});
    const [allCategories, setAllCategories] = useState([]);
    const [lineChartData, setLineChartData] = useState({});
    const navigate = useNavigate();

    // useEffect hook to fetch expenses data when component mounts
    useEffect(() => {
        const fetchActualExpenses = async () => {
            try {
                const userId = 'user1'; // Set userId to fetch data for
                const response = await axios.get(`http://localhost:8080/api/expenses/${userId}`);
                const expenses = response.data.expenseEntries;

                // Collect unique categories and organize expenses by weekly range
                const categoriesSet = new Set();
                const weeklyCategoryExpenses = expenses.reduce((acc, entry) => {
                    const date = new Date(entry.date);
                    const weekRange = getWeekRange(date);
                    const { category, amount } = entry;

                    categoriesSet.add(category); // Add category to set
    
                    // Initialize week and category if not present
                    if (!acc[weekRange]) {
                        acc[weekRange] = {};
                    }
                    if (!acc[weekRange][category]) {
                        acc[weekRange][category] = 0;
                    }
                    acc[weekRange][category] += Number(amount); // Sum expenses by category
                    return acc;
                }, {});

                // Update state with expenses, categories, and initialize the selected week
                setActualExpenses(weeklyCategoryExpenses);
                setAllCategories([...categoriesSet]);
                setSelectedWeek(Object.keys(weeklyCategoryExpenses)[0]);
                generateLineChartData(expenses); // Prepare line chart data
            } catch (error) {
                console.error('Error fetching actual expenses:', error);
            }
        };

        fetchActualExpenses();
    }, []);

    // Helper function to format date into weekly ranges (e.g., "Week of MM/DD - MM/DD")
    const getWeekRange = (date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
    
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
    
        const startString = startOfWeek.toLocaleDateString();
        const endString = endOfWeek.toLocaleDateString();
    
        return `Week of ${startString} - ${endString}`;
    };  
    
    const [selectedWeek, setSelectedWeek] = useState(Object.keys(actualExpenses)[0] || "");

    // Configuration for bar chart showing category expenses for the selected week
    const barChartData = {
        labels: allCategories,
        datasets: [{
            axis: 'y',
            label: `Expenses for ${selectedWeek}`,
            data: allCategories.map(category => actualExpenses[selectedWeek]?.[category] || 0),
            fill: false,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 120, 90, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(100, 200, 100, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(90, 90, 200, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132)',
                'rgba(255, 120, 90)',
                'rgba(255, 159, 64)',
                'rgba(255, 205, 86)',
                'rgba(100, 200, 100)',
                'rgba(75, 192, 192)',
                'rgba(54, 162, 235)',
                'rgba(90, 90, 200)',
                'rgba(153, 102, 255)',
                'rgba(201, 203, 207)'
            ],
            borderWidth: 1
        }]
    };

    const barChartOptions = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: "Category Breakdown",
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.dataset.label || '';
                        const value = context.raw;  
                        return `${label}: $${value.toFixed(2)}`; 
                    }
                }
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `$${value}`, 
                },
            },
            y: {
                ticks: {
                    autoSkip: false, 
                },
            },
        }
    };

    // Generate line chart data based on daily, weekly, or monthly spending trends
    const generateLineChartData = (expenses) => {
        const dates = expenses.map(exp => new Date(exp.date));
        const daysRange = (Math.max(...dates) - Math.min(...dates)) / (1000 * 3600 * 24);

        const dateSpending = {}; // Store spending by date

        // Sum expenses by date
        expenses.forEach((expense) => {
            const date = new Date(expense.date).toISOString().split('T')[0];
            dateSpending[date] = (dateSpending[date] || 0) + Number(expense.amount);
        });

        let labels = [];
        let data = [];
        
        // Select labels and data depending on date range
        if (daysRange <= 7) { // Daily range
            labels = Object.keys(dateSpending);
            data = Object.values(dateSpending);
        } else if (daysRange <= 30) { // Weekly range
            const weeklySpending = {};
            Object.keys(dateSpending).forEach((date) => {
                const weekRange = getWeekRange(new Date(date));
                weeklySpending[weekRange] = (weeklySpending[weekRange] || 0) + dateSpending[date];
            });
            labels = Object.keys(weeklySpending);
            data = Object.values(weeklySpending);
        } else { // Monthly range
            const monthlySpending = {};
            Object.keys(dateSpending).forEach((date) => {
                const monthYear = new Date(date).toLocaleDateString('default', { year: 'numeric', month: 'long' });
                monthlySpending[monthYear] = (monthlySpending[monthYear] || 0) + dateSpending[date];
            });
            labels = Object.keys(monthlySpending);
            data = Object.values(monthlySpending);
        }

        // Set line chart data in state
        setLineChartData({
            labels,
            datasets: [{
                label: "Total Spending",
                data,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
            }]
        });
    };

    const lineChartOptions = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.raw;
                        return `Total Spending: $${value.toFixed(2)}`; 
                    }
                }
            },
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return `$${value}`; 
                    }
                }
            }
        }
    };

    return (
        <div>
            {/* Main title for the Expenses Breakdown section */}
            <h1>Your Expenses Breakdown</h1>

            <div>
                {/* Subsection for weekly expenses selection */}
                <h2>Weekly Expenses</h2>
                <label>Select a Week: </label>

                {/* Dropdown menu for selecting a specific week from available data */}
                <select onChange={(e) => setSelectedWeek(e.target.value)} value={selectedWeek}>
                    {Object.keys(actualExpenses).map((week, index) => (
                        <option key={index} value={week}>{week}</option>
                    ))}
                </select>
                
                {/* Bar chart displaying expenses by category for the selected week */}
                <Bar data={barChartData} options={barChartOptions} />  
            </div>

            {/* Conditional rendering of line chart if lineChartData is available */}
            {lineChartData.labels && lineChartData.labels.length > 0 && (
                <div style={{ marginTop: '40px' }}>
                    <h2>Spending Trend</h2>

                    {/* Line chart displaying the spending trend over time (daily, weekly, or monthly) */}
                    <Line data={lineChartData} options={lineChartOptions} />
                </div>
            )}

            {/* Button to navigate back to the main dashboard */}
            <button
                className='button type1'
                type="button"
                onClick={() => navigate('/')} // Navigating back to the dashboard on button click
                style={{ marginTop: '20px' }}> {/* Adding margin to the button */}
                <span className="btn-txt">Dashboard</span> {/* Button label */}
            </button>

            {/* Link to the expenses view page */}
            <Link to="/fetch-expenses">
                <button className="button type1">
                    <span className="btn-txt">View Expenses</span>
                </button>
            </Link>
        </div>
    );
};

export default BreakdownExpenses