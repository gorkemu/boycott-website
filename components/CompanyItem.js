import React, { useState } from 'react';
import './CompanyItem.css';

function CompanyItem({ company, handleVote, handleToggleComments, showCommentsFor, companyComments, handleCommentChange, handleAddComment }) {
  const [commentError, setCommentError] = useState(''); // Add commentError state

  const handleAddCommentWrapper = (id, comment) => {
    if (comment.trim() === '') {
      setCommentError('Please enter a comment.'); // Set commentError
      return;
    }
    handleAddComment(id, comment);
    setCommentError(''); // Clear error after successful add
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
        <button onClick={() => handleVote(company._id, 'upvote')}>👍</button>
        <button onClick={() => handleVote(company._id, 'downvote')}>👎</button>
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
              setCommentError(''); // Clear error on input change
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

export default React.memo(CompanyItem); // Wrap with React.memo