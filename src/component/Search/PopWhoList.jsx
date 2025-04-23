import React, { useState } from 'react';
import SamplePopData from '../../datas/SamplePopData.js';
import { Button } from 'react-bootstrap';

const PopWhoList = () => {
  const [posts, setPosts] = useState(SamplePopData);

  return (
    <div
      style={{
        
        width: '500px',
        backgroundColor: '#E0F7FA',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        overflowY: 'auto',
      }}
    >
      <h4 style={{ marginBottom: '20px' }}>누구랑 가나요?</h4>
      {posts.map((item, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            padding: '10px 15px',
            marginBottom: '10px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <span>{item.label}</span>
          <Button variant="primary">찜하기</Button>
        </div>
      ))}
    </div>
  );
};

export default PopWhoList;
