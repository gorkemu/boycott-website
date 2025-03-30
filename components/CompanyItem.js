import React from 'react';

function CompanyItem({ company, handleVote, handleToggleComments, showCommentsFor, companyComments, handleCommentChange, handleAddComment }) {
  return (
    <li key={company._id}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '50px', height: '50px', border: '1px solid #ccc', marginRight: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          Logo
        </div>
        <div>
          {company.name} -
          <span style={{ color: 'green', marginLeft: '5px' }}>👍 {company.upvotes}</span> -
          <span style={{ color: 'red', marginLeft: '5px' }}>👎 {company.downvotes}</span>
        </div>
      </div>
      <button onClick={() => handleVote(company._id, 'upvote')}>👍</button>
      <button onClick={() => handleVote(company._id, 'downvote')}>👎</button>
      <button onClick={() => handleToggleComments(company._id)}>💬</button>
      {showCommentsFor === company._id && (
        <div>
          <ul>
            {company.comments.map((comment, commentIndex) => (
              <li key={commentIndex}>{comment}</li>
            ))}
          </ul>
          <input
            type="text"
            value={companyComments[company._id] || ''}
            onChange={(e) => handleCommentChange(company._id, e.target.value)}
            placeholder="Enter comment"
          />
          <button onClick={() => handleAddComment(company._id, companyComments[company._id])}>Add 💬</button>
        </div>
      )}
    </li>
  );
}

export default CompanyItem;