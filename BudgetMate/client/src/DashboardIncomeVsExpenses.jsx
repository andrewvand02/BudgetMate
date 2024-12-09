// Import necessary dependencies and components from React, axios, and react-router-dom
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import './DashboardIncomeVsExpenses.css';

// Register Chart.js components needed for charts
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const IncomeVsExpenses = () => {
    // Define state variables to store fetched data, selected options, and chart data
    const [actualExpenses, setActualExpenses] = useState({}); // Stores the weekly categorized expenses
    const [allCategories, setAllCategories] = useState([]); // List of all unique expense categories 
    const [lineChartData, setLineChartData] = useState({}); // Data for the line chart visualization
    const [recentIncome, setRecentIncome] = useState(null);            // Stores the most recent income amount
    const [weeklySpendingData, setWeeklySpendingData] = useState([]);  // Stores spending data for each of the last 4 weeks
    const [totalExpensesLast4Weeks, setTotalExpensesLast4Weeks] = useState(0);  // Stores total expenses for the last 4 weeks
    const [predictedNextWeekSpend, setPredictedNextWeekSpend] = useState(null); // Declare state to store next week's spending prediction
    const navigate = useNavigate(); // Hook for redirecting to different routes

    // useEffect hook to fetch income data, get the most recent income entry
    useEffect(() => {
        const fetchIncome = async () => {
            try {
                const userId = 'user1';
                const response = await axios.get(`http://localhost:8080/api/income/${userId}`);
                const incomeEntries = response.data.incomeEntries;

                // Log the income entries to verify what's being fetched
                console.log("Fetched income entries:", incomeEntries);

                // Find the most recent income entry based on the date
                if (incomeEntries.length > 0) {
                    const latestIncome = incomeEntries[0].amount; // Get the latest Income, which is the first and only income entry
                    setRecentIncome(latestIncome);
                    console.log("Latest income amount:", latestIncome);
                }
            } catch (error) {
                console.error('Error fetching income:', error);
            }
        };

        fetchIncome();
    }, []);

    // useEffect hook to fetch expenses data when component mounts
    useEffect(() => {
        const fetchActualExpenses = async () => {
            try {
                const userId = 'user1'; // Set userId to fetch data for
                const response = await axios.get(`http://localhost:8080/api/expenses/${userId}`); // Fetch expenses data from the API
                const expenses = response.data.expenseEntries; // Extract expense entries from the API response

                // Collect unique categories and organize expenses by weekly range
                const categoriesSet = new Set();
                // Initialize an object to accumulate weekly categorized expenses
                const weeklyCategoryExpenses = expenses.reduce((acc, entry) => {
                    const rawDate = new Date(entry.date); // Convert the entry date to a Date object
                    const date = new Date(rawDate.getTime() + rawDate.getTimezoneOffset() * 60000);
                    const weekRange = getWeekRange(date); // Get the formatted week range for the date
                    const { category, amount } = entry; // Destructure category and amount from the entry

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
                setAllCategories([...categoriesSet]); // Convert the Set to an array
                setSelectedWeek(Object.keys(weeklyCategoryExpenses)[0]); // Set the first week as the default selection
                generateLineChartData(expenses); // Prepare line chart data
                setWeeklySpendingData(generateWeeklySpending(expenses));
            } catch (error) {
                console.error('Error fetching actual expenses:', error); // Log any errors to the console
            }
        };

        // Fetch expenses if recentIncome is set
        if (recentIncome !== null) fetchActualExpenses();
    }, [recentIncome]);

    // Update total expenses whenever weeklySpendingData changes
    useEffect(() => {
        const totalExpenses = weeklySpendingData.reduce(
            (total, item) => total + item.amount,
            0
        );
        setTotalExpensesLast4Weeks(totalExpenses);
    }, [weeklySpendingData]);

    // Helper function to format date into weekly ranges (e.g., "Week of MM/DD - MM/DD")
    const getWeekRange = (date) => {
        const startOfWeek = new Date(date); // Create a new Date object for the start of the week
        startOfWeek.setDate(date.getDate() - date.getDay()); // Set to the start of the week (Sunday)
    
        const endOfWeek = new Date(startOfWeek); // Create a new Date object for the end of the week
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to the end of the week (Saturday)
        
        // Format the start and end dates as strings
        const startString = startOfWeek.toLocaleDateString();
        const endString = endOfWeek.toLocaleDateString();
    
        return `${startString} - ${endString}`; // Return the formatted week range
    };  

    const generateWeeklySpending = (expenses) => {
        const dateSpending = {};
        expenses.forEach((expense) => {
            const date = new Date(expense.date).toISOString().split('T')[0];
            dateSpending[date] = (dateSpending[date] || 0) + Number(expense.amount);
        });

        const lastFourWeeks = {};
        Object.keys(dateSpending).forEach((date) => {
            const weekRange = getWeekRange(new Date(date));
            lastFourWeeks[weekRange] = (lastFourWeeks[weekRange] || 0) + dateSpending[date];
        });

        // Limit to the last 4 weeks
        const recentWeeks = Object.keys(lastFourWeeks).slice(-4);
        return recentWeeks.map((week) => ({ week, amount: lastFourWeeks[week] }));
    };

    // Data and configuration for the "Total Expenses vs Income" bar chart
    const comparisonChartData = {
        labels: ['Total Expenses', 'Income'],
        datasets: [
            {
                label: 'Amount',
                data: [totalExpensesLast4Weeks, recentIncome],
                backgroundColor: [
                    'rgba(55, 219, 238, 0.66)', // Blue for expenses
                    totalExpensesLast4Weeks < recentIncome 
                        ? 'rgba(75, 192, 75, 0.7)' // Green if in good standing
                        : totalExpensesLast4Weeks > recentIncome
                            ? 'rgba(255, 99, 132, 0.7)' // Red if overspending
                            : 'rgba(248, 248, 30, 0.69)' // Yellow if total expenses are equal to income
                ],
                borderColor: [
                    'rgba(55, 219, 238, 0.66)',
                    totalExpensesLast4Weeks < recentIncome 
                        ? 'rgba(75, 192, 75, 1)' 
                        : totalExpensesLast4Weeks > recentIncome
                            ? 'rgba(255, 99, 132, 1)'
                            : 'rgba(248, 248, 30, 1)' // Yellow border if equal
                ],
                borderWidth: 1,
            },
        ],
    };

    const comparisonChartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: $${value.toFixed(2)}`;
                    },
                },
            },
        },
        scales: {
            x: {
                display: false
            },
            y: {
                beginAtZero: true,
                ticks: { callback: (value) => `$${value}` },
            },
        },
    };
    
    const [selectedWeek, setSelectedWeek] = useState(Object.keys(actualExpenses)[0] || ""); // State for the currently selected week

    // Configuration for bar chart showing category expenses for the selected week
    const barChartData = {
        labels: allCategories, // Labels are the unique expense categories
        datasets: [{
            axis: 'y', // Display bars horizontally
            label: `Expenses for ${selectedWeek}`, // Dynamic label showing the selected week
            data: allCategories.map(category => actualExpenses[selectedWeek]?.[category] || 0), // Expense data for each category
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
            ], // Array of background colors for the bars
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
            ], // Array of border colors for the bars
            borderWidth: 1 // Border width for the bars
        }]
    };

    // Generate line chart data based on daily, weekly, or monthly spending trends
    const generateLineChartData = (expenses) => {
        const dates = expenses.map(exp => new Date(exp.date)); // Extract dates from expenses and convert them to Date objects
        const daysRange = (Math.max(...dates) - Math.min(...dates)) / (1000 * 3600 * 24); // Calculate the date range in days (difference between max and min dates)

        const dateSpending = {}; // Store spending by date

        // Sum expenses by date
        expenses.forEach((expense) => {
            const date = new Date(expense.date).toISOString().split('T')[0];
            dateSpending[date] = (dateSpending[date] || 0) + Number(expense.amount);
        });

        let labels = []; // Array for chart labels
        let data = []; // Array for chart data
        
        // Select labels and data depending on date range
        if (daysRange <= 7) { // Daily range
            labels = Object.keys(dateSpending); // Use dates as labels
            data = Object.values(dateSpending); // Use spending amounts as data
        } else if (daysRange <= 28) { // Weekly range
            const weeklySpending = {}; // Object to store accumulated spending by week
            Object.keys(dateSpending).forEach((date) => { // Aggregate spending by weekly range
                const weekRange = getWeekRange(new Date(date)); // Get formatted week range
                weeklySpending[weekRange] = (weeklySpending[weekRange] || 0) + dateSpending[date]; // Sum weekly spending
            });
            labels = Object.keys(weeklySpending); // Use weekly ranges as labels
            data = Object.values(weeklySpending); // Use aggregated weekly spending as data
        } else { // Monthly range
            const monthlySpending = {}; // Object to store accumulated spending by month
            Object.keys(dateSpending).forEach((date) => { // Aggregate spending by month
                const monthYear = new Date(date).toLocaleDateString('default', { year: 'numeric', month: 'long' }); // Format as 'Month Year'
                monthlySpending[monthYear] = (monthlySpending[monthYear] || 0) + dateSpending[date]; // Sum monthly spending
            });
            labels = Object.keys(monthlySpending); // Use months as labels
            data = Object.values(monthlySpending); // Use aggregated monthly spending as data
        }

        // Set line chart data in state
        setLineChartData({
            labels, // Set the labels (dates, weeks, or months)
            datasets: [{
                label: "Total Spending", // Dataset label
                data, // Set the data (spending amounts)
                fill: false, // Do not fill the area under the line
                borderColor: 'rgba(75, 192, 192, 1)', // Line color
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Point background color
                tension: 0.1, // Set line tension for a smoother curve
            }]
        });
    };

    // Check if there is no expense data
    const isDataEmpty = Object.keys(actualExpenses).length === 0;

    return (
        <div>
            <div className='dashboard-comparison-container'>
                {/* Conditionally render the message if no expense data is available */}
                {isDataEmpty ? (
                    <p>No expense data available</p>
                ) : (
                    <Bar data={comparisonChartData} options={comparisonChartOptions} />
                )}

                {/* Conditional message based on spending standing 
                {
                    totalExpensesLast4Weeks < recentIncome ? (
                        <p style={{ fontSize: '16px' }}>You're in good standing!</p>
                    ) : totalExpensesLast4Weeks > recentIncome ? (
                        <p style={{ fontSize: '16px' }}>You're spending <span>${(totalExpensesLast4Weeks - recentIncome).toFixed(2)}</span> more than your monthly income.</p>
                    ) : null
                }*/}
            </div>
        </div>
    );
};

export default IncomeVsExpenses
