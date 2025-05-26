import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const MapWithMarkers = ({ places }) => {
    // HTML에서 지도를 그릴 <div>를 참조하기 위한 ref (DOM 직접 접근 용도)
    const mapRef = useRef(null);
    // 지도 인스턴스를 저장할 ref (지도를 재사용하거나 조작할 때 필요)
    const mapInstance = useRef(null);

     // 컴포넌트가 처음 렌더링될 때 한 번만 실행
    useEffect(() => {
        // 네이버 지도 API가 로드되지 않았거나 ref가 연결되지 않았을 경우 종료
        if(!window.naver || !mapRef.current) return;
        
        // 기본 위치: 서울 시청
        const center = new window.naver.maps.LatLng(37.5665, 126.9700);

        // 지도 인스턴스 생성 후 ref에 저장
        mapInstance.current = new window.naver.maps.Map(mapRef.current, {
            center,
            zoom: 14,
        })
    }, []);


    // places가 바뀔 때마다 실행: 마커 다시 그리기
    useEffect(() => {
    if(!window.naver || !mapInstance.current) return;

    const map = mapInstance.current;

    // 전달받은 장소 리스트에 대해 마커 생성
    places.forEach(({ name, lat, lng}) => {
        
        console.log("마커 위치:", name, lat, lng);

        new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(lat, lng), // 마커 위치
            map, // 표시할 지도 인터페이스
            title: name, // 지도에 마우스를 올렸을 때 나오는 이름
        });
    });

    // 마커가 하나 이상 있는 경우, 첫 번째 장소로 지도 중심 이동
    if (places.length > 0) {
        const { lat, lng } = places[0];
        map.setCenter(new window.naver.maps.LatLng(lat, lng));
    }
    }, [ places ]); // places배열이 바뀔 때마다 실행
    
    // 실제 지도가 그려짐 
    return (
        <div className="d-flex align-items-center justify-content-center text-end">
            <div ref={mapRef} style={{ width: '800px', height: '400px', border: '1px solid #ccc' }} />
        </div>
    );
};

// prop types 정의 (지도 받아오기)
MapWithMarkers.propTypes = {
    places: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            lat: PropTypes.number.isRequired,
            lng: PropTypes.number.isRequired
        })
    ).isRequired
};


export default MapWithMarkers;