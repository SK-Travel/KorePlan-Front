import React,{useState} from 'react';
import FestivalData from '../../datas/SearchSample/SampleFesData'
import { useParams, } from 'react-router-dom';
import ZzimButton from '../Button/ZzimButton';
const FestivalInfo = () => {
    const { id } = useParams(); //주소에서 id 받아오기
    const spot = FestivalData.find((item) => item.id === parseInt(id)); // id 매칭
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
            <img src={spot.imgUrl} alt={spot.label} style={{
          width: '50%',
          height: '300px',
          objectFit: 'contain',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 4px 10px rgba(255, 255, 255, 1)',
        }}></img>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',}}>
                <h2>{spot.label}</h2>
                <ZzimButton isLiked={liked} onClick={toggleLike} />
            </div>
            <div style={{ marginTop: '10px', fontSize: '19px', color: '#333' }}>
                <strong>{spot.addr}</strong>
                </div>
            <p style={{ color: '#888', fontSize: '16px', lineHeight: '1.6' }}>
                {spot.comment || "장소 설명이 없습니다."}
            </p>
        </div>
    );
};

export default FestivalInfo;

