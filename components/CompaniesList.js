import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import './CompaniesList.css';
import CompanyItem from './CompanyItem';
const CompanyForm = lazy(() => import('./CompanyForm'));

function CompaniesList() {
  const [companies, setCompanies] = useState([]);
  const [companyComments, setCompanyComments] = useState({});
  const [showCommentsFor, setShowCommentsFor] = useState(null);
  const [sortType, setSortType] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to include Authorization header
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Unauthorized: Please log in to perform this action.');
    }
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const headers = getAuthHeaders();
        const response = await fetch('http://localhost:5000/companies', {
          headers: headers,
        });
        if (!response.ok) {
          throw new Error('Failed to fetch companies.');
        }
        const data = await response.json();
        setCompanies(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleAddCompany = (companyName) => {
    if (companyName.trim() === '') {
      alert('Please enter a company name.');
      return;
    }
    setLoading(true);
    fetch('http://localhost:5000/companies', {
      method: 'POST',
      headers: getAuthHeaders(), // Use the helper function
      body: JSON.stringify({ name: companyName }),
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

  const handleVote = useCallback((id, voteType) => {
    setLoading(true);
    fetch(`http://localhost:5000/companies/${id}/${voteType}`, {
      method: 'PUT',
      headers: getAuthHeaders(), // Use the helper function
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
        setError(err.message);
        setLoading(false);
      });
  }, [setCompanies, setLoading, setError, companies, getAuthHeaders]); //Added getAuthHeaders to dependencies

  const handleAddComment = (id, comment) => {
    if (comment.trim() === '') {
      alert('Please enter a comment.');
      return;
    }
    setLoading(true);
    fetch(`http://localhost:5000/companies/${id}/comments`, {
      method: 'PUT',
      headers: getAuthHeaders(), // Use the helper function
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
        setError(err.message);
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
