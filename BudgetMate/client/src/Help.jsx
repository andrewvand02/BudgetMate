import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Help.css'
import Mode from './Mode';

const Help = () => {
    const navigate = useNavigate();// Initializing the navigate function for navigation
    // Function to handle navigation back to the dashboard
    const goBackToDashboard = () => {
        navigate('/'); // Redirects to the dashboard route ('/')
    };
    const goBack = () => {
        navigate(-1); // Navigates back to the previous page in the browser history
    };
    

    return (
        <div className="help-container">
            <h1>Help</h1>

            <div className='info-container'>
                <section>
                    <h2>How to Use the Application</h2>
                    <p>Follow these steps to get started:</p>
                    <ol>
                    <li>Navigate through the menu to access different sections.</li>
                    <li>Click on the "Help" link if you need assistance.</li>
                    </ol>
                </section>

                <section>
                    <h2>Getting Started</h2>
                    <p>Welcome to BudgetMate! Here's how to get started:</p>
                    <ol>
                    <li><strong>Create an Account:</strong> Sign up using your email or Google account.</li>
                    <li><strong>Set Up Your Budget:</strong> Go to the "Budget" section and add your weekly expense categories.</li>
                    <li><strong>Track Expenses:</strong> Log your daily or monthly expenses by clicking on the "Input Expense" button.</li>
                    </ol>
                </section>

                <section>
                    <h2>Frequently Asked Questions</h2>
                    <ul>
                    <li><strong>Q:</strong> How do I reset my password?</li>
                    <li><strong>A:</strong> Click on "Forgot Password" on the login screen.</li>

                    <li><strong>Q:</strong> How can I contact support?</li>
                    <li><strong>A:</strong> Use the contact support form at the bottom of this page.</li>
                
                    {/* 
                    <li><strong>Q:</strong> How do I edit or delete an expense?</li>
                    <li><strong>A:</strong> Go to the "Input Expenses" section, find the expense you want to edit, and click on the "Edit" or "Delete" button.</li>
                    */}

                    <li><strong>Q:</strong> Can I set savings goals?</li>
                    <li><strong>A:</strong> Yes, you can set savings goals in the "Savings Goals" section to input and track your progress over time.</li>
                    {/* 
                    <li><strong>Q:</strong> How can I export my data?</li>
                    <li><strong>A:</strong> Go to "Settings" and click on "Export Data" to download a CSV file of your transactions.</li>
                    */}
                    </ul>
                </section>

                <section>
                    <h2>Troubleshooting</h2>
                    <ul>
                    <li><strong>Issue:</strong> I can't log in to my account.</li>
                    <li><strong>Solution:</strong> Make sure your email and password are correct. If you've forgotten your password, click "Forgot Password" to reset it.</li>

                    <li><strong>Issue:</strong> My expenses are not being saved.</li>
                    <li><strong>Solution:</strong> Check your internet connection and try again. If the problem persists, contact support.</li>
                    </ul>
                </section>

                <section>
                    <h2>Contact Support</h2>
                    <p>If you need further assistance, please reach out to our support team:</p>
                    <ul>
                    <li>Email: <a href="mailto:support@budgetmate.com">support@budgetmate.com</a></li>
                    {/*<li>Phone: +1 (800) 123-4567</li>*/}
                    </ul>
                </section>

            </div>

            <div className='dashboard-button'>
                <button onClick={goBackToDashboard} className='button type1'>
                    <span className="btn-txt">Dashboard</span> {/* Button to go back to the dashboard*/}
                </button>
            </div>
            
            <button onClick={goBack} className='back-btn'>
                <span className="btn-txt">Back</span>
            </button>
            <Mode></Mode>
        </div> 
    );
};

export default Help;
