import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Debt.css'
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; // For Pie Chart

const Debt = () => {
    const navigate = useNavigate();// Initializing the navigate function for navigation
    const goBackToDashboard = () => {// Function to handle navigation back to the dashboard
        navigate('/'); // Redirects to the dashboard route ('/')
    };

    const [debtEntries, setDebtEntries] = useState([{ source: "", amount: "", interestRate: "", schedule: "", category: "", paymentAmount: "", totalRepaid: ""}])

    // useEffect to fetch debt data when the component mounts
    useEffect(() => {
        // Function to fetch debt data from the backend
        const fetchDebt = async () => {
            try {
                const userId = 'user1'; // Hardcoded user ID for demo, replace with actual user ID as needed
                // Fetching debt data for the user from the backend
                const response = await axios.get(`http://localhost:8080/api/debt/${userId}`);
                // Setting the debt entries state with the response data
                setDebtEntries(response.data.debtEntries);
            } catch (error) {
                // Logging any error that occurs during fetch
                console.error('Error fetching debt:', error);
            }
        };
        fetchDebt();
    }, []);

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
        } catch (error) {
            console.error('Error submitting debts:', error);
        }
    };

    const categoryOptions = {
        category: ["Credit Card", "Student Loan", "Auto Loan", "Home Loan", "Other"]
    };

    // Data for Pie chart
    const data = {
        labels: debtEntries.map(entry => entry.source), // Use source names as labels
        datasets: [
            {
                label: 'Debt',
                data: debtEntries.map(entry => parseFloat(entry.amount)), // Use amounts for data points
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] // Define colors for each segment
            },
        ],
    };

    // Options for Pie chart
    const options = {
        plugins: {
            tooltip: {
                enabled: false,
            },// Disable default tooltips
        },
    };

    return (
        <div>
            <h1>DEBTS</h1>
            <div>
                <h2>Enter Your Debt</h2>
                <form onSubmit={handleDebtSubmit}>
                    {debtEntries.map((entry, index) => (
                        <div key={index} style={{ marginBottom: '10px', backgroundColor: 'lightgrey' }}>
                            <h3>Debt {index+1}</h3>
                            <button
                                style={{backgroundColor: '#f44336'}}
                                onClick={() => handleRemoveEntry(index)}
                            >
                                Remove Debt Entry
                            </button>
                            <br></br>
                            {/*Allow users to input debt sources */}
                            <div className='pt_Cat'>
                                Source
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
                                Debt Amount
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
                                Interest Rate (%)
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
                            Schedule
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
                            Category
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
                            Amount per Payment
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
                                Amount Repaid
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
            <div style={{ padding: '0.6em 1.2em', borderRadius: '8px' }}>
                <h2>Your Debt</h2>
                {/* Display all debts in a list/table */}
                {debtEntries.length > 0 ? (
                    <table style={{width: '100%'}}>
                        <tr>
                            <th>Source</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Interest Rate</th>
                            <th>Schedule</th>
                            <th>Amount per Payment</th>
                            <th>Total Repaid</th>
                            <th>Percent Repaid</th>
                        </tr>
                        {debtEntries.map((entry, index) => ( // Mapping over debt entries array
                            <tr key={index}> {/* List item for each debt entry */}
                                <td>{entry.source}</td>
                                <td>{entry.category}</td>
                                <td>${entry.amount}</td>
                                <td>{entry.interestRate}%</td>
                                <td>{entry.schedule}</td>
                                <td>${entry.paymentAmount}</td>
                                <td>${entry.totalRepaid}</td>
                                <td>{((entry.totalRepaid/entry.amount)*100).toFixed(0)}%</td>
                            </tr>
                        ))}
                    </table>
                ) : (
                    <p>No debt data available.</p>
                )}
                
                {/* Show a pie chart of debts */}
                <div style={{ display: 'flex', marginTop: '10px', width: '30vw', height: '30vw' }}>
                    <Pie className="pie" data={data} options={options} />
                </div>
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