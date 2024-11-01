import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // imports the styles from the dashboard's css file
import budget from './assets/budget.png';

const Dashboard = () => {
    return (
        <div>
            <img src={budget} alt="logo">
            </img>
            <h1>BudgetMate</h1>
            <p>Welcome to your financial tracker!</p>
            <Link to="/income">
                <button>Income Input</button>
            </Link>
            <Link to="/fetch-income">
                <button>View Income</button>
            </Link>
            <Link to="/expenses">
                <button>Input Expenses</button>
             </Link>
            <Link to="/fetch-expenses">
                <button>View Expenses</button>
            </Link>
            <Link to="/budget">
                <button>Budget</button>
            </Link>
        </div>
    );
};

export default Dashboard;
