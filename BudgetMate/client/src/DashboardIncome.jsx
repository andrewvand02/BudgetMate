import React, { useState, useEffect } from 'react'; // Importing React and necessary hooks
import axios from 'axios'; // Importing axios to handle HTTP requestsuseNavigate for navigation
import Mode from './Mode';
//import './FetchIncome.css'; // Importing CSS file for styling
import './DashboardIncome.css'

const DashboardIncome = () => {
    // State to hold income entries
    const [incomeEntries, setIncomeEntries] = useState([]);

    // useEffect to fetch income data when the component mounts
    useEffect(() => {
        // Function to fetch income data from the backend
        const fetchIncome = async () => {
            try {
                const userId = 'user1'; // Hardcoded user ID for demo, replace with actual user ID as needed
                // Fetching income data for the user from the backend
                const response = await axios.get(`http://localhost:8080/api/income/${userId}`);
                // Setting the income entries state with the response data
                setIncomeEntries(response.data.incomeEntries);
            } catch (error) {
                // Logging any error that occurs during fetch
                console.error('Error fetching income:', error);
            }
        };

        fetchIncome(); // Calling fetchIncome function to retrieve data on component mount
    }, []);

    return (
        <div className="income-container"> {/* Main container for income component */}
            {incomeEntries.length > 0 ? ( // Check if income entries are available
                <ul> {/* Unordered list for displaying income entries */}
                    {incomeEntries.map((entry, index) => ( // Mapping over income entries array
                        <li className='inc_amount' key={index}> {/* List item for each income entry */}
                            {'Your Income'}: ${entry.amount} {/* Displaying category and amount */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No income data available.</p> // Message displayed if no income entries are available
            )}
            <Mode></Mode>
        </div>
    );
};

export default DashboardIncome; // Exporting FetchIncome component for use in other parts of the application
