import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './TaxHelp.css'; // import styling for TaxHelp

const TaxHelp = () => {
  const navigate = useNavigate();

  // State for the tax calculator
  const [income, setIncome] = useState('');
  const [filingStatus, setFilingStatus] = useState('single');
  const [businessType, setBusinessType] = useState('none'); // Business type: 'none', 'llc', 'scorp', or 'c-corp'
  const [estimatedTax, setEstimatedTax] = useState(null);
  const [salary, setSalary] = useState(''); // State for S-Corp salary input
  const [previousNOL, setPreviousNOL] = useState(''); // State for previous NOL input
  const [retainedEarnings, setRetainedEarnings] = useState(''); // State for retained earnings input
  const [dividends, setDividends] = useState(''); // State for dividends paid input
  const [showLLCInfo, setShowLLCInfo] = useState(false);
  const [showSCorpInfo, setShowSCorpInfo] = useState(false);


  const toggleLLCInfo = () => {
    setShowLLCInfo((prevState) => !prevState);
    event.target.blur();
  };
  
  const toggleSCorpInfo = () => {
    setShowSCorpInfo((prevState) => !prevState);
    event.target.blur(); // Remove focus after click
  };
  

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
    if (businessType === 'none') { // Check if the business type is 'none' (individual filer)
      if (filingStatus === 'single') { // Check if the filing status is 'single'
        if (incomeValue <= 10000) tax = incomeValue * 0.1; // If income is less than or equal to $10,000, apply a 10% tax rate
        else if (incomeValue <= 40000) tax = 1000 + (incomeValue - 10000) * 0.12; // If income is between $10,001 and $40,000, apply a base tax of $1,000 plus 12% on the income exceeding $10,000
        else tax = 4600 + (incomeValue - 40000) * 0.22; // If income is greater than $40,000, apply a base tax of $4,600 plus 22% on the income exceeding $40,000
      } else if (filingStatus === 'married') { // Check if the filing status is 'married'
        if (incomeValue <= 20000) tax = incomeValue * 0.1;  // If income is less than or equal to $20,000, apply a 10% tax rate
        else if (incomeValue <= 80000) tax = 2000 + (incomeValue - 20000) * 0.12; // If income is between $20,001 and $80,000, apply a base tax of $2,000 plus 12% on the income exceeding $20,000
        else tax = 9200 + (incomeValue - 80000) * 0.22;// If income is greater than $80,000, apply a base tax of $9,200 plus 22% on the income exceeding $80,000
      }
    }

    // Business Tax Calculation for LLC
    if (businessType === 'llc') {
      const socialSecurityLimit = 160200; // Example limit for Social Security tax
      const selfEmploymentTaxRate = 0.153; // 15.3% total self-employment tax
      const qbiDeductionRate = 0.20; // 20% Qualified Business Income deduction

      // Calculate the self-employment tax
      let selfEmploymentTax = incomeValue * selfEmploymentTaxRate;

      // Adjust Social Security portion if income exceeds the limit
      if (incomeValue > socialSecurityLimit) {
        const socialSecurityTax = socialSecurityLimit * 0.124; // 12.4% up to the limit
        const medicareTax = incomeValue * 0.029; // 2.9% Medicare tax
        selfEmploymentTax = socialSecurityTax + medicareTax;
      }

      // Calculate QBI deduction (20% of income)
      const qbiDeduction = incomeValue * qbiDeductionRate;

      // Subtract QBI deduction from income before calculating federal income tax
      const taxableIncome = incomeValue - qbiDeduction;

      // Apply self-employment tax and add it to federal income tax
      tax = selfEmploymentTax + taxableIncome * 0.22; // Example: using a flat 22% federal tax rate for simplicity
    }

    // Business Tax Calculation for S-Corp
    if (businessType === 'scorp') {
      const salaryValue = parseFloat(salary);
      if (isNaN(salaryValue) || salaryValue <= 0 || salaryValue > incomeValue) {
        alert('Please enter a valid salary amount less than or equal to the total income.');
        return;
      }

      const distribution = incomeValue - salaryValue;

      // Payroll tax rates
      const socialSecurityLimit = 160200; // Example limit for Social Security tax
      const socialSecurityRate = 0.124; // 12.4% Social Security tax
      const medicareRate = 0.029; // 2.9% Medicare tax
      const additionalMedicareRate = 0.009; // 0.9% additional Medicare tax for high earners

      // Calculate Social Security tax (up to the wage base limit)
      let socialSecurityTax = Math.min(salaryValue, socialSecurityLimit) * socialSecurityRate;

      // Calculate Medicare tax
      let medicareTax = salaryValue * medicareRate;

      // Apply additional Medicare tax for high earners (e.g., income over $200,000)
      if (salaryValue > 200000) {
        medicareTax += (salaryValue - 200000) * additionalMedicareRate;
      }

      // Total payroll taxes
      const payrollTaxes = socialSecurityTax + medicareTax;

      // Qualified Business Income (QBI) deduction (20% of distribution)
      const qbiDeduction = distribution * 0.20;

      // Calculate taxable income after QBI deduction
      const taxableIncome = distribution - qbiDeduction;

      // Federal income tax (using a simplified flat rate of 22% for demonstration purposes)
      const federalIncomeTax = taxableIncome * 0.22;

      // Total tax (payroll taxes on salary + federal income tax on distribution)
      tax = payrollTaxes + federalIncomeTax;
    }

    // Business Tax Calculation for C-Corp
    if (businessType === 'c-corp') {
      const corporateTaxRate = 0.21; // Federal corporate tax rate
      const dividendTaxRate = 0.15; // Simplified dividend tax rate
      const stateTaxRate = 0.05; // Example state tax rate
      const accumulatedEarningsTaxRate = 0.20;
    
      // Parse additional inputs
      const previousNOLValue = parseFloat(previousNOL) || 0;
      const retainedEarningsValue = parseFloat(retainedEarnings) || 0;
      const dividendsPaid = parseFloat(dividends) || 0;
    
      // Validate parsed inputs
      if (previousNOLValue < 0 || retainedEarningsValue < 0 || dividendsPaid < 0) {
        alert('Please enter valid non-negative amounts for NOL, retained earnings, and dividends.');
        return;
      }
    
      // Calculate state and federal corporate taxes
      const stateTax = incomeValue * stateTaxRate;
      const taxableIncome = Math.max(0, incomeValue - (previousNOLValue * 0.8));
      const federalTax = taxableIncome * corporateTaxRate;
      const totalCorporateTax = federalTax + stateTax;
    
      // Estimate dividend tax only if dividends are paid out
      const dividendTax = dividendsPaid * dividendTaxRate;
    
      // Calculate potential accumulated earnings tax on excess retained earnings
      const excessRetainedEarnings = Math.max(0, retainedEarningsValue - 250000);
      const accumulatedEarningsTax = excessRetainedEarnings * accumulatedEarningsTaxRate;
    
      // Calculate final corporate tax including accumulated earnings tax
      const finalCorporateTax = totalCorporateTax + accumulatedEarningsTax;
    
      // Log dividend tax separately (shareholder-level tax)
      console.log(`Dividend Tax (Shareholder Level): ${dividendTax}`);
    
      // Set the estimated tax
      tax = finalCorporateTax;
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
              <option value="c-corp">C-Corp</option>
            </select>
            <div className='tex_sec'>
              {businessType === 'scorp' && (
                <label className="pt_Cat">
                  <span className="lable_cal">Reasonable Salary: $</span>
                  <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="Salary amount"
                    className="select-pt-Cat"
                  />
                </label>
              )}
            </div>
            <div className='tax-sec'>
              {businessType === 'c-corp' && (
              <>
                <label className="pt_Cat">
                  <span className="lable_cal">Previous Net Operating Loss: $</span>
                  <input
                    type="number"
                    value={previousNOL}
                    onChange={(e) => setPreviousNOL(e.target.value)}
                    placeholder="Previous NOL"
                    className="select-pt-Cat"
                  />
                </label>

                <label className="pt_Cat">
                  <span className="lable_cal">Dividends Paid: $</span>
                  <input
                    type="number"
                    value={dividends}
                    onChange={(e) => setDividends(e.target.value)}
                    placeholder="Dividends paid"
                    className="select-pt-Cat"
                  />
                </label>

                <label className="pt_Cat">
                  <span className="lable_cal">Retained Earnings: $</span>
                  <input
                    type="number"
                    value={retainedEarnings}
                    onChange={(e) => setRetainedEarnings(e.target.value)}
                    placeholder="Retained earnings"
                    className="select-pt-Cat"
                  />
                </label>
              </>
            )}
          </div>


          </label>
          <div className="tax-button">
          <button onClick={calculateTax} className="button type1">
          <span className='btn-txt'>Calculate Tax</span></button>
          </div>
          {estimatedTax !== null && (
            <div className="tax-result">
              <h3>Estimated Tax: ${estimatedTax}</h3>
              <p className="disclaimer">
                *Disclaimer: This calculation is only an estimate and may not reflect the actual tax amount owed. The salary amount for S-Corp should be a reasonable compensation. Please consult a tax professional for accurate tax advice.
              </p>

            </div>
          )}
        </div>
      </section>

      <section>
        <h2>Business Tax Information</h2>
        {/* LLC Tax Information Drop-down */}
        <button 
          className='toggle-header' 
          onClick={toggleLLCInfo}>
          LLC Tax Information {showLLCInfo ? '▲' : '▼'}
        </button>
        {showLLCInfo && (
          <div className="tax-info-content">
        <p >
          LLCs (Limited Liability Companies) are typically treated as pass-through entities for tax purposes.
          This means that the business income is passed through to the owner's personal tax return, and the owner
          pays self-employment taxes on the income. The self-employment tax rate is 15.3%, which includes
          Social Security (12.4%) and Medicare (2.9%). However, only the first $160,200 of income is subject to
          the Social Security portion of the tax (for the 2024 tax year).
        </p>
        <p>
          LLC owners may also qualify for the Qualified Business Income (QBI) deduction, which allows for a
          20% deduction on the business income before calculating federal income tax. This can significantly
          reduce the taxable income. However, eligibility for the QBI deduction may be limited based on
          income thresholds and the type of business.
        </p>
        <p>
          Keep in mind that LLCs have flexibility in how they are taxed. By default, a single-member LLC is treated
          as a sole proprietorship, while a multi-member LLC is treated as a partnership. LLCs can also choose
          to be taxed as an S-Corp or C-Corp by filing an election with the IRS (Form 2553 or Form 8832).
        </p>
        </div>
        )}

        {/* S-Corp Tax Information Drop-down */}
        <button 
          className='toggle-header'
          onClick={toggleSCorpInfo}>
          S-Corp Tax Information {showSCorpInfo ? '▲' : '▼'}
        </button>
        {showSCorpInfo && (
          <div className="tax-info-content">
        <p>
          An S-Corp (S Corporation) offers a way for business owners to potentially reduce their self-employment tax liability.
          In an S-Corp, owners (shareholders) can receive both a salary and a distribution of profits. The salary is subject
          to payroll taxes, including Social Security and Medicare taxes, but the profit distributions are not subject
          to self-employment taxes.
        </p>
        <p>
          The IRS requires S-Corp owners to take a "reasonable salary" for the work they perform. This salary is subject
          to Social Security (12.4%) and Medicare (2.9%) taxes, up to the Social Security wage base limit of $160,200
          (for the 2024 tax year). High earners may also be subject to an additional 0.9% Medicare tax on wages exceeding $200,000.
        </p>
        <p>
          S-Corp owners can also take advantage of the Qualified Business Income (QBI) deduction, which allows for a 20% deduction
          on the business income (excluding the salary portion). This deduction can help reduce the overall taxable income.
          However, eligibility for the QBI deduction may be limited based on income levels and the type of business.
        </p>
        <p>
          It's important to maintain proper documentation for salary payments and profit distributions, as the IRS may scrutinize
          S-Corp filings to ensure reasonable compensation is paid. Failure to take a reasonable salary can result in penalties
          and additional taxes.
        </p>
        </div>
      )}
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
