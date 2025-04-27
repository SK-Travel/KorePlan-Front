import React from 'react';
import MapImage from '../../assets/SampleMap.png';

const SpotMap = () => {
  return (
    <div style={{
      width: '100%', //부모 div에 맞도록 크기 지정
      maxWidth: '800px',
      margin: '0 auto',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    }}>
      <img
        src={MapImage}
        alt="선택한 장소의 지도 미리보기"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
        }}
      />
    </div>
  );
};

export default SpotMap;
