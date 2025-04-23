import React from 'react';
import SampleReviewData from '../../datas/SampleReviewData';

const ReviewList = () => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '500px',
        marginTop: '20px',
      }}
    >
      <h5>후기</h5>
      {SampleReviewData.map((r, idx) => (
        <p key={idx} style={{ fontSize: '14px', marginBottom: '10px' }}>
          <strong>{r.user}</strong>: {r.comment}
        </p>
      ))}
    </div>
  );
};

export default ReviewList;
