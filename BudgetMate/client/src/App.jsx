// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import IncomeInput from './IncomeInput';
import FetchIncome from './FetchIncome';
import ExpenseInput from './ExpenseInput';
import FetchExpenses from './FetchExpenses';
import BreakdownExpenses from './BreakdownExpenses';
import Budget from './Budget';
import LoginButton from './LoginButton';
import SavingsGoal from './SavingsGoal';
import Help from './Help';
import TaxHelp from './TaxHelp';
import Debt from './Debt';


import './App.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/income" element={<IncomeInput />} />
                <Route path="/fetch-income" element={<FetchIncome />} />
                <Route path="/expenses" element={<ExpenseInput />} />
                <Route path="/fetch-expenses" element={<FetchExpenses />} />
                <Route path="/breakdown-expenses" element={<BreakdownExpenses />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/login" element={<LoginButton/>} />
                <Route path="/savings-goal" element={<SavingsGoal/>} />
                <Route path="/help" element={<Help />} />
                <Route path="/tax-help" element={<TaxHelp />} />
                <Route path="/debt" element={<Debt />} />
            </Routes>
        </Router>
    );
};

export default App;
