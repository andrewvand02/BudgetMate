import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import Income from './Income';
import './App.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/income" element={<Income/>} />
            </Routes>
        </Router>
    );
};

export default App;
