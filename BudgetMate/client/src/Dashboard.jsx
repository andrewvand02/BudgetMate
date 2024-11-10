import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import budget from './assets/budget.png';

const Dashboard = () => {

    return (
        <div>
            <img class="logo" src={budget} alt="logo">
            </img>
            <h1>BudgetMate</h1>
            <p>Welcome to your financial tracker!</p>
            <Link to="/income">
                <button className="button type1">
                    <span className="btn-txt">Income Input</span>
                </button>
            </Link>
            <Link to="/fetch-income">
                <button className="button type1">
                    <span className="btn-txt">View Income</span>
                </button>
            </Link>
            <Link to="/expenses">
                <button className="button type1">
                    <span className="btn-txt">Input Expenses</span>
                </button>
            </Link>
            <Link to="/fetch-expenses">
                <button className="button type1">
                    <span className="btn-txt">View Expenses</span>
                </button>
            </Link>
            <Link to="/breakdown-expenses">
                <button className="button type1">
                    <span className="btn-txt">Expenses Breakdown</span>
                </button>
            </Link>
            <Link to="/budget">
                <button className="button type1">
                    <span className="btn-txt">Budget</span>
                </button>
            </Link>
            <Link to="/login">
                <button className="login-button">
                    <span className='btn-txt'>Login</span>
                </button>
            </Link>
        </div>
    );
};

export default Dashboard;
