import React, { useState, useEffect } from 'react'; // Importing React, useState, and useEffect hooks.
import axios from 'axios'; // Importing axios to handle HTTP requests.
import { useNavigate } from 'react-router-dom'; // Importing useNavigate from react-router-dom for navigation.
import Mode from './Mode';
import './FetchExpenses.css'; // Importing CSS file for styling.

import { Link } from 'react-router-dom';

const DashboardExpenses = () => {
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
            // Parse the expense date and adjust for local time zone explicitly.
            const rawDate = new Date(expense.date);
            const date = new Date(rawDate.getTime() + rawDate.getTimezoneOffset() * 60000);
            const weekRange = getWeekRange(date); // Getting the week range string for the date.
    
            // Initialize the week range if not already present, with empty arrays for each day.
            if (!groupedExpenses[weekRange]) {
                groupedExpenses[weekRange] = Array(7).fill([]).map(() => []);
            }
    
            const dayIndex = date.getDay(); // Correctly calculate the day of the week.
            console.log(`Expense Date: ${expense.date}, Local Adjusted Date: ${date}, Day Index: ${dayIndex}`);
    
            // Add the expense to the appropriate day in the week.
            groupedExpenses[weekRange][dayIndex] = [...groupedExpenses[weekRange][dayIndex], expense];
        });
    
        return groupedExpenses; // Return the grouped expenses object.
    };
    
    // Helper function to calculate the week range for a given date.
    const getWeekRange = (date) => {
        const startOfWeek = new Date(date);
        const endOfWeek = new Date(date);
    
        // Adjust startOfWeek to the previous Sunday.
        startOfWeek.setDate(date.getDate() - date.getDay());
    
        // Adjust endOfWeek to the following Saturday.
        endOfWeek.setDate(date.getDate() + (6 - date.getDay()));
    
        // Format as a readable range string (e.g., "2024-11-17 - 2024-11-23").
        const format = (d) => d.toISOString().split('T')[0];
        return `${format(startOfWeek)} - ${format(endOfWeek)}`;
    };

    // Get the most recent week from the grouped expenses
    const getMostRecentWeek = () => {
        const sortedWeeks = Object.keys(weeklyExpenses).sort((a, b) => new Date(b.split(" - ")[0]) - new Date(a.split(" - ")[0]));
        return sortedWeeks[0];
    };

    const mostRecentWeek = getMostRecentWeek();
    const mostRecentWeekEntries = mostRecentWeek ? weeklyExpenses[mostRecentWeek] : [];

    return (
        <div className="expense-container"> {/* Main container for the FetchExpenses component */}
            {mostRecentWeek ? ( // Check if there is data for the most recent week
                <div className="weekly-expenses"> {/* Container for a single week's expenses */}
                    <h2>{mostRecentWeek}</h2> {/* Displaying the most recent week range */}
                    <div className="week-grid"> {/* Container for grid layout of daily expenses */}
                        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, dayIndex) => ( // Mapping over each day of the week
                            <div key={dayIndex} className="day-column"> {/* Container for a single day */}
                                <h3>{day}</h3> {/* Displaying the name of the day */}
                                {mostRecentWeekEntries[dayIndex].length > 0 ? ( // Checking if there are expenses for this day
                                    <ul> {/* Unordered list to display expenses for the day */}
                                        {mostRecentWeekEntries[dayIndex].map((entry, entryIndex) => ( // Mapping over entries for the day
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
            ) : (
                <p>No expense data available.</p> // Message displayed if there is no most recent week data
            )}
            
            <Mode></Mode>
        </div>
    );
};

export default DashboardExpenses; // Exporting FetchExpenses component for use in other parts of the application.
