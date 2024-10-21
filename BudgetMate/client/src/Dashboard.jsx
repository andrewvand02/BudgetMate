import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to your financial tracker!</p>
            <Link to="/income">
                <button>Go to Income Input</button>
            </Link>
        </div>
    );
};

export default Dashboard;