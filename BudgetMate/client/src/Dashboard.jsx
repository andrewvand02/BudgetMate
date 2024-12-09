import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import './Mode.css';
import Mode from './Mode';
import ImageSwitcher from "./ImageSwitcher";
import DashboardIncome from './DashboardIncome';
import IncomeVsExpenses from './DashboardIncomeVsExpenses';
import CategoryBreakdown from './DashboardCategoryBreakdown';
import SpendingTrend from './DashboardSpendingTrend';
import DashboardPrediction from './DashboardPrediction';
import DashboardBudget from './DashboardBudget';
import DashboardDebt from './DashboardDebt';
import DashboardSavings from './DashboardSavings';
import DashboardExpenses from './DashboardWeeklyExpenses';


const Dashboard = () => {

    return (
        <div>
            {/* Use the ImageSwitcher component to dynamically handle light/dark images */}
            <div className='image'><ImageSwitcher /></div>
            <p>Welcome to your financial tracker!</p>
            <Link to="/income-dashboard">
                <button className="button type1">
                    <span className="btn-txt">Income</span>
                </button>
            </Link>
            <Link to="/expense-dashboard">
                <button className="button type1">
                    <span className="btn-txt">Expenses</span>
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
            <Mode></Mode>
            <Link to="/debt">
                <button className='button type1'>
                    <span className='btn-txt'>Debt</span>
                </button>
            </Link>

            <div className='dashboard-diplay-items'>
                <div className='item expenses'>
                    <DashboardExpenses />
                    <Link to="/expense-dashboard">
                        <button className='item-button'>
                            View Expenses
                        </button>
                    </Link>
                </div>
                <div className='items-box'>
                    <div className='item income'>
                        <DashboardIncome />
                        <Link to="/income-dashboard">
                            <button className='item-button'>
                                View Income
                            </button>
                        </Link>
                    </div>
                    <div className='item'>
                        <IncomeVsExpenses />
                        <Link to="/expense-dashboard">
                            <button className='item-button'>
                                View More
                            </button>
                        </Link>
                    </div>
                    <div className='item'>
                        <CategoryBreakdown />
                        <Link to="/expense-dashboard">
                            <button className='item-button'>
                                View More
                            </button>
                        </Link>
                    </div>
                    <div className='item'>
                        <SpendingTrend />
                        <Link to="/expense-dashboard">
                            <button className='item-button'>
                                View More
                            </button>
                        </Link>
                    </div>
                    <div className='item prediction'>
                        <DashboardPrediction />
                        <Link to="/expense-dashboard">
                            <button className='item-button'>
                                View More
                            </button>
                        </Link>
                    </div>
                    <div className='item'>
                        <DashboardBudget />
                        <Link to="/budget">
                            <button className='item-button'>
                                View Budget
                            </button>
                        </Link>
                    </div>
                    <div className='item'>
                        <DashboardDebt />
                        <Link to="/debt">
                            <button className='item-button'>
                                View Debt
                            </button>
                        </Link>
                    </div>
                    <div className='item savings'>
                        <DashboardSavings />
                        <Link to="/savings-goal">
                            <button className='item-button'>
                                View Savings
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
