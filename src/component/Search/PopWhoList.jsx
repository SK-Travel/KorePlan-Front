import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { BsHeart, BsHeartFill } from 'react-icons/bs'; // Bootstrap icons
import SamplePopData from '../../datas/SearchSample/SamplePopData';

const PopWhoList = () => {
  const [likedList, setLikedList] = useState([]);

  const toggleLike = (label) => {
    if (likedList.includes(label)) {
      setLikedList(likedList.filter((item) => item !== label));
    } else {
      setLikedList([...likedList, label]);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#E0F7FA',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        overflowY: 'auto',
      }}
    >
      {SamplePopData.map((item, index) => {
        const isLiked = likedList.includes(item.label);

        return (
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
            <Button
              variant="light"
              onClick={() => toggleLike(item.label)}
              style={{ fontSize: '1.5rem', color: isLiked ? 'red' : 'gray', border: 'none' }}
            >
              {isLiked ? <BsHeartFill /> : <BsHeart />}
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default PopWhoList;
