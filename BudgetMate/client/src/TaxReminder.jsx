import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaxReminder = () => {
  const [taxDate, setTaxDate] = useState('');
  const [fetchedTaxDate, setFetchedTaxDate] = useState('');

  useEffect(() => {
    const fetchTaxDate = async () => {
      try {
        const userId = 'user1'; // Replace with actual user ID
        const response = await axios.get(`http://localhost:8080/api/tax-date/${userId}`);
        setFetchedTaxDate(response.data.taxDate || 'No date set');
      } catch (error) {
        console.error('Error fetching tax date:', error);
      }
    };

    fetchTaxDate();
  }, []);

  const handleSaveTaxDate = async () => {
    try {
      const userId = 'user1'; // Replace with actual user ID
      await axios.post(`http://localhost:8080/api/tax-date`, { userId, taxDate });
      setFetchedTaxDate(taxDate); // Update the state to reflect the saved date
      alert('Tax date saved successfully!');
    } catch (error) {
      console.error('Error saving tax date:', error);
    }
  };

  return (
    <div className="tax-reminder-container">
      <h1>Tax Reminders</h1>
      <p>Set and manage your tax reminders below:</p>
      <div>
        <label>
          Tax Date: 
          <input
            type="date"
            value={taxDate}
            onChange={(e) => setTaxDate(e.target.value)}
          />
        </label>
        <button onClick={handleSaveTaxDate}>Save Tax Date</button>
      </div>
      <div>
        <h2>Current Tax Date:</h2>
        <p>{fetchedTaxDate}</p>
      </div>
    </div>
  );
};

export default TaxReminder;
