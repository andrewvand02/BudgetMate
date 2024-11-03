import React, { useState, useEffect } from 'react'; // Importing React and necessary hooks
import axios from 'axios'; // Importing axios to handle HTTP requests
import { useNavigate } from 'react-router-dom'; // Importing useNavigate for navigation
import './FetchIncome.css'; // Importing CSS file for styling

const FetchIncome = () => {
    // State to hold income entries
    const [incomeEntries, setIncomeEntries] = useState([]);
    const navigate = useNavigate(); // Initializing the navigate function for navigation

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

    // Function to handle navigation back to the dashboard
    const goBackToDashboard = () => {
        navigate('/'); // Redirects to the dashboard route ('/')
    };

    return (
        <div className="income-container"> {/* Main container for income component */}
            <h1>Your Weekly Income Breakdown</h1> {/* Heading for income breakdown display */}
            {incomeEntries.length > 0 ? ( // Check if income entries are available
                <ul> {/* Unordered list for displaying income entries */}
                    {incomeEntries.map((entry, index) => ( // Mapping over income entries array
                        <li className='inc_amount' key={index}> {/* List item for each income entry */}
                            {entry.category}: ${entry.amount} {/* Displaying category and amount */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No income data available.</p> // Message displayed if no income entries are available
            )}
            <button onClick={goBackToDashboard} className='button type1'> {/* Button to go back to dashboard */}
            <span className="btn-txt">Dashboard</span> {/* Button label */}
            </button>
        </div>
    );
};

export default FetchIncome; // Exporting FetchIncome component for use in other parts of the application
