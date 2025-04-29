import React from 'react';
import { Button } from 'react-bootstrap';
import { BsHeart, BsHeartFill } from 'react-icons/bs';

const ZzimButton = ({ isLiked, onClick }) => {
  return (
    <Button
      variant="light"
      onClick={onClick}
      style={{
        fontSize: '1.5rem',
        color: isLiked ? 'red' : 'gray',
        border: 'none',
        transition: 'transform 0.2s',  
        cursor: 'pointer',
      }}
      //애니메이션 효과 마우스 올렸을 때/ 뗀 경우. 크기 변화주기
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
    >
      {isLiked ? <BsHeartFill /> : <BsHeart />}
    </Button>
  );
};

export default ZzimButton;
