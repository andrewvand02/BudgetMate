import React, { useState, useEffect } from 'react'; // Importing React, useState, and useEffect hooks.
import axios from 'axios'; // Importing axios to handle HTTP requests.
import { useNavigate } from 'react-router-dom'; // Importing useNavigate from react-router-dom for navigation.
import './FetchExpenses.css'; // Importing CSS file for styling.

import { Link } from 'react-router-dom';

const FetchExpenses = () => {
    // State to hold expenses grouped by week.
    const [weeklyExpenses, setWeeklyExpenses] = useState([]);
    const navigate = useNavigate(); // Getting the navigate function to programmatically change routes.

    useEffect(() => {
        // Function to fetch expenses from the server.
        const fetchExpenses = async () => {
            try {
                const userId = 'user1'; // Hardcoded user ID for demo purposes.
                // Fetching expense data for the user from the backend.
                const response = await axios.get(`http://localhost:8080/api/expenses/${userId}`);
                
                const expenses = response.data.expenseEntries; // Getting the array of expense entries from response data.
                const expensesByWeek = groupExpensesByWeek(expenses); // Grouping expenses by week.
                
                setWeeklyExpenses(expensesByWeek); // Storing the grouped expenses in state.
            } catch (error) {
                // Logging any errors that occur during fetch.
                console.error('Error fetching expenses:', error);
            }
        };

        fetchExpenses(); // Calling fetch function when component mounts.
    }, []);

    // Helper function to group expenses by week.
    const groupExpensesByWeek = (expenses) => {
        const groupedExpenses = {}; // Object to hold expenses by week.

        expenses.forEach((expense) => {
            const date = new Date(expense.date); // Creating a Date object from the expense date.
            const weekRange = getWeekRange(date); // Getting the week range string for the date.

            // Initializing the week range if not already present, with empty arrays for each day.
            if (!groupedExpenses[weekRange]) {
                groupedExpenses[weekRange] = Array(7).fill([]).map(() => []);
            }

            const dayIndex = date.getDay(); // Getting the day of the week (0 = Sunday, 6 = Saturday).
            // Adding the expense to the appropriate day in the week.
            groupedExpenses[weekRange][dayIndex] = [...groupedExpenses[weekRange][dayIndex], expense];
        });

        return groupedExpenses; // Returning the grouped expenses object.
    };

    // Helper function to get the date range for the week of a given date.
    const getWeekRange = (date) => {
        const startOfWeek = new Date(date); // Copying the original date.
        startOfWeek.setDate(date.getDate() - date.getDay()); // Setting start date to the previous Sunday.
        
        const endOfWeek = new Date(startOfWeek); // Copying the start date.
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Setting end date to the following Saturday.

        const startString = startOfWeek.toLocaleDateString(); // Converting start date to a string.
        const endString = endOfWeek.toLocaleDateString(); // Converting end date to a string.

        return `Week of ${startString} - ${endString}`; // Returning a string representation of the week range.
    };

    return (
        <div className="expense-container"> {/* Main container for the FetchExpenses component */}
            <h1>Your Weekly Expenses</h1> {/* Heading for the weekly expenses display */}
            {Object.keys(weeklyExpenses).length > 0 ? ( // Checking if there are weekly expenses to display
                Object.entries(weeklyExpenses).map(([weekRange, weekEntries], index) => ( // Mapping over weekly expenses entries
                    <div key={index} className="weekly-expenses"> {/* Container for a single week's expenses */}
                        <h2>{weekRange}</h2> {/* Displaying the week range */}
                        <div className="week-grid"> {/* Container for grid layout of daily expenses */}
                            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, dayIndex) => ( // Mapping over each day of the week
                                <div key={dayIndex} className="day-column"> {/* Container for a single day */}
                                    <h3>{day}</h3> {/* Displaying the name of the day */}
                                    {weekEntries[dayIndex].length > 0 ? ( // Checking if there are expenses for this day
                                        <ul> {/* Unordered list to display expenses for the day */}
                                            {weekEntries[dayIndex].map((entry, entryIndex) => ( // Mapping over entries for the day
                                                <li key={entryIndex}> {/* List item for each expense entry */}
                                                    {entry.category}: ${entry.amount} {/* Displaying category and amount */}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No expenses</p> // Message displayed if no expenses for this day
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p>No expense data available.</p> // Message displayed if there are no weekly expenses
            )}
            <button
                className='button type1'
                type="button"
                onClick={() => navigate('/')} // Navigating back to the dashboard on button click
                style={{ marginTop: '20px' }}> {/* Adding margin to the button */}
                <span className="btn-txt">Dashboard</span> {/* Button label */}
            </button>
            {/* Link to navigate to the expenses breakdown page */}
            <Link to="/breakdown-expenses">
                <button className="button type1">
                    <span className="btn-txt">Expenses Breakdown</span>
                </button>
            </Link>
        </div>
    );
};

export default FetchExpenses; // Exporting FetchExpenses component for use in other parts of the application.
