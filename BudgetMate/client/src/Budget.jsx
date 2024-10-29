import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const Budget = () => {
    const [actualExpenses, setActualExpenses] = useState({});
    const budgetData = {
        Rent: 800,
        Groceries: 400,
        Entertainment: 200,
        Utilities: 150,
    };

    useEffect(() => {
        // Fetch actual expenses from the backend and aggregate by category
        const fetchActualExpenses = async () => {
            try {
                const userId = 'user1'; // Hardcoded user ID for demo purposes.
                const response = await axios.get(`http://localhost:8080/api/expenses/${userId}`);
                const expenses = response.data.expenseEntries;

                // Aggregate expenses by category, ensuring `amount` is treated as a number
                const aggregatedExpenses = expenses.reduce((acc, entry) => {
                    const { category, amount, frequency } = entry;
                    if (frequency === 'daily') { // Only add daily expenses
                        acc[category] = (acc[category] || 0) + Number(amount); // Convert `amount` to a number here
                    }
                    return acc;
                }, {});

                setActualExpenses(aggregatedExpenses);

            } catch (error) {
                console.error('Error fetching actual expenses:', error);
            }
        };

        fetchActualExpenses();
    }, []);

    const data = {
        labels: Object.keys(budgetData),
        datasets: [
            {
                label: 'Budget',
                data: Object.values(budgetData),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            },
        ],
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const category = tooltipItem.label;
                        const budgetedAmount = tooltipItem.raw;
                        const spentAmount = actualExpenses[category] || 0;
                        const remainingAmount = budgetedAmount - spentAmount;

                        return [
                            `Category: ${category}`,
                            `Budgeted: $${budgetedAmount.toLocaleString()}`,
                            `Spent: $${spentAmount.toLocaleString()}`,
                            `Remaining: $${remainingAmount > 0 ? remainingAmount.toLocaleString() : 0}`,
                        ];
                    },
                },
            },
        },
    };

    return <Doughnut data={data} options={options} />;
};

export default Budget;
