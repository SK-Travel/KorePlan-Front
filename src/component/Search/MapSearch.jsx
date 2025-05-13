//지도 부분은 검색결과에 대한 maker 표시 & 테마 선택시 테마에 대한 장소 표시하기.

import React, { useEffect, useRef } from 'react';

const MapSearch = ({ selectedPlace }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!window.naver || !mapRef.current) return;

    mapInstance.current = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(37.5665, 126.9780), // 초기 중심
      zoom: 12,
    });
  }, []);

  useEffect(() => {
    if (!selectedPlace || !mapInstance.current) return;

    const { lat, lng, name } = selectedPlace;

    const latLng = new window.naver.maps.LatLng(lat, lng);
    new window.naver.maps.Marker({
      position: latLng,
      map: mapInstance.current,
      title: name,
    });

    mapInstance.current.setCenter(latLng);
  }, [selectedPlace]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

export default MapSearch;
