const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csv-parser');
const fastCsv = require('fast-csv');
const path = require('path');
const nodemailer = require('nodemailer');
 //Import statements
const twilio = require('twilio');
const axios = require('axios');

const corsOptions = { //For communicating with frontend
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json()); //Parsing for reading responses

let expensesData = {}; //Storage for expensesData
let incomeStore = {}; //Storage for incomeStore
let budgetData = {}; //Storage for budgetData
let savingsGoals= {};//Storage for savingsGoal data
let spendPredictions = {}; //Storage for predicting next week's spending total

// Function to load data from a CSV file into a data store
const loadDataFromCSV = (filePath, dataStore) => {
    return new Promise((resolve, reject) => {  // Return a new promise to handle asynchronous operations
        // Create a readable stream from the specified CSV file path
        fs.createReadStream(filePath)
            .pipe(csv()) // Pipe the readable stream through the csv-parser to parse the CSV file
            .on('data', (row) => { // For each row in the CSV file
                const userId = row.userId; // Extract the userId from the row
                // Check if this userId already exists in the dataStore
                if (!dataStore[userId]) {
                    dataStore[userId] = []; // If it doesn't exist, initialize an empty array for the user
                }
                dataStore[userId].push(row); // Push the current row into the user's data array in the dataStore
            })
            .on('end', () => { // When the CSV file has been fully processed
                console.log(`Data loaded from ${filePath}`); // Log a message indicating the data was loaded successfully
                resolve(); // Resolve the promise indicating success
            })
            .on('error', (error) => reject(error)); // If an error occurs during the file reading process, reject the promise with the error
    });
};

// Function to save data to a CSV file
// Function to save data from the dataStore into a CSV file
const saveDataToCSV = (filePath, dataStore) => {
    // Create a writable stream to the specified file path where the CSV will be saved
    const writableStream = fs.createWriteStream(filePath);
    
    // Create a CSV stream with headers enabled (first row will be column names)
    const csvStream = fastCsv.format({ headers: true });

    // Pipe the CSV stream into the writable stream (file) and log a message when done
    csvStream.pipe(writableStream).on('end', () => console.log(`Data saved to ${filePath}`));
    
    // Iterate over all user IDs in the dataStore
    Object.keys(dataStore).forEach((userId) => {
        // For each user, iterate over their data entries
        dataStore[userId].forEach((entry) => {
            // Write the user data along with the userId into the CSV stream
            csvStream.write({ userId, ...entry });
        });
    });
    
    // Close the CSV stream (finalize the file writing process)
    csvStream.end();
};

// Load initial data on server start
const init = async () => {
    await loadDataFromCSV(path.join(__dirname, 'Data', 'Expense.csv'), expensesData); //load expenses
    await loadDataFromCSV(path.join(__dirname, 'Data', 'Income.csv'), incomeStore); //load income
    await loadDataFromCSV(path.join(__dirname, 'Data', 'Budget.csv'), budgetData); //load budget
};

init();

// Route to get budget submission
app.post('/api/budget', (req, res) => {
    const { userId, budgetEntries } = req.body; //response from frontend
    budgetData[userId] = budgetEntries; //store in relation to userID
    saveDataToCSV(path.join(__dirname, 'Data', 'Budget.csv'), budgetData); // Save to CSV after update
    res.json({ message: 'Budget stored successfully', budgetEntries });//response back
});

// Route to get stored budget
app.get('/api/budget/:userId', (req, res) => {
    const { userId } = req.params; //required userID
    const budgetEntries = budgetData[userId]; //find budgetEntries assiocated with userID
    if (budgetEntries) {
        res.json({ budgetEntries }); //if exist, send back to frontend
    } else {
        res.status(404).json({ message: 'No budget data found' }); //else, send message
    }
});

// Route to handle income submission (POST request)
app.post('/api/income', (req, res) => {
    // Destructure userId and incomeEntries from the request body
    const { userId, incomeEntries } = req.body; 
    
    // Store the income entries for the given user in the incomeStore
    incomeStore[userId] = incomeEntries;
    
    // Save the updated income data to the CSV file after the update
    saveDataToCSV(path.join(__dirname, 'Data', 'Income.csv'), incomeStore);
    
    // Send a JSON response indicating successful storage of income data
    res.json({ message: 'Income stored successfully', incomeEntries });
});

