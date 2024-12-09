import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Mode from './Mode';
import './ExpensesDashboard.css';

// Chart.js imports
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const ExpenseDashboard = () => {
    const navigate = useNavigate();

    const [showExpenseInput, setShowExpenseInput] = useState(false);

    const [expenseEntries, setExpenseEntries] = useState([{ name: '', category: '', amount: '', frequency: 'daily' }]);

    const [weeklyExpenses, setWeeklyExpenses] = useState([]);

    const [actualExpenses, setActualExpenses] = useState({});
    const [allCategories, setAllCategories] = useState([]);
    const [lineChartData, setLineChartData] = useState({});
    const [recentIncome, setRecentIncome] = useState(null);
    const [weeklySpendingData, setWeeklySpendingData] = useState([]);
    const [totalExpensesLast4Weeks, setTotalExpensesLast4Weeks] = useState(0);
    const [predictedNextWeekSpend, setPredictedNextWeekSpend] = useState(null);
    const [selectedWeek, setSelectedWeek] = useState("");

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
        daily: ["Groceries", "Restaurant/Takeout", "Home Supplies", "Personal Care", "Transportation", "Entertainment", "Clothing", "Hobbies", "Pets", "Other"],
        monthly: ["Rent/Mortgage", "Subscription", "Utilities", "Other"]
    };

    useEffect(() => {
        const fetchWeeklyExpenses = async () => {
            try {
                const userId = 'user1';
                const response = await axios.get(`http://localhost:8080/api/expenses/${userId}`);
                const expenses = response.data.expenseEntries;
                const expensesByWeek = groupExpensesByWeek(expenses);
                setWeeklyExpenses(expensesByWeek);
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };
        fetchWeeklyExpenses();
    }, []);

    const groupExpensesByWeek = (expenses) => {
        const groupedExpenses = {};
        expenses.forEach((expense) => {
            const rawDate = new Date(expense.date);
            const date = new Date(rawDate.getTime() + rawDate.getTimezoneOffset() * 60000);
            const weekRange = getWeekRange(date);

            if (!groupedExpenses[weekRange]) {
                groupedExpenses[weekRange] = Array(7).fill([]).map(() => []);
            }

            const dayIndex = date.getDay();
            groupedExpenses[weekRange][dayIndex] = [...groupedExpenses[weekRange][dayIndex], expense];
        });
        return groupedExpenses;
    };

    // Reuse same week range function in breakdown
    const getWeekRange = (date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        const startString = startOfWeek.toLocaleDateString();
        const endString = endOfWeek.toLocaleDateString();
        return `${startString} - ${endString}`;
    };

    useEffect(() => {
        const fetchIncome = async () => {
            try {
                const userId = 'user1';
                const response = await axios.get(`http://localhost:8080/api/income/${userId}`);
                const incomeEntries = response.data.incomeEntries;
                if (incomeEntries.length > 0) {
                    const latestIncome = incomeEntries[0].amount;
                    setRecentIncome(latestIncome);
                }
            } catch (error) {
                console.error('Error fetching income:', error);
            }
        };
        fetchIncome();
    }, []);

    useEffect(() => {
        const fetchActualExpenses = async () => {
            try {
                const userId = 'user1';
                const response = await axios.get(`http://localhost:8080/api/expenses/${userId}`);
                const expenses = response.data.expenseEntries;

                const categoriesSet = new Set();
                const weeklyCategoryExpenses = expenses.reduce((acc, entry) => {
                    const rawDate = new Date(entry.date);
                    const date = new Date(rawDate.getTime() + rawDate.getTimezoneOffset() * 60000);
                    const weekRange = getWeekRange(date);
                    const { category, amount } = entry;
                    categoriesSet.add(category);
                    if (!acc[weekRange]) {
                        acc[weekRange] = {};
                    }
                    if (!acc[weekRange][category]) {
                        acc[weekRange][category] = 0;
                    }
                    acc[weekRange][category] += Number(amount);
                    return acc;
                }, {});

                setActualExpenses(weeklyCategoryExpenses);
                setAllCategories([...categoriesSet]);
                const firstWeek = Object.keys(weeklyCategoryExpenses)[0];
                if (firstWeek) setSelectedWeek(firstWeek);
                generateLineChartData(expenses);
                setWeeklySpendingData(generateWeeklySpending(expenses));
            } catch (error) {
                console.error('Error fetching actual expenses:', error);
            }
        };
        if (recentIncome !== null) fetchActualExpenses();
    }, [recentIncome]);

    useEffect(() => {
        const totalExpenses = weeklySpendingData.reduce((total, item) => total + item.amount, 0);
        setTotalExpensesLast4Weeks(totalExpenses);
    }, [weeklySpendingData]);

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

        const recentWeeks = Object.keys(lastFourWeeks).slice(-4);
        return recentWeeks.map((week) => ({ week, amount: lastFourWeeks[week] }));
    };

    const generateLineChartData = (expenses) => {
        const dates = expenses.map(exp => new Date(exp.date));
        const daysRange = (Math.max(...dates) - Math.min(...dates)) / (1000 * 3600 * 24);

        const dateSpending = {};
        expenses.forEach((expense) => {
            const date = new Date(expense.date).toISOString().split('T')[0];
            dateSpending[date] = (dateSpending[date] || 0) + Number(expense.amount);
        });

        let labels = [];
        let data = [];

        if (daysRange <= 7) {
            labels = Object.keys(dateSpending);
            data = Object.values(dateSpending);
        } else if (daysRange <= 28) {
            const weeklySpending = {};
            Object.keys(dateSpending).forEach((date) => {
                const weekRange = getWeekRange(new Date(date));
                weeklySpending[weekRange] = (weeklySpending[weekRange] || 0) + dateSpending[date];
            });
            labels = Object.keys(weeklySpending);
            data = Object.values(weeklySpending);
        } else {
            const monthlySpending = {};
            Object.keys(dateSpending).forEach((date) => {
                const monthYear = new Date(date).toLocaleDateString('default', { year: 'numeric', month: 'long' });
                monthlySpending[monthYear] = (monthlySpending[monthYear] || 0) + dateSpending[date];
            });
            labels = Object.keys(monthlySpending);
            data = Object.values(monthlySpending);
        }

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

    useEffect(() => {
        const fetchPrediction = async () => {
            try {
                const userId = 'user1';
                const response = await axios.get(`http://localhost:8080/api/receive-expenses/${userId}`);
                const { predicted_next_week_spend } = response.data;
                setPredictedNextWeekSpend(predicted_next_week_spend);
            } catch (error) {
                console.error('Error fetching spending prediction:', error);
            }
        };
        fetchPrediction();
    }, []);

    const comparisonChartData = {
        labels: ['Total Expenses (Last 4 Weeks)', 'Income'],
        datasets: [
            {
                label: 'Amount',
                data: [totalExpensesLast4Weeks, recentIncome],
                backgroundColor: [
                    'rgba(55, 219, 238, 0.66)',
                    totalExpensesLast4Weeks < recentIncome
                        ? 'rgba(75, 192, 75, 0.7)'
                        : totalExpensesLast4Weeks > recentIncome
                            ? 'rgba(255, 99, 132, 0.7)'
                            : 'rgba(248, 248, 30, 0.69)'
                ],
                borderColor: [
                    'rgba(55, 219, 238, 0.66)',
                    totalExpensesLast4Weeks < recentIncome
                        ? 'rgba(75, 192, 75, 1)'
                        : totalExpensesLast4Weeks > recentIncome
                            ? 'rgba(255, 99, 132, 1)'
                            : 'rgba(248, 248, 30, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const comparisonChartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false },
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
            y: {
                beginAtZero: true,
                ticks: { callback: (value) => `$${value}` },
            },
        },
    };

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
            legend: { position: 'top' },
            title: { display: true, text: "Category Breakdown" },
            tooltip: {
                callbacks: {
                    label: function (context) {
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
                ticks: { autoSkip: false },
            },
        }
    };

    const lineChartOptions = {
        responsive: true,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        return `Total Spending: $${value.toFixed(2)}`;
                    }
                }
            },
            legend: { position: 'top' },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return `$${value}`;
                    }
                }
            }
        }
    };

    const toggleForm = () => {
        setShowExpenseInput((prev) => !prev);
      };

    return (
        <div>
        <h1>Expenses Dashboard</h1>

            {/* FetchExpenses Section */}
            <section className="expense-container">
                <h2>Your Weekly Expenses</h2>
                {Object.keys(weeklyExpenses).length > 0 ? (
                    Object.entries(weeklyExpenses).map(([weekRange, weekEntries], index) => (
                        <div key={index} className="weekly-expenses">
                            <h2>{weekRange}</h2>
                            <div className="week-grid">
                                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, dayIndex) => (
                                    <div key={dayIndex} className="day-column">
                                        <h3>{day}</h3>
                                        {weekEntries[dayIndex].length > 0 ? (
                                            <ul>
                                                {weekEntries[dayIndex].map((entry, entryIndex) => (
                                                    <li key={entryIndex}>
                                                        {entry.category}: ${entry.amount}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No expenses</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No expense data available.</p>
                )}
                
            </section>

            {/* BreakdownExpenses Section */}
            <section>
                <h2>Your Expenses Breakdown</h2>
                <div className='charts-container'>
                    <div className='comparison-container' style={{ marginTop: '40px' }}>
                        <h2>Total Expenses vs Income</h2>
                        <Bar data={comparisonChartData} options={comparisonChartOptions} />
                        {
                            totalExpensesLast4Weeks < recentIncome ? (
                                <p>You're in good standing!</p>
                            ) : totalExpensesLast4Weeks > recentIncome ? (
                                <p>You're spending <span>${(totalExpensesLast4Weeks - recentIncome).toFixed(2)}</span> more than your monthly income.</p>
                            ) : (
                                <p>Your spending matches your income exactly.</p>
                            )
                        }
                    </div>

                    <div className='category-container'>
                        <h2>Weekly Expenses</h2>
                        <label>Select a Week: </label>
                        <select onChange={(e) => setSelectedWeek(e.target.value)} value={selectedWeek}>
                            {Object.keys(actualExpenses).map((week, index) => (
                                <option key={index} value={week}>{week}</option>
                            ))}
                        </select>

                        <Bar data={barChartData} options={barChartOptions} />
                    </div>

                    <div className='trend-container'>
                        {lineChartData.labels && lineChartData.labels.length > 0 && (
                            <div style={{ marginTop: '-10px' }}>
                                <h2>Spending Trend</h2>
                                <Line data={lineChartData} options={lineChartOptions} />
                            </div>
                        )}
                    </div>

                    <div className='prediction-container'>
                        {predictedNextWeekSpend !== null ? (
                            <p>
                                From your expenses, BudgetMate predicts that you will spend around
                                <strong> ${predictedNextWeekSpend.toFixed(0)}</strong> next week.
                            </p>
                        ) : (
                            <p>Loading prediction...</p>
                        )}
                    </div>
                </div>

                <div className='expense-form-container'>

                {/* ExpenseInput Section */}
                <section>
                    <h2 onClick={toggleForm} >Enter Your Expenses</h2>
                    {/* Toggle button (optional) */}
                    {showExpenseInput && (
                    <form onSubmit={handleExpenseSubmit}>
                        {expenseEntries.map((entry, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                <div className='pt_Cat'>
                                    <input
                                        type="text"
                                        placeholder="Expense Name"
                                        value={entry.name}
                                        onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                        required
                                        className="input-field category-field"
                                    />
                                </div>
                                <select
                                    className='select-pt-Cat'
                                    value={entry.frequency}
                                    onChange={(e) => handleInputChange(index, 'frequency', e.target.value)}
                                >
                                    <option value="daily">Daily</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                                <select
                                    className='select-pt-Cat'
                                    value={entry.category}
                                    onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categoryOptions[entry.frequency].map((category, idx) => (
                                        <option key={idx} value={category}>{category}</option>
                                    ))}
                                </select>
                                <div className='pt_Quant'>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Amount"
                                        value={entry.amount}
                                        onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                                        required
                                        className="input-field amount-fields"
                                    />
                                </div>
                                {expenseEntries.length > 1 && (
                                    <button className="removeButton" type="button" onClick={() => handleRemoveEntry(index)}>
                                        <span className='btn-txt' >Remove</span>
                                    </button>
                                )}
                            </div>
                        ))}
                        <button className="button type1" type="button" onClick={handleAddEntry}>
                            <span className="btn-txt">Add Expense</span>
                        </button>
                        <button className="button type1" type="submit">
                            <span className="btn-txt">Submit Expenses</span>
                        </button>
                    </form>
                    )}

                    <button
                        className='help-button'
                        onClick={() => navigate('/help')}
                    >
                        <span className='btn-txt'>Help</span>
                    </button>
                </section>
            </div>

                <button
                    className='button type1'
                    type="button"
                    onClick={() => navigate('/')}
                    style={{ marginTop: '20px' }}
                >
                    <span className="btn-txt">Dashboard</span>
                </button>

            </section>

            <Mode />
        </div>
    );
};

export default ExpenseDashboard;
