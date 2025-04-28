import React, { useState } from 'react';
import SampleFesData from '../../datas/SearchSample/SampleFesData';
import ZzimButton from '../Button/ZzimButton';
const Festival = () => {
  const [posts, setPosts] = useState(SampleFesData);

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#FFF8DC',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h4 style={{ marginBottom: '15px' }}>월의 축제</h4>
      <ul style={{ paddingLeft: '0' }}>
        {posts.map((item, idx) => (
          
          <li
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              border: 'none',
              backgroundColor: 'transparent',
              padding: '16px 0',
              flexWrap: 'wrap',  
            }}
          >
            <div style={{ flex: '0 0 auto' }}>
              <img
                src={item.imgUrl}
                alt={item.label}
                style={{
                  width: '180px',
                  height: '280px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  flexShrink: 0,
                }}
              />
            </div>

            <div style={{ flex: '1', minWidth: '200px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '24px' }}>{item.label}</span><ZzimButton/>
              <p style={{ color: '#888', fontSize: '16px', lineHeight: '1.6', marginTop: '10px' }}>
              {item.comment || "장소 설명이 없습니다."}
              </p>
            </div>
          </li> 
        ))}
      </ul>
    </div>
  );
};

export default Festival;


