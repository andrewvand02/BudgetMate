import { useState } from 'react';
import axios from 'axios';

const IncomeInput = () => {
    const [income, setIncome] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:8080/api/income', { income });
            setMessage(response.data.message);
            setIncome('');
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error submitting income');
        }
    };

    return (
        <div>
            <h2>Weekly Income Tracker</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="income">Enter your weekly income:</label>
                <input
                    type="number"
                    id="income"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default IncomeInput;
