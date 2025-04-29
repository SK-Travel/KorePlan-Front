import React, { useState } from 'react';
import ZzimButton from '../Button/ZzimButton';
import { Link } from 'react-router-dom';
import SamplePopData from '../../datas/Sample/SamplePopData';

const Popular = () => {
  const [likedList, setLikedList] = useState([]);

  const toggleLike = (id) => {
    if (likedList.includes(id)) {
      setLikedList(likedList.filter((itemId) => itemId !== id));
    } else {
      setLikedList([...likedList, id]);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#E0F7FA',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        maxHeight: '400px',
        overflowY: 'auto',
        width: '100%',
      }}
    >
      {SamplePopData.map((item) => {
        const isLiked = likedList.includes(item.id);

        return (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#ffffff',
              padding: '10px 15px',
              marginBottom: '10px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              gap: '10px',
            }}
          >
            <img
              src={item.imgUrl}
              alt={`${item.region} ${item.spot}`}
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
            <Link
              to={`/spot/${item.id}`}
              style={{
                flex: 1,
                textDecoration: 'none',
                color: '#333',
                fontWeight: 'bold',
              }}
            >
              {item.region} {item.spot}
            </Link>
            <ZzimButton
              isLiked={isLiked}
              onClick={() => toggleLike(item.id)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Popular;
