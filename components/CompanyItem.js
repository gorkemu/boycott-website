import React, { useState } from 'react';
import './CompanyItem.css';

function CompanyItem({ company, handleVote, handleToggleComments, showCommentsFor, companyComments, handleCommentChange, handleAddComment }) {
  const [commentError, setCommentError] = useState('');
  const [userVote, setUserVote] = useState(null); // Track user vote

  const handleVoteClick = (voteType) => {
    if (userVote === voteType) {
      setUserVote(null); // Remove vote
      handleVote(company._id, null); // Send null to backend
    } else {
      setUserVote(voteType); // Change vote
      handleVote(company._id, voteType); // Send vote to backend
    }
  };

  const handleAddCommentWrapper = (id, comment) => {
    if (comment.trim() === '') {
      setCommentError('Please enter a comment.');
      return;
    }
    handleAddComment(id, comment);
    setCommentError('');
  };

  return (
    <li className="company-item" key={company._id}>
      <div className="company-item-logo">
        Logo
      </div>
      <div className="company-item-details">
        {company.name} -
        <span className="company-item-votes upvotes">👍 {company.upvotes}</span> -
        <span className="company-item-votes downvotes">👎 {company.downvotes}</span>
      </div>
      <div className="company-item-actions">
        <button
          onClick={() => handleVoteClick('upvote')}
          className={userVote === 'upvote' ? 'active' : ''}
        >
          👍
        </button>
        <button
          onClick={() => handleVoteClick('downvote')}
          className={userVote === 'downvote' ? 'active' : ''}
        >
          👎
        </button>
        <button onClick={() => handleToggleComments(company._id)}>💬</button>
      </div>
      {showCommentsFor === company._id && (
        <div className="company-item-comments">
          <ul>
            {company.comments.map((comment, commentIndex) => (
              <li key={commentIndex}>{comment}</li>
            ))}
          </ul>
          <input
            type="text"
            value={companyComments[company._id] || ''}
            onChange={(e) => {
              handleCommentChange(company._id, e.target.value);
              setCommentError('');
            }}
            placeholder="Enter comment"
          />
          <button onClick={() => handleAddCommentWrapper(company._id, companyComments[company._id])}>Add 💬</button>
          {commentError && <p className="error">{commentError}</p>}
        </div>
      )}
    </li>
  );
}

export default React.memo(CompanyItem);