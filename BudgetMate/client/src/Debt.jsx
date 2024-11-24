import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Debt.css'

const Debt = () => {
    const navigate = useNavigate();// Initializing the navigate function for navigation
    const goBackToDashboard = () => {// Function to handle navigation back to the dashboard
        navigate('/'); // Redirects to the dashboard route ('/')
    };

    const [debtEntries, setDebtEntries] = useState([{ source: "", amount: "", interestRate: "", schedule: "", category: "", paymentAmount: "", totalRepaid: ""}])

    const handleAddEntry = () => {
        setDebtEntries([...debtEntries, { source: "", amount: "", interestRate: "", schedule: "", category: "", paymentAmount: "", totalRepaid: ""}]);
    };

    const handleRemoveEntry = (index) => {
        const updatedEntries = [...debtEntries];
        updatedEntries.splice(index, 1);
        setDebtEntries(updatedEntries);
    }

    const handleInputChange = (index, field, value) => {
        const updatedEntries = [...debtEntries];
        updatedEntries[index][field] = value;
        setDebtEntries(updatedEntries);
    };

    const handleDebtSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = 'user1';
            const response = await axios.post('http://localhost:8080/api/debt', {userId, debtEntries });
            alert(response.data.message);
            navigate('/');
        } catch (error) {
            console.error('Error submitting debts:', error);
        }
    };

    const categoryOptions = {
        category: ["Credit Card", "Student Loan", "Auto Loan", "Home Loan", "Other"]
    };

    return (
        <div>
            <h1>DEBTS</h1>
            <div>
                <h2>Enter Your Debt</h2>
                <form onSubmit={handleDebtSubmit}>
                    {debtEntries.map((entry, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            {/*Allow users to input debt sources */}
                            <div className='pt_Cat'>
                                <input
                                    type="text" // text input for debt source
                                    placeholder="Source of Debt" // placeholder text for input
                                    value={entry.source}
                                    onChange={(e) => handleInputChange(index, 'source', e.target.value)}
                                    required
                                />
                            </div>
                            {/* Allow users to inpute debt amount */}
                            <div className='pt_Quant'>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Debt Amount"
                                    value={entry.amount}
                                    onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                                    required
                                />
                            </div>
                            {/*Allow users to input interest rate for each debt*/}
                            <div className='pt_Quant'>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Interest Rate"
                                    value={entry.interestRate}
                                    onChange={(e) => handleInputChange(index, 'interestRate', e.target.value)}
                                    required
                                />
                            </div>
                            {/*Allow users to input payment schedule for each debt*/}
                            <select
                                className='select-pt-Cat'
                                value={entry.schedule}
                                onChange={(e) => handleInputChange(index, 'schedule', e.target.value)}
                            >
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Biweekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                            {/*Allow users to select category of debt*/}
                            <select
                                className='select-pt-Cat'
                                value={entry.category}
                                onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                            >
                                {categoryOptions.category.map((option, index) => ( 
                                    <option key={index} value={option}>{option}</option> // Creating an option for each category
                                ))}
                            </select>
                            {/*Allow users to input amount paid per payment schedule*/}
                            <div className='pt_Quant'>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Payment Amount"
                                    value={entry.paymentAmount}
                                    onChange={(e) => handleInputChange(index, 'paymentAmount', e.target.value)}
                                    required
                                />
                            </div>
                            {/*Allow users to input the amount they've repaid so far.*/}
                            {/*This will probably be removed later, as ideally it will be calculated via the expenses.*/}
                            <div className='pt_Quant'>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Total Repaid"
                                    value={entry.totalRepaid}
                                    onChange={(e) => handleInputChange(index, 'totalRepaid', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    ))}
                    <button className="button type1" type="button" onClick={handleAddEntry}>
                        <span className="btn-txt">Add Debt</span>
                    </button>
                    <button className="button type1" type="submit">
                        <span className="btn-txt">Submit Debts</span>
                    </button>
                </form>
            </div>
            <div>
                <h2>Your Debt</h2>
                {/* Display all debts in a list/table */}
                {debtEntries.length > 0 ? ( // Check if debt entries are available
                    <ul> {/* Unordered list for displaying debt entries */}
                        {debtEntries.map((entry, index) => ( // Mapping over debt entries array
                            <li key={index}> {/* List item for each debt entry */}
                                {entry.source} ({entry.category}): ${entry.amount} @ {entry.interestRate}%; ${entry.paymentAmount} {entry.schedule}; ${entry.totalRepaid} repaid ({(entry.totalRepaid/entry.amount)*100}%) {/* Displaying category and amount */}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No debt data available.</p> // Message displayed if no debt entries are available
                )}
                {/* Show a pie chart of debts */}
                {/* Include percent progress for each debt in the list/table */}
            </div>
            <div className='dashboard-button'>
                <button onClick={goBackToDashboard} className='button type1'>
                    <span className="btn-txt">Dashboard</span> {/* Button to go back to the dashboard*/}
                </button>
            </div>
        </div>
    );
};

export default Debt;