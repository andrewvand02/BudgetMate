import React, { useState } from 'react'; // Importing React and the useState hook to manage component state.
import axios from 'axios'; // Importing axios for making HTTP requests to the backend.
import { useNavigate } from 'react-router-dom'; // Importing useNavigate from react-router-dom to programmatically navigate between routes.
import './ExpenseInput.css';

const ExpenseInput = () => {
    // Initializing state for expense entries with one default entry.
    const [expenseEntries, setExpenseEntries] = useState([{ name: '', category: '', amount: '', frequency: 'daily' }]);
    const navigate = useNavigate(); // Getting the navigate function to redirect after form submission.

    // Function to add a new entry to the expense entries array.
    const handleAddEntry = () => {
        // Appending a new entry object with empty fields and default frequency to the existing entries.
        setExpenseEntries([...expenseEntries, { name: '', category: '', amount: '', frequency: 'daily' }]);
    };

    // Function to remove an entry from the expense entries array based on its index.
    const handleRemoveEntry = (index) => {
        // Creating a copy of the current expense entries.
        const updatedEntries = [...expenseEntries];
        // Removing the entry at the specified index.
        updatedEntries.splice(index, 1);
        // Updating the state with the modified entries array.
        setExpenseEntries(updatedEntries);
    };

    // Function to handle input changes in each entry field.
    const handleInputChange = (index, field, value) => {
        // Creating a copy of the current expense entries.
        const updatedEntries = [...expenseEntries];
        // Updating the specified field of the entry at the given index with the new value.
        updatedEntries[index][field] = value;
        // Updating the state with the modified entries array.
        setExpenseEntries(updatedEntries);
    };

    // Function to handle form submission.
    const handleExpenseSubmit = async (e) => {
        e.preventDefault(); // Preventing the default form submission behavior.
        try {
            const userId = 'user1'; // Assuming a static user ID for the example.
            // Sending a POST request to the backend with the user's ID and expense entries.
            const response = await axios.post('http://localhost:8080/api/expenses', { userId, expenseEntries });
            alert(response.data.message); // Displaying a message from the server response.
            navigate('/'); // Navigating back to the dashboard after submission.
        } catch (error) {
            // Logging any errors that occur during the submission.
            console.error('Error submitting expenses:', error);
        }
    };

    // Defining category options based on the frequency of expenses.
    const categoryOptions = {
        daily: ["Groceries", "Restaurant/Takeout", "Home Supplies", "Personal Care", "Transportation", "Entertainment", "Clothing", "Hobbies", "Pets", "Other"],
        monthly: ["Rent/Mortgage", "Subscription", "Utilities", "Other"]
    };

    return (
        <div> {/* Main container for the ExpenseInput component */}
            <h1>Enter Your Expenses</h1> {/* Heading for the form */}
            <form onSubmit={handleExpenseSubmit}> {/* Form element with submission handling */}
                {expenseEntries.map((entry, index) => ( // Mapping over the array of expense entries
                    <div key={index} style={{ marginBottom: '10px' }}> {/* Individual entry container */}
                        <div className='pt_Cat'>
                            <input
                                type="text" // Text input for the expense name
                                placeholder="Expense Name" // Placeholder text for the input
                                value={entry.name} // Current value of the input, tied to state
                                onChange={(e) => handleInputChange(index, 'name', e.target.value)} // Handling change for the name input
                                required // Makes this field required
                            />
                        </div>
                        <select
                            className='select-pt-Cat'
                            value={entry.frequency} // Current value for frequency, tied to state
                            onChange={(e) => handleInputChange(index, 'frequency', e.target.value)} // Handling frequency selection change
                        >
                            <option value="daily">Daily</option> {/* Daily frequency option */}
                            <option value="monthly">Monthly</option> {/* Monthly frequency option */}
                        </select>
                        <select
                            className='select-pt-Cat'
                            value={entry.category} // Current value for category, tied to state
                            onChange={(e) => handleInputChange(index, 'category', e.target.value)} // Handling category selection change
                            required // Makes this field required
                        >
                            <option value="">Select Category</option> {/* Default option prompting category selection */}
                            {categoryOptions[entry.frequency].map((category, idx) => ( // Mapping over category options based on the selected frequency
                                <option key={idx} value={category}>{category}</option> // Creating an option for each category
                            ))}
                        </select>
                        <div className='pt_Quant'>
                            <input
                                type="number" // Number input for the expense amount
                                min="1" // Minimum amount, can't have user input $0 or less
                                placeholder="Amount" // Placeholder text for the input
                                value={entry.amount} // Current value of the input, tied to state
                                onChange={(e) => handleInputChange(index, 'amount', e.target.value)} // Handling change for the amount input
                                required // Makes this field required
                            />
                        </div>
                        {expenseEntries.length > 1 && ( // Conditional rendering of the remove button if there are multiple entries
                            <button className="button type1" type="button" onClick={() => handleRemoveEntry(index)}> {/* Removing entry on click */}
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <button className="button type1" type="button" onClick={handleAddEntry}> {/* Button to add another expense entry */}
                 <span className="btn-txt">Add Expense</span>
                </button>
                <button className="button type1" type="submit">
                <span className="btn-txt">Submit Expenses</span></button> {/* Button to submit the form */}
            </form>
            <button
                className="button type1" 
                type="button" 
                onClick={() => navigate('/')} // Navigating back to the dashboard on click 
                style={{ marginTop: '20px' }}> {/* Adding some margin to the button */}
                <span className="btn-txt">Dashboard</span> {/* Button label */}
            </button>
        </div>
    );
};

export default ExpenseInput; // Exporting the ExpenseInput component for use in other parts of the application.
