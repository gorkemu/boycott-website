import React, { useState } from 'react';

function CompanyForm({ onAddCompany }) {
  const [newCompany, setNewCompany] = useState('');

  const handleAddCompany = () => {
    if (newCompany.trim() !== '') {
      onAddCompany(newCompany);
      setNewCompany('');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={newCompany}
        onChange={(e) => setNewCompany(e.target.value)}
        placeholder="Enter company name"
      />
      <button onClick={handleAddCompany}>Add</button>
    </div>
  );
}

export default CompanyForm;