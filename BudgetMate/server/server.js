const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csv-parser');
const fastCsv = require('fast-csv');
const path = require('path');

const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

let expensesData = {};
let incomeStore = {};
let budgetData = {};

// Function to load data from CSV files
const loadDataFromCSV = (filePath, dataStore) => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                const userId = row.userId;
                if (!dataStore[userId]) {
                    dataStore[userId] = [];
                }
                dataStore[userId].push(row);
            })
            .on('end', () => {
                console.log(`Data loaded from ${filePath}`);
                resolve();
            })
            .on('error', (error) => reject(error));
    });
};

// Function to save data to a CSV file
const saveDataToCSV = (filePath, dataStore) => {
    const writableStream = fs.createWriteStream(filePath);
    const csvStream = fastCsv.format({ headers: true });

    csvStream.pipe(writableStream).on('end', () => console.log(`Data saved to ${filePath}`));
    
    Object.keys(dataStore).forEach((userId) => {
        dataStore[userId].forEach((entry) => {
            csvStream.write({ userId, ...entry });
        });
    });
    csvStream.end();
};

// Load initial data on server start
const init = async () => {
    await loadDataFromCSV(path.join(__dirname, 'Data', 'Expense.csv'), expensesData);
    await loadDataFromCSV(path.join(__dirname, 'Data', 'Income.csv'), incomeStore);
    await loadDataFromCSV(path.join(__dirname, 'Data', 'Budget.csv'), budgetData);
};

init();

// Route to get budget submission
app.post('/api/budget', (req, res) => {
    const { userId, budgetEntries } = req.body;
    budgetData[userId] = budgetEntries;
    saveDataToCSV(path.join(__dirname, 'Data', 'Budget.csv'), budgetData); // Save to CSV after update
    res.json({ message: 'Budget stored successfully', budgetEntries });
});

// Route to get stored budget
app.get('/api/budget/:userId', (req, res) => {
    const { userId } = req.params;
    const budgetEntries = budgetData[userId];
    if (budgetEntries) {
        res.json({ budgetEntries });
    } else {
        res.status(404).json({ message: 'No budget data found' });
    }
});

// Route to handle income submission
app.post('/api/income', (req, res) => {
    const { userId, incomeEntries } = req.body;
    incomeStore[userId] = incomeEntries;
    saveDataToCSV(path.join(__dirname, 'Data', 'Income.csv'), incomeStore);// Save to CSV after update
    res.json({ message: 'Income stored successfully', incomeEntries });
});

// Route to retrieve stored income
app.get('/api/income/:userId', (req, res) => {
    const { userId } = req.params;
    const incomeEntries = incomeStore[userId];
    if (incomeEntries) {
        res.json({ incomeEntries });
    } else {
        res.status(404).json({ message: 'No income data found' });
    }
});

// Route to handle expense submission
app.post('/api/expenses', (req, res) => {
    const { userId, expenseEntries } = req.body;

    if (!expensesData[userId]) {
        expensesData[userId] = [];
    }

    expenseEntries.forEach(entry => {
        const { name, category, amount, frequency } = entry;

        // Validate required fields
        if (!name || !category || !amount || !frequency) {
            return res.status(400).json({ message: 'Invalid expense entry. Please include name, category, amount, and frequency.' });
        }

        // Automatically assign the current date for daily expenses
        const date = frequency === 'daily' ? new Date().toISOString().split('T')[0] : null;

        expensesData[userId].push({ name, category, amount, frequency, date });
    });

    saveDataToCSV(path.join(__dirname, 'Data', 'Expense.csv'), expensesData); // Save to CSV after update
    res.json({ message: 'Expenses saved successfully!' });
});

// Route to retrieve the stored expenses for a user
app.get('/api/expenses/:userId', (req, res) => {
    const { userId } = req.params;
    const userExpenses = expensesData[userId] || [];
    res.json({ expenseEntries: userExpenses });
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});