app.post('/api/send-sms', async (req, res) => {
    const { to, message } = req.body;

    try {
        const sms = await client.messages.create({
            body: message,
            from: '+18556475096', // Replace with your Twilio number
            to: to,
        });
        res.status(200).json({ success: true, message: 'SMS sent!', sms });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route to retrieve stored income for a specific user (GET request)
app.get('/api/income/:userId', (req, res) => {
    // Extract userId from the request parameters (URL)
    const { userId } = req.params;

    // Retrieve the income entries for the given user
    const incomeEntries = incomeStore[userId];
    
    // If income entries exist, return them in a JSON response
    if (incomeEntries) {
        res.json({ incomeEntries });
    } else {
        // If no income entries are found, return a 404 error with a message
        res.status(404).json({ message: 'No income data found' });
    }
});

// Route to handle expense submission (POST request)
app.post('/api/expenses', (req, res) => {
    // Destructure userId and expenseEntries from the request body
    const { userId, expenseEntries } = req.body;

    // If the user does not have any existing expense data, initialize an empty array for them
    if (!expensesData[userId]) {
        expensesData[userId] = [];
    }

    // Iterate over the expense entries provided in the request
    expenseEntries.forEach(entry => {
        // Destructure name, category, amount, and frequency from each expense entry
        const { name, category, amount, frequency } = entry;

        // Validate that the required fields (name, category, amount, frequency) are provided
        if (!name || !category || !amount || !frequency) {
            // If any required field is missing, send a 400 error with a message
            return res.status(400).json({ message: 'Invalid expense entry. Please include name, category, amount, and frequency.' });
        }

        // Automatically assign the current date for daily expenses
        const date = frequency === 'daily' ? new Date().toISOString().split('T')[0] : null;

        // Push the validated expense entry into the expenses data store for the user
        expensesData[userId].push({ name, category, amount, frequency, date });
    });

    // Save the updated expenses data to the CSV file after the update
    saveDataToCSV(path.join(__dirname, 'Data', 'Expense.csv'), expensesData);

    // Send a JSON response indicating that the expenses have been saved successfully
    res.json({ message: 'Expenses saved successfully!' });
});


// Route to retrieve the stored expenses for a user
// Route to retrieve expenses for a specific user (GET request)
app.get('/api/expenses/:userId', (req, res) => {
    // Extract userId from the request parameters (URL)
    const { userId } = req.params;
    
    // Retrieve the expenses for the user, defaulting to an empty array if none are found
    const userExpenses = expensesData[userId] || [];
    
    // Return the user's expenses as a JSON response
    res.json({ expenseEntries: userExpenses });
});

// Route to handle saving a user's savings goal (POST request)
app.post('/api/savings-goal', (req, res) => {
    // Destructure userId, savingsGoal, startDate, and endDate from the request body
    const { userId, savingsGoal, startDate, endDate } = req.body;

    // Validate that savingsGoal, startDate, and endDate are provided
    if (!savingsGoal || !startDate || !endDate) {
        // If any required field is missing, send a 400 error with a message
        return res.status(400).json({ message: 'Savings goal, start date, and end date are required.' });
    }

    // Store the user's savings goal, startDate, and endDate in the in-memory object
    savingsGoals[userId] = { savingsGoal: parseFloat(savingsGoal), startDate, endDate };

    // Send a JSON response confirming the savings goal was saved
    res.json({ 
        message: 'Savings goal saved successfully', 
        savingsGoal: savingsGoals[userId] 
    });
});

// Route to retrieve the savings goal for a specific user (GET request)
app.get('/api/savings-goal/:userId', (req, res) => {
    // Extract userId from the request parameters (URL)
    const { userId } = req.params;
    
    // Retrieve the user's savings goal
    const userGoal = savingsGoals[userId];
    
    // If the user's savings goal exists, return it in a JSON response
    if (userGoal) {
        res.json(userGoal);
    } else {
        // If no savings goal is found, return a 404 error with a message
        res.status(404).json({ message: 'No savings goal found for this user' });
    }
});

// Route to calculate potential weekly savings based on budget and expenses (GET request)
app.get('/api/weekly-savings/:userId', (req, res) => {
    // Extract userId from the request parameters (URL)
    const { userId } = req.params;
    
    // Retrieve the user's budget and expenses, defaulting to empty arrays if none are found
    const budgetEntries = budgetData[userId] || [];
    const expenseEntries = expensesData[userId] || [];

    // Calculate total weekly budget by summing the amounts from all budget entries
    const weeklyBudget = budgetEntries.reduce((acc, entry) => acc + parseFloat(entry.amount), 0);

    // Calculate the start and end dates of the current week (Sunday to Saturday)
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay(); // Sunday is 0, Monday is 1, etc.
    
    // Calculate the start of the week (Sunday at 00:00)
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    // Calculate the end of the week (Saturday at 23:59)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Filter the expenses to include only those from the current week
    const weeklySpent = expenseEntries
        .filter(entry => {
            // Convert the expense date to a Date object and check if it falls within the current week
            const expenseDate = new Date(entry.date);
            return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
        })
        .reduce((acc, entry) => acc + parseFloat(entry.amount), 0); // Sum the amounts of weekly expenses

    // Calculate the weekly savings (Budget - Expenses), ensuring the result is not negative
    const weeklySavings = Math.max(weeklyBudget - weeklySpent, 0);

    // Return the weekly budget, weekly expenses, and weekly savings in a JSON response
    res.json({ weeklyBudget, weeklySpent, weeklySavings });
});


// Configure the transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'budgetmate581@gmail.com',
        pass: 'placeholder'
    }
});

