import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FetchExpenses.css'; 

const FetchExpenses = () => {
    const [weeklyExpenses, setWeeklyExpenses] = useState([]); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const userId = 'user1'; // Hardcoded for demo
                const response = await axios.get(`http://localhost:8080/api/expenses/${userId}`);
                
                const expenses = response.data.expenseEntries;
                const expensesByWeek = groupExpensesByWeek(expenses);
                
                setWeeklyExpenses(expensesByWeek); 
            } catch (error) {
                console.error('Error fetching expenses:', error);
            }
        };

        fetchExpenses();
    }, []);

    const groupExpensesByWeek = (expenses) => {
        const groupedExpenses = {};

        expenses.forEach((expense) => {
            const date = new Date(expense.date);
            const weekRange = getWeekRange(date);

            if (!groupedExpenses[weekRange]) {
                groupedExpenses[weekRange] = Array(7).fill([]).map(() => []); // 7 days, empty arrays for each day
            }

            const dayIndex = date.getDay();
            groupedExpenses[weekRange][dayIndex] = [...groupedExpenses[weekRange][dayIndex], expense];
        });

        return groupedExpenses;
    };

    const getWeekRange = (date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const startString = startOfWeek.toLocaleDateString();
        const endString = endOfWeek.toLocaleDateString();

        return `Week of ${startString} - ${endString}`;
    };

    return (
        <div className="expense-container">
            <h1>Your Weekly Expenses</h1>
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
            <button
                type="button"
                onClick={() => navigate('/')}
                style={{ marginTop: '20px' }}>
                Back to Dashboard
            </button>
        </div>
    );
};

export default FetchExpenses;
