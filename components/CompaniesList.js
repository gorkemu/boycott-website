import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import './CompaniesList.css'; // Import CSS
import CompanyItem from './CompanyItem';
const CompanyForm = lazy(() => import('./CompanyForm'));

function CompaniesList() {
  const [companies, setCompanies] = useState([]);
  const [companyComments, setCompanyComments] = useState({});
  const [showCommentsFor, setShowCommentsFor] = useState(null);
  const [sortType, setSortType] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/companies')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch companies.');
        }
        return res.json();
      })
      .then((data) => {
        setCompanies(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message === 'Failed to fetch companies.') {
          setError('Sorry, we could not retrieve the list of companies. Please try again later.');
        } else {
          setError('An unexpected error occurred while loading companies. Please try again.');
        }
        setLoading(false);
      });
  }, []);

  const handleAddCompany = (companyName) => {
    if (companyName.trim() === '') {
      // This check is redundant, as it is already being checked in CompanyForm.js
      // However, keeping it here adds an extra layer of safety.
      alert('Please enter a company name.');
      return;
    }
    setLoading(true);
    fetch('http://localhost:5000/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: companyName }), // Use companyName passed from CompanyForm
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
        if (err.message === 'Failed to add company.') {
          setError('There was a problem adding the company. Please check your network connection and try again.');
        } else {
          setError('An unexpected error occurred while adding the company.');
        }
        setLoading(false);
      });
  };

  const handleVote = useCallback((id, voteType) => {
    setLoading(true);
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
        setLoading(false);
      })
      .catch((err) => {
        if (err.message === `Failed to ${voteType} company.`) {
          setError(`Failed to ${voteType} the company. Please try again.`);
        } else {
          setError(`An unexpected error occurred while ${voteType}ing.`);
        }
        setLoading(false);
      });
  }, [setCompanies, setLoading, setError, companies]); // Dependencies

  const handleAddComment = (id, comment) => {
    if (comment.trim() === '') {
      alert('Please enter a comment.'); // Or set and display an error state.
      return; // Prevent API call
    }
    setLoading(true);
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
        setLoading(false);
      })
      .catch((err) => {
        if (err.message === 'Failed to add comment.') {
          setError('Failed to add comment. Please try again.');
        } else {
          setError('An unexpected error occurred while adding a comment.');
        }
        setLoading(false);
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
    <div className="companies-list">
      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading...</p>}
      <h2>Boycott Companies</h2>
      <Suspense fallback={<div>Loading Form...</div>}>
                <CompanyForm onAddCompany={handleAddCompany} />
            </Suspense>
      <div className="sort-buttons">
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