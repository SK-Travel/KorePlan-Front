import React, { useState } from 'react';
import SampleFesData from '../../datas/SampleFesData';

const Festival = () => {
  const [posts, setPosts] = useState(SampleFesData);

  return (
    <div
      style={{
        width: '250px',
        backgroundColor: '#FFF8DC',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h4 style={{ marginBottom: '15px' }}>이달의 축제</h4>
      <ol className="list-group list-group-numbered">
        {posts.map((item, idx) => (
          <li
            key={idx}
            className="list-group-item"
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              padding: '6px 0',
            }}
          >
            <a href="#" style={{ textDecoration: 'none', color: '#007bff' }}>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Festival;
