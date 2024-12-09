import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Fetches requested data from the backend for a given userId.
 * 
 * @async
 * @function fetchData
 * @param {string} requestedData Name of data to request.
 * @param {string} userId The user ID to fetch data of.
 * @returns {Array} The requested data for the user.
 */
export async function fetchData(requestedData, userId) {
    try {
        const response = await axios.get(`http://localhost:8080/api/${requestedData}/${userId}`);
        const dataToReturn = await response.data.requestedData;
        console.log(`_Fetched ${requestedData}:`, dataToReturn);
        return dataToReturn;
    } catch (error) {
        console.error(`Error fetching ${requestedData}:`, error)
    }
};

export const handleAddEntry = () => {

};

export const handleRemoveEntry = () => {

};

export const handleInputChange = () => {

};

export const handleDataSubmit = async (e) => {

};

/**
 * Navigates the user back to the dashboard.
 */
export const goBackToDashboard = () => {
    const navigate = useNavigate();
    navigate('/');
};