// Route to handle sending a budget alert email
app.post('/api/send-budget-alert', async (req, res) => {
    const { userEmail, category, exceededAmount } = req.body;

    try {
        // Send the budget alert email
        await sendBudgetExceededEmail(userEmail, category, exceededAmount);

        // Respond with success message
        res.status(200).json({ message: 'Budget alert email sent successfully.' });
    } catch (error) {
        console.error('Error sending budget alert email:', error);

        // Respond with error message
        res.status(500).json({ message: 'Failed to send budget alert email.' });
    }
});

// Function to send the budget exceeded email
const sendBudgetExceededEmail = (userEmail, category, exceededAmount) => {
    const mailOptions = {
        to: userEmail,
        subject: `Budget Exceeded for ${category}`,
        html: exceededAmount
    };

    return transporter.sendMail(mailOptions);
};

const sendDataToPythonBackend = async (userId, weeklyExpenses) => {
    try {
        const response = await axios.post('http://localhost:5001/api/receive-expenses', {
            userId,
            weeklyExpenses
        });
        spendPredictions[userId] = response.data;   // Store the data into the spendPredictions array
        console.log(spendPredictions);
        console.log('Data sent to Python backend:', response.data);
    } catch (error) {
        console.error('Error sending data to Python backend:', error.message);
    }
};

app.get('api/receive-expenses/:userId', (req, res) => {
    const { userId } = req.params;
    const spendPredEntries = spendPredictions[userId]; 
    if (spendPredEntries) {
        res.json({ spendPredEntries });
    } else {
        res.status(404).json({ message: 'No spending predictions found' });
    }
});

function getWeekNumber(date) {
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7)); // Adjust to Thursday in current week
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNumber;
}


app.get('/api/weekly-expenses/:userId', async (req, res) => {
    const { userId } = req.params;

    const expenseEntries = expensesData[userId] || [];

    const groupedExpenses = expenseEntries.reduce((acc, entry) => {
        const expenseDate = new Date(entry.date);
        const year = expenseDate.getFullYear();
        const week = getWeekNumber(expenseDate);
        const category = entry.category;

        if (!acc[year]) acc[year] = {};
        if (!acc[year][week]) acc[year][week] = {};
        if (!acc[year][week][category]) acc[year][week][category] = 0;

        acc[year][week][category] += parseFloat(entry.amount);

        return acc;
    }, {});

    await sendDataToPythonBackend(userId, groupedExpenses);

    res.json({ weeklyExpenses: groupedExpenses });
});


app.listen(8080, () => {
    console.log("Server started on port 8080");
});
