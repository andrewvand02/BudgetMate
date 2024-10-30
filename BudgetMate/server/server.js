// Import necessary libraries
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

let expensesData = {};
let incomeStore = {};
let budgetData = {};

// Route to get budget submission
app.post('/api/budget', (req, res) => {
    const { userId, budgetEntries } = req.body;
    budgetData[userId] = budgetEntries;
    res.json({ message: 'Budget stored successfully', budgetEntries});
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

// Route to handle income submission (Unchanged)
app.post('/api/income', (req, res) => {
    const { userId, incomeEntries } = req.body;
    incomeStore[userId] = incomeEntries;
    res.json({ message: 'Income stored successfully', incomeEntries });
});

// Route to retrieve stored income (Unchanged)
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

        // Validate required fields (excluding `date` which will be handled automatically)
        if (!name || !category || !amount || !frequency) {
            return res.status(400).json({ message: 'Invalid expense entry. Please include name, category, amount, and frequency.' });
        }

        // Automatically assign the current date for daily expenses
        const date = frequency === 'daily' ? new Date().toISOString().split('T')[0] : null;

        // Save the expense entry with the necessary fields
        expensesData[userId].push({ name, category, amount, frequency, date });
    });

    res.json({ message: 'Expenses saved successfully!' });
});

// Route to retrieve the stored expenses for a user (Unchanged)
app.get('/api/expenses/:userId', (req, res) => {
    const { userId } = req.params;
    const userExpenses = expensesData[userId] || [];
    res.json({ expenseEntries: userExpenses });
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});
