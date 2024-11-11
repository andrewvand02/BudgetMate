import React, { useState } from 'react'; // Import React and useState hook
import axios from 'axios'; // Import axios for making HTTP requests
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for page navigation

const IncomeInput = () => {
    // Declare state to store income entries, initialized with one entry
    const [incomeEntries, setIncomeEntries] = useState([{ category: '', amount: '' }]);
    const navigate = useNavigate();  // Initialize navigate function for routing after submission

    // Add a new income entry (new input fields for category and amount)
    const handleAddEntry = () => {
        setIncomeEntries([...incomeEntries, { category: '', amount: '' }]); // Append a new empty entry
    };

    // Remove a specific income entry by index
    const handleRemoveEntry = (index) => {
        const updatedEntries = [...incomeEntries]; // Copy the current entries
        updatedEntries.splice(index, 1); // Remove the entry at the specified index
        setIncomeEntries(updatedEntries); // Update the state with the modified entries
    };

    // Handle changes in the input fields for category and amount
    const handleInputChange = (index, field, value) => {
        const updatedEntries = [...incomeEntries]; // Copy the current entries
        updatedEntries[index][field] = value; // Update the field (category or amount) for the specific entry
        setIncomeEntries(updatedEntries); // Update the state with the modified entries
    };

    // Submit income data to the backend API
    const handleIncomeSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            const userId = 'user1';  // Hardcoded user ID for demonstration purposes
            // Send the income entries data to the backend API
            const response = await axios.post('http://localhost:8080/api/income', { userId, incomeEntries });
            alert(response.data.message);  // Notify the user of a successful submission

            // Navigate back to the dashboard after successful submission
            navigate('/');
        } catch (error) {
            console.error('Error submitting income:', error); // Log any errors to the console
            alert('There was an error submitting your income. Please try again.'); // Show an error alert if submission fails
        }
    };

    return (
        <div style={{ textAlign: 'center', margin: '20px' }}>
            <h1>Enter Your Weekly Income</h1> {/* Header for the income entry form */}
            <form onSubmit={handleIncomeSubmit}> {/* Form that handles income submission */}
                {incomeEntries.map((entry, index) => (  // Loop through each income entry
                    <div key={index} style={{ marginBottom: '10px' }}>
                        {/* Input field for income category */}
                        <div className='pt_Cat'>
                            <input
                                type="text"
                                placeholder="Income Category" // Placeholder text for category input
                                value={entry.category} // Bind the input value to the category field of the current entry
                                onChange={(e) => handleInputChange(index, 'category', e.target.value)} // Handle category input change
                                required // Make this field required
                                style={{ marginRight: '10px' }} // Add right margin for spacing
                            />
                        </div>
                        {/* Input field for income amount */}
                        <div className='pt_Quant'>
                            <input
                                type="number"
                                min="1" // Minimum value is 1 to prevent non-positive values
                                placeholder="Amount" // Placeholder text for amount input
                                value={entry.amount} // Bind the input value to the amount field of the current entry
                                onChange={(e) => handleInputChange(index, 'amount', e.target.value)} // Handle amount input change
                                required // Make this field required
                                style={{ marginRight: '10px' }} // Add right margin for spacing
                            />
                        </div>
                        {/* Show "Remove" button if there is more than one entry */}
                        {incomeEntries.length > 1 && (
                            <button 
                                className='button type1'
                                type="button" 
                                onClick={() => handleRemoveEntry(index)}  // Call handleRemoveEntry on click
                                style={{ marginLeft: '5px' }}> {/* Add left margin for spacing */}
                                <span className="btn-txt">Remove</span> {/* Button text */}
                            </button>
                        )}
                    </div>
                ))}
                <div style={{ marginTop: '20px' }}>
                    {/* Button to add another income entry */}
                    <button className='button type1' type="button" onClick={handleAddEntry} style={{ marginRight: '10px' }}>
                        <span className="btn-txt">Add Another Income Category</span> {/* Button text */}
                    </button>
                    {/* Submit button for income form */}
                    <button className='button type1' type="submit">
                        <span className="btn-txt">Submit Income</span> {/* Button text */}
                    </button>
                </div>
            </form>

            {/* Button to navigate back to the dashboard without submitting */}
            <button 
                className='button type1'
                type="button" 
                onClick={() => navigate('/')}  // Navigate back to the dashboard
                style={{ marginTop: '20px' }}> 
                <span className="btn-txt">Dashboard</span> {/* Button text */}
            </button>
        </div>
    );
};

export default IncomeInput; // Export the IncomeInput component for use in other parts of the app
