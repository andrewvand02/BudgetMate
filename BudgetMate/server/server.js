const express =require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const corsOptions={
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

let expensesData = {};
let incomeStore = {};

// Route to handle income submission
app.post('/api/income', (req, res) => {
    const { userId, incomeEntries } = req.body;
    
    // Store the income for a specific user 
    incomeStore[userId] = incomeEntries;

    res.json({ message: 'Income stored successfully', incomeEntries });
});

// Route to retrieve the stored income
app.get('/api/income/:userId', (req, res) => {
    const { userId } = req.params;
    const incomeEntries = incomeStore[userId];
    
    // Return the income data if available
    if (incomeEntries) {
        res.json({ incomeEntries });
    } else {
        res.status(404).json({ message: 'No income data found' });
    }
});

app.post('/api/expenses', (req, res) => {
    const { userId, expenseEntries } = req.body;

    // Initialize user data if it doesn't exist
    if (!expensesData[userId]) {
        expensesData[userId] = [];
    }

    // Store the expenses
    expensesData[userId].push(...expenseEntries);
    res.json({ message: 'Expenses saved successfully!' });
});

app.get('/api/expenses/:userId', (req, res) => {
    const { userId } = req.params;
    const userExpenses = expensesData[userId] || [];
    res.json({ expenseEntries: userExpenses });
});


app.listen(8080, () => {
    console.log("Server started on port 8080");

})

