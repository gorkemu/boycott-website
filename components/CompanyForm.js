import React, { useState } from 'react';
import './CompanyForm.css';

function CompanyForm({ onAddCompany }) {
  const [newCompany, setNewCompany] = useState('');
  const [error, setError] = useState(''); // Add error state

  const handleAddCompany = () => {
    if (newCompany.trim() === '') {
      setError('Please enter a company name.'); // Set error state
      return;
    }
    onAddCompany(newCompany);
    setNewCompany('');
    setError(''); // Clear error state after successful add
  };

  return (
    <div className="company-form">
      <input
        type="text"
        value={newCompany}
        onChange={(e) => {
          setNewCompany(e.target.value);
          setError(''); // Clear error on input change
        }}
        placeholder="Enter company name"
      />
      <button onClick={handleAddCompany}>Add</button>
      {error && <p className="error">{error}</p>} {/* Display error */}
    </div>
  );
}

export default CompanyForm;