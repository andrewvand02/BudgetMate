# Dashboard.jsx
/client/src/Dashboard.jsx

Contains the jsx container for the Dashboard, consisting of html allowing a user to enter and view their income and expenses.

# FetchIncome.jsx
/client/src/FetchIncome.jsx

Contains the jsx container for fetch income for a given user. Returns an html container with the given user's income data available.

## fetchIncome()
Uses async to gather user data based on a userID, returns the user's income entries.

## goBackToDashboard()
Redirects back to the main dashboard route ("/")

# FetchExpenses.jsx
/client/src/FetchExpenses.jsx

Fetches a given user's expenses and returns an html container with the user's expenses data.

## fetchExpenses()
Uses async to gather user data based on a userID, returns the user's expense entries.

# ExpenseInput.jsx
/client/src/ExpenseInput.jsx

Contains the functions and html container that allows users to input their own expense data.

## handleAddEntry()
Adds expense (category, amount, and frequency) to any previous expenses, defaulting to a weekly frequency.

## handleRemoveEntry()
Input: index (index of the expense to delete)

Copies the user's current list of expenses, removes the expense entry at the specified index in the list, then updates the original list of expenses.

## handleInputChange()
Inputs: index (index of the expense to modify), field (field of the expense entry to modify), value (new value for the given entry).

Copies the user's current list of expenses, updates the entry at the given index with the new field and value elements, then updates the original list of expenses.

## handleExpenseSubmit()
Async function to save the expense entries for the current userId.

# App.jsx
/client/src/App.jsx

Establishes routes and paths for all of the application's pages and containers.

# IncomeInput.jsx
/client/src/IncomeInput.jsx

Contains the functions and html container that allows users to input their own income data.

## handleAddEntry()
Adds income (category, amount) to the incomeEntries list.

## handleRemoveEntry()
Input: index (index of the income to delete)

Copies the user's current list of income entries, removes the income entry at the specified index in the list, then updates the original list of incomes.

## handleInputChange()
Inputs: index (index of the income to modify), field (field of the income entry to modify), value (new value for the given entry).

Copies the user's current list of income entries, updates the entry at the given index with the new field and value elements, then updates the original list of income entries.

## handleIncomeSubmit()
Async function to save the income entries for the current userId.

# main.jsx
/client/src/main.jsx

Creates the root of the React application using createRoot().

# server.js
/server/server.js

Handles backend of the application, including storage updates and server initialization.
