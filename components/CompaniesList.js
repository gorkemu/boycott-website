import React, { useState, useEffect } from 'react';
import '../style.css';
import CompanyItem from './CompanyItem';
import CompanyForm from './CompanyForm';

function CompaniesList() {
  const [companies, setCompanies] = useState([]);
  const [companyComments, setCompanyComments] = useState({});
  const [showCommentsFor, setShowCommentsFor] = useState(null);
  const [sortType, setSortType] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    setLoading(true); // Set loading to true before fetching
    fetch('http://localhost:5000/companies')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch companies.');
        }
        return res.json();
      })
      .then((data) => {
        setCompanies(data);
        setLoading(false); // Set loading to false after fetching
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false); // Set loading to false on error
      });
  }, []);

  const handleAddCompany = (companyName) => {
    if (companyName.trim() === '') {
      alert('Please enter a company name.');
      return;
    }
    setLoading(true);
    fetch('http://localhost:5000/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: companyName }), // Use companyName argument
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to add company.');
        }
        return res.json();
      })
      .then((data) => {
        setCompanies([...companies, data]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleVote = (id, voteType) => {
    setLoading(true); // Set loading to true before voting
    fetch(`http://localhost:5000/companies/${id}/${voteType}`, {
      method: 'PUT',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to ${voteType} company.`);
        }
        return res.json();
      })
      .then((updatedCompany) => {
        const updatedCompanies = companies.map((company) =>
          company._id === id ? updatedCompany : company
        );
        setCompanies(updatedCompanies);
        setLoading(false); // Set loading to false after voting
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false); // Set loading to false on error
      });
  };

  const handleAddComment = (id, comment) => {
    setLoading(true); // Set loading to true before adding comment
    fetch(`http://localhost:5000/companies/${id}/comments`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to add comment.');
        }
        return res.json();
      })
      .then((updatedCompany) => {
        const updatedCompanies = companies.map((company) =>
          company._id === id ? updatedCompany : company
        );
        setCompanies(updatedCompanies);
        setLoading(false); // Set loading to false after adding comment
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false); // Set loading to false on error
      });
  };

  const handleToggleComments = (id) => {
    setShowCommentsFor(showCommentsFor === id ? null : id);
    if (!companyComments[id]) {
      setCompanyComments({ ...companyComments, [id]: '' });
    }
  };

  const handleCommentChange = (id, value) => {
    setCompanyComments({ ...companyComments, [id]: value });
  };

  const sortedCompanies = React.useMemo(() => {
    const sortCompanies = [...companies];
    if (sortType) {
      sortCompanies.sort((a, b) => b[sortType] - a[sortType]);
    }
    return sortCompanies;
  }, [companies, sortType]);

  return (
    <div>
      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading...</p>}
      <h2>Boycott Companies</h2>
      <CompanyForm onAddCompany={handleAddCompany} /> 
      <div>
        <button onClick={() => setSortType('upvotes')}>Sort by Upvotes</button>
        <button onClick={() => setSortType('downvotes')}>Sort by Downvotes</button>
        <button onClick={() => setSortType(null)}>Clear Sort</button>
      </div>
      <ul>
        {sortedCompanies.map((company) => (
          <CompanyItem
            key={company._id}
            company={company}
            handleVote={handleVote}
            handleToggleComments={handleToggleComments}
            showCommentsFor={showCommentsFor}
            companyComments={companyComments}
            handleCommentChange={handleCommentChange}
            handleAddComment={handleAddComment}
          />
        ))}
      </ul>
    </div>
  );
}

export default CompaniesList;