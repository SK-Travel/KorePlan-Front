import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import SamplePopData from "../../datas/SearchSample/SamplePopData";
import ZzimButton from "../Button/ZzimButton";

const SpotInfo = () => {
  const { id } = useParams(); //주소에서 id 받아오기
  const spot = SamplePopData.find((item) => item.id === parseInt(id)); // id 매칭

  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  if (!spot) {
    return <div>해당 장소를 찾을 수 없습니다.</div>; 
  }

  return (
    <div style={{
      width: '100%',
      padding: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      
      {/* 이미지 */}
      <img
        src={spot.imgUrl}
        alt={`${spot.region} ${spot.spot}`}
        style={{
          width: '100%',
          height: '300px',
          objectFit: 'cover',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
        }}
      />

      {/* 제목 + 찜 버튼 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '700', color: '#222' }}>
          {spot.region} {spot.spot}
        </h2>
        <ZzimButton isLiked={liked} onClick={toggleLike} />
      </div>

      {/* 설명 */}
      <p style={{ color: '#888', fontSize: '16px', lineHeight: '1.6' }}>
        {spot.comment || "장소 설명이 없습니다."}
      </p>
    </div>
  );
};

export default SpotInfo;