import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Debt.css'
import Mode from './Mode'; 
import { Pie } from 'react-chartjs-2';
import './DashboardDebt.css';

const DashboardDebt = () => {
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

    // Check if debtEntries is empty
    const isDataEmpty = debtEntries.length === 0 || debtEntries.every(entry => !entry.source || !entry.amount);

    return (
        <div>
            {/* Conditionally render message if no data */}
            <div className='dashboard-chart'>
                {/* Show a pie chart of debts */}
                <div className='dashboard-chart' style={{maxWidth: '300px'}}>
                    <Pie className="pie" style={{maxWidth: '300px'}} data={data} options={options} />
                </div>
            </div>
            
            <Mode></Mode>
        </div>
    );
};

export default DashboardDebt;