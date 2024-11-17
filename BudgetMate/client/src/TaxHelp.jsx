import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './TaxHelp.css';

const TaxHelp = () => {
  const navigate = useNavigate();

  // State for the tax calculator
  const [income, setIncome] = useState('');
  const [filingStatus, setFilingStatus] = useState('single');
  const [businessType, setBusinessType] = useState('none');
  const [estimatedTax, setEstimatedTax] = useState(null);

  const goBackToDashboard = () => {
    navigate('/');
  };

  // Function to calculate estimated tax
  const calculateTax = () => {
    let tax = 0;
    const incomeValue = parseFloat(income);

    if (isNaN(incomeValue) || incomeValue <= 0) {
      alert('Please enter a valid income amount.');
      return;
    }

    // Individual Tax Calculation
    if (businessType === 'none') {
      if (filingStatus === 'single') {
        if (incomeValue <= 10000) tax = incomeValue * 0.1;
        else if (incomeValue <= 40000) tax = 1000 + (incomeValue - 10000) * 0.12;
        else tax = 4600 + (incomeValue - 40000) * 0.22;
      } else if (filingStatus === 'married') {
        if (incomeValue <= 20000) tax = incomeValue * 0.1;
        else if (incomeValue <= 80000) tax = 2000 + (incomeValue - 20000) * 0.12;
        else tax = 9200 + (incomeValue - 80000) * 0.22;
      }
    }

    // Business Tax Calculation for LLC
    if (businessType === 'llc') {
      tax = incomeValue * 0.15; // Simple example: 15% self-employment tax
    }

    // Business Tax Calculation for S-Corp
    if (businessType === 'scorp') {
      tax = incomeValue * 0.1 + 1000; // Simple example: 10% tax rate + $1000 payroll tax
    }

    setEstimatedTax(tax.toFixed(2));
  };

  return (
    <div className="tax-help-container">
      <h1>Tax Help & Support</h1>
    <div className='tax-help-info'>
      <section>
        <h2>Simple Tax Calculator</h2>
        <p>Estimate your federal income tax based on your income, filing status, or business type.</p>
        <div className="tax-calculator">
          <label className='pt_Cat'>
          <span className='lable_cal'>Income: $ </span>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="annual income"
            />
          </label>

          <label>
            <span className='lable_cal'>Filing Status:</span>
            <select 
              value={filingStatus} onChange={(e) => setFilingStatus(e.target.value)} 
              className='select-pt-Cat'>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
          </label>

          <label>
          <span className='lable_cal'>Business Type:</span>
            <select 
              value={businessType} onChange={(e) => setBusinessType(e.target.value)}
              className='select-pt-Cat'>
              <option value="none">None (Individual)</option>
              <option value="llc">LLC</option>
              <option value="scorp">S-Corp</option>
            </select>
          </label>
          <div className="tax-button">
          <button onClick={calculateTax} className="button type1">
          <span className='btn-txt'>Calculate Tax</span></button>
          </div>
          {estimatedTax !== null && (
            <div className="tax-result">
              <h3>Estimated Tax: ${estimatedTax}</h3>
              <p className="disclaimer">
                *Disclaimer: This calculation is only an estimate and may not reflect the actual tax amount owed. Please consult a tax professional for accurate tax advice.
              </p>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2>Business Tax Information</h2>
        <h3>LLC Tax Information</h3>
        <p>
          LLCs are typically treated as pass-through entities for tax purposes. This means that the business income
          is passed through to the owner's personal tax return, and the owner pays self-employment tax (typically 15.3%).
        </p>

        <h3>S-Corp Tax Information</h3>
        <p>
          S-Corps allow owners to receive both a salary and distribution of profits. The salary portion is subject to
          payroll taxes, while distributions are not. However, reasonable compensation must be paid to avoid IRS scrutiny.
        </p>
      </section>

      <section>
        <h2>Frequently Asked Questions</h2>
        <ul>
          <li><strong>Q:</strong> When will I receive my tax refund?</li>
          <li><strong>A:</strong> Most refunds are issued within 21 days if you file electronically and choose direct deposit.</li>

          <li><strong>Q:</strong> How can I check the status of my refund?</li>
          <li><strong>A:</strong> Use the "Where’s My Refund?" tool on the IRS website for up-to-date information.</li>

          <li><strong>Q:</strong> What should I do if I made a mistake on my tax return?</li>
          <li><strong>A:</strong> You can file an amended return using Form 1040-X to correct any errors.</li>

          <li><strong>Q:</strong> When is the tax filing deadline for individuals?</li>
          <li><strong>A:</strong> The deadline for filing individual tax returns (Form 1040) is typically April 15th. If this date falls on a weekend or holiday, the deadline is extended to the next business day.</li>

          <li><strong>Q:</strong> When is the tax filing deadline for LLCs?</li>
          <li><strong>A:</strong> For single-member LLCs (treated as a sole proprietorship), the deadline is usually April 15th, aligning with individual filings. For multi-member LLCs (treated as partnerships), the deadline is March 15th. An extension can be filed if more time is needed.</li>

          <li><strong>Q:</strong> When is the tax filing deadline for S-Corps?</li>
          <li><strong>A:</strong> S-Corp tax returns (Form 1120S) are due by March 15th. If you need additional time, you can file an extension, which typically gives you until September 15th.</li>
        </ul>
      </section>


      <section>
        <h2>Contact Support</h2>
        <p>If you need further assistance, please reach out to our support team:</p>
        <ul>
          <li>Email: <a href="mailto:support@budgetmate.com">support@budgetmate.com</a></li>
        </ul>
      </section>

      <div className="dashboard-button">
        <button onClick={goBackToDashboard} className="button type1">
          <span className="btn-txt">Dashboard</span>
        </button>
      </div>
      </div>
    </div>
  );
};

export default TaxHelp;
