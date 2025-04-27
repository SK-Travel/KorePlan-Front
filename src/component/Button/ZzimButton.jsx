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
        transition: 'transform 0.2s',  // ✅ 부드럽게
        cursor: 'pointer',
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
    >
      {isLiked ? <BsHeartFill /> : <BsHeart />}
    </Button>
  );
};

export default ZzimButton;
