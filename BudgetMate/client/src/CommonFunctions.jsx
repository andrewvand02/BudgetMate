import React from 'react';
import axios from 'axios';

const fetchData = async (requestedData, userId) => {
    try {
        const response = await axios.get('http://localhost:8080/api/${requestedData}/${userId}');
    } catch (error) {
        console.error('Error fetching ${requestedData}:', error)
    }
};