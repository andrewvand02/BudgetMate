import React, { useState, useEffect } from 'react'; // Import React and necessary hooks
import axios from 'axios'; // Import Axios for API requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for page navigation
import Mode from './Mode';
import './DashboardSavings.css';

const DashboardSavings = () => {
    // Declare state variables to store the savings goal, dates, weekly savings, progress, and average weekly savings
    const [savingsGoal, setSavingsGoal] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [weeklySavings, setWeeklySavings] = useState(0);
    const [progress, setProgress] = useState(0);
    const [avgWeeklySavings, setAvgWeeklySavings] = useState(0); // New state for average weekly savings
    const navigate = useNavigate(); // Initialize the navigate function for routing

    // Fetch savings goal and target date when the component mounts (on page load)
    useEffect(() => {
        const fetchSavingsGoal = async () => {
            try {
                const userId = 'user1'; // Use a hardcoded userId for now, replace with dynamic logic later
                const response = await axios.get(`http://localhost:8080/api/savings-goal/${userId}`); // Make a GET request to fetch the savings goal
                setSavingsGoal(response.data.savingsGoal); // Set the savings goal in state
            } catch (error) {
                console.error('Error fetching savings goal:', error); // Log any errors
            }
        };

        fetchSavingsGoal(); // Call the function to fetch the savings goal
    }, []); // Empty dependency array ensures this effect runs only once on mount

    // Fetch weekly savings and calculate progress whenever savingsGoal, startDate, or endDate changes
    useEffect(() => {
        const fetchWeeklySavings = async () => {
            try {
                const userId = 'user1'; // Use a hardcoded userId for now
                const response = await axios.get(`http://localhost:8080/api/weekly-savings/${userId}`); // Make a GET request to fetch weekly savings
                setWeeklySavings(response.data.weeklySavings); // Set weekly savings in state

                // Calculate progress if all required fields are present
                if (savingsGoal && startDate && endDate) {
                    const weeksRemaining = getWeeksUntilDate(endDate); // Get the number of weeks until the end date
                    const potentialSavings = weeklySavings * weeksRemaining; // Calculate potential savings based on weekly savings
                    setProgress(Math.min((weeklySavings / savingsGoal) * 100, 100)); // Calculate the progress percentage, ensuring it's capped at 100%

                    // Calculate the average weekly savings required to meet the goal
                    const averageWeeklySavingsRequired = savingsGoal / weeksRemaining;
                    setAvgWeeklySavings(averageWeeklySavingsRequired); // Set the average weekly savings required
                }
            } catch (error) {
                console.error('Error fetching weekly savings:', error); // Log any errors
            }
        };

        // Only fetch weekly savings and calculate progress if all fields are available
        if (savingsGoal && startDate && endDate) {
            fetchWeeklySavings(); // Call the function to fetch weekly savings
        }
    }, [savingsGoal, startDate, endDate, weeklySavings]); // Include weeklySavings as a dependency to trigger re-calculation

    // Calculate the number of weeks remaining until the target date
    const getWeeksUntilDate = (date) => {
        if (!date) return 0; // Return 0 if no date is provided
        const now = new Date(); // Get the current date
        const endDate = new Date(date); // Convert the target date to a Date object
        const timeDifference = endDate - now; // Calculate the time difference between now and the target date
        return Math.ceil(timeDifference / (1000 * 60 * 60 * 24 * 7)); // Return the number of weeks (rounded up)
    };

    // Validate if the start date is in the future
    const isValidStartDate = (start) => {
        const now = new Date();
        return new Date(start) >= now; // Check if the start date is not in the past
    };

    // Validate if the end date is after the start date
    const isValidEndDate = (start, end) => {
        return new Date(end) > new Date(start); // Check if the end date is after the start date
    };

    // Update the savings goal whenever the user changes the input
    const handleGoalChange = (e) => {
        const newGoal = parseFloat(e.target.value) || 0; // Get the new goal amount from the input field
        setSavingsGoal(newGoal); // Update the savings goal state
    };

    // Update the start date whenever the user changes the input
    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value; // Get the new start date from the input field
        if (isValidStartDate(newStartDate)) {
            setStartDate(newStartDate); // Update the start date state if it's valid
        } else {
            alert("Start date cannot be in the past."); // Alert the user if the start date is invalid
        }
    };

    // Update the end date whenever the user changes the input
    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value; // Get the new end date from the input field
        if (isValidEndDate(startDate, newEndDate)) {
            setEndDate(newEndDate); // Update the end date state if it's valid
        } else {
            alert("End date must be after the start date."); // Alert the user if the end date is invalid
        }
    };

    // Handle form submission when the user saves their goal
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        try {
            const userId = 'user1'; // Use a hardcoded userId for now
            // Send the updated savings goal to the backend via a POST request
            await axios.post(`http://localhost:8080/api/savings-goal`, { 
                userId, 
                savingsGoal, 
                startDate,
                endDate 
            });

            alert('Savings goal updated successfully!'); // Alert the user that the goal was saved successfully
        } catch (error) {
            console.error('Error updating savings goal:', error); // Log any errors
            alert('Error updating savings goal. Please try again.'); // Alert the user if there was an error
        }
    };

    // Navigate back to the dashboard
    const goBackToDashboard = () => {
        navigate('/'); // Use the navigate function to go back to the home page
    };

    // Check if data is available for display
    const isDataAvailable = savingsGoal && startDate && endDate;

    return (
        <div className="dashboard-savings-goal-container"> {/* Container for the savings goal page */}
            <div className="weekly-savings">
                <p>Weekly Savings: ${weeklySavings}</p> {/* Display the weekly savings */}
            </div>
            <div className="progress">
                <p>Progress: {progress}%</p> {/* Display the progress percentage */}
                <div className="progress-bar" style={{ width: `${progress}%` }}></div> {/* Progress bar */}
            </div>
            
            <Mode></Mode>
        </div>
    );
};

export default DashboardSavings; // Export the SavingsGoal component for use in other parts of the app
