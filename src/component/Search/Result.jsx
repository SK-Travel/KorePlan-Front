import React from 'react'
import SamplePicture from '../../assets/example.jpeg'

const Result = () => {
  return (
    <div
      style={{
        backgroundColor: '#f8f8f8',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '500px',
      }}
    >
      <img
        src={SamplePicture} 
        alt="부산 해운대"
        style={{ width: '100%', borderRadius: '8px' }}
      />
      <div style={{ marginTop: '10px', fontSize: '14px', color: '#333' }}>
        <strong>부산 해운대</strong> (관광 명소)<br />
        부산 해운대구 우동<br />
        📞 051-749-7612
      </div>
    </div>
  );
};

export default Result;
