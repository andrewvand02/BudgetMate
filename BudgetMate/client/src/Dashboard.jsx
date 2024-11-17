import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import budget from './assets/budget.png';

const Dashboard = () => {

    return (
        <div>
            <img class="logo" src={budget} alt="logo">
            </img>
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
            <Link to="/savings-goal">
                <button className="button type1">
                    <span className='btn-txt'>Savings Goal</span>
                </button>
            </Link>
            <Link to="/help">
                <button className='help-button'>
                    <span className='btn-txt'>Help</span>
                </button>
            </Link>
            <Link to="/tax-help">
                <button className='button type1'>
                    <span className='btn-txt'>Tax Help</span>
                </button>
            </Link>
        </div>
    );
};

export default Dashboard;
