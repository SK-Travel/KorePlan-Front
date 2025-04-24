import React, { useState } from 'react';
import SamplePopData from '../../datas/SearchSample/SamplePopData.js';
import { Button } from 'react-bootstrap';

const PopWhatList = () => {
  const [posts, setPosts] = useState(SamplePopData);

  return (
    <div
      style={{
        width: '100%',         // ✅ 반드시 추가!
        maxWidth: '500px',     // ✅ 반응형을 위한 제한
        backgroundColor: '#E0F7FA',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        overflowY: 'auto',
      }}
    >
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
          <Button variant="primary">찜</Button>
        </div>
      ))}
    </div>
  );
};

export default PopWhatList;

