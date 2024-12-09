import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Mode from "./Mode"; // Ensure Mode component is available
import "./IncomeDashboard.css";

const IncomeDashboard = () => {
  const [incomeEntries, setIncomeEntries] = useState([]);
  const [formEntries, setFormEntries] = useState([
    { category: "", amount: "" },
  ]);
  const navigate = useNavigate();

  const [isFormExpanded, setIsFormExpanded] = useState(false); // State for form visibility

  // Fetch income data on mount
  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const userId = "user1"; // Replace with actual user logic
        const response = await axios.get(
          `http://localhost:8080/api/income/${userId}`
        );
        setIncomeEntries(response.data.incomeEntries);
      } catch (error) {
        console.error("Error fetching income:", error);
      }
    };

    fetchIncome();
  }, []);

  // Handlers for form input (IncomeInput logic)
  const handleAddEntry = () => {
    setFormEntries([...formEntries, { category: "", amount: "" }]);
  };

  const handleRemoveEntry = (index) => {
    const updatedEntries = [...formEntries];
    updatedEntries.splice(index, 1);
    setFormEntries(updatedEntries);
  };

  const handleInputChange = (index, field, value) => {
    const updatedEntries = [...formEntries];
    updatedEntries[index][field] = value;
    setFormEntries(updatedEntries);
  };

  const handleIncomeSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = "user1"; // Replace with dynamic user logic
      const response = await axios.post("http://localhost:8080/api/income", {
        userId,
        incomeEntries: formEntries,
      });

      alert(response.data.message);

      // Option 1: Re-fetch the data
      const updatedData = await axios.get(
        `http://localhost:8080/api/income/${userId}`
      );
      setIncomeEntries(updatedData.data.incomeEntries);

      // Clear out the form entries if desired
      setFormEntries([{ category: "", amount: "" }]);
    } catch (error) {
      console.error("Error submitting income:", error);
      alert("There was an error submitting your income. Please try again.");
    }
  };

  // Toggle form visibility
  const toggleForm = () => {
    setIsFormExpanded((prev) => !prev);
  };

  // Navigation
  const goBackToDashboard = () => {
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="header-bar">
        <h1>Income Dashboard</h1>
      </div>

      <div className="income-display">
        <h2>Your Monthly Income Breakdown</h2>
        {incomeEntries.length > 0 ? (
          <ul className="income-list">
            {incomeEntries.map((entry, index) => (
              <li className="inc-amount" key={index}>
                <span className="inc-category">{entry.category}</span>
                <span className="inc-value">${entry.amount}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-data">No income data available.</p>
        )}
      </div>

      {/* <div className="income-form-container">
        <h2>Enter Your Monthly Income</h2>
        <form onSubmit={handleIncomeSubmit}>
          {formEntries.map((entry, index) => (
            <div key={index} className="income-input-group">
              <input
                type="text"
                placeholder="Income Category"
                value={entry.category}
                onChange={(e) =>
                  handleInputChange(index, "category", e.target.value)
                }
                required
                className="input-field category-field"
              />
              <input
                type="number"
                min="1"
                placeholder="Amount"
                value={entry.amount}
                onChange={(e) =>
                  handleInputChange(index, "amount", e.target.value)
                }
                required
                className="input-field amount-fields"
              />
              {formEntries.length > 1 && (
                <button
                  className="removeButton"
                  type="button"
                  onClick={() => handleRemoveEntry(index)}
                >
                  <span className="btn-txt ">Remove</span>
                </button>
              )}
            </div>
          ))}
          <div className="form-buttons">
            <button
              className="button type1"
              type="button"
              onClick={handleAddEntry}
            >
              <span className="btn-txt">Add Another Category</span>
            </button>
            <button className="button type1" type="submit">
              <span className="btn-txt">Submit Income</span>
            </button>
          </div>
        </form>
      </div> */}

      <div className="income-form-container">
        <h2 onClick={toggleForm} style={{ cursor: "pointer" }}>
          Enter Your Monthly Income   
          <span>
            {isFormExpanded ? " " : " "} {/* Arrow indicator */}
          </span>
        </h2>
        {isFormExpanded && (
          <form onSubmit={handleIncomeSubmit}>
            {formEntries.map((entry, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <div className="pt_Cat">
                  <input
                    type="text"
                    placeholder="Income Category"
                    value={entry.category}
                    onChange={(e) =>
                      handleInputChange(index, "category", e.target.value)
                    }
                    required
                    className="input-field category-field"
                  />
                </div>
                <div className="pt_Quant">
                  <input
                    type="number"
                    min="1"
                    placeholder="Amount"
                    value={entry.amount}
                    onChange={(e) =>
                      handleInputChange(index, "amount", e.target.value)
                    }
                    required
                    className="input-field amount-fields"
                  />
                </div>
                {formEntries.length > 1 && (
                  <button
                    className="removeButton"
                    type="button"
                    onClick={() => handleRemoveEntry(index)}
                  >
                    <span className="btn-txt ">Remove</span>
                  </button>
                )}
              </div>
            ))}
            <div className="form-buttons">
              <button
                className="button type1"
                type="button"
                onClick={handleAddEntry}
              >
                <span className="btn-txt">Add Another Category</span>
              </button>
              <button className="button type1" type="submit">
                <span className="btn-txt">Submit Income</span>
              </button>
            </div>
          </form>
        )}
      </div>

      <button 
        type="button"
        onClick={goBackToDashboard} 
        className="button type1"
        style={{ marginTop: '20px', width: '30%', alignSelf: 'center' }}>
        <span className="btn-txt">Dashboard</span>{" "}
      </button>

      <Mode />
    </div>
  );
};

export default IncomeDashboard;
