// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import IncomeInput from './IncomeInput';
import FetchIncome from './FetchIncome';
import './App.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/income" element={<IncomeInput />} />
                <Route path="/fetch-income" element={<FetchIncome />} />
            </Routes>
        </Router>
    );
};

export default App;
