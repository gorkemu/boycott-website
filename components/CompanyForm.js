import React, { useState } from 'react';

function CompanyForm({ onAddCompany }) {
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState(null); // Add error state

  const handleSubmit = (e) => {
    e.preventDefault();
    if (companyName.trim() === '') {
      setError('Please enter a company name.'); // Set error state
      return;
    }
    setError(null); // Clear error state before making the request
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Unauthorized: Please log in to add a company.'); // Set error state
      return;
    }

    fetch('http://localhost:5000/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include JWT
      },
      body: JSON.stringify({ name: companyName }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to add company.');
        }
        return res.json();
      })
      .then((data) => {
        onAddCompany(data.name); // Pass only the name to onAddCompany
        setCompanyName('');
      })
      .catch((err) => {
        setError(err.message); // Set error state
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Enter company name"
      />
      <button type="submit">Add Company</button>
      {error && <p className="error">{error}</p>} {/* Display error message */}
    </form>
  );
}

export default CompanyForm;
