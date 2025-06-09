import React, { useEffect, useRef } from 'react';

const SpotMap = ({ spotData }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);

  useEffect(() => {
    if (!window.naver || !mapRef.current || !spotData) return;

    // 맵 생성 - 모든 인터랙션 비활성화
    mapInstance.current = new window.naver.maps.Map(mapRef.current, {
      center: new window.naver.maps.LatLng(spotData.mapy, spotData.mapx),
      zoom: 15,
      // 모든 인터랙션 비활성화 옵션들
      draggable: false,          // 드래그 비활성화
      pinchZoom: false,          // 핀치 줌 비활성화
      scrollWheel: false,        // 스크롤 휠 줌 비활성화
      keyboardShortcuts: false,  // 키보드 단축키 비활성화
      disableDoubleTapZoom: true, // 더블탭 줌 비활성화
      disableDoubleClickZoom: true, // 더블클릭 줌 비활성화
      disableTwoFingerTapZoom: true, // 두 손가락 탭 줌 비활성화
      zoomControl: false,        // 줌 컨트롤 버튼 숨기기
      mapTypeControl: false,     // 지도 유형 컨트롤 숨기기
      scaleControl: false,       // 축척 컨트롤 숨기기
      logoControl: false,        // 네이버 로고 숨기기
      mapDataControl: false,     // 지도 데이터 저작권 컨트롤 숨기기
      zoomControlOptions: {
        style: window.naver.maps.ZoomControlStyle.NONE
      }
    });

    // 마커 생성
    markerInstance.current = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(spotData.mapy, spotData.mapx),
      map: mapInstance.current
    });

    // 클린업 함수
    return () => {
      if (markerInstance.current) {
        markerInstance.current.setMap(null);
      }
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, [spotData]);

  if (!spotData || !spotData.mapx || !spotData.mapy) {
    return (
      <div style={{
        width: '100%',
        height: '400px',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        color: '#6c757d',
        fontSize: '16px'
      }}>
        📍 위치 정보가 없습니다
      </div>
    );
  }

  return (
    <div style={{ 
      border: '1px solid #e9ecef', 
      borderRadius: '8px', 
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '400px',
          position: 'relative'
        }}
      />
      {/* 지도 위에 투명한 오버레이를 추가하여 클릭 방지 (추가 보험) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        pointerEvents: 'none', // 마우스 이벤트는 통과시키되 지도 조작은 방지
        zIndex: 1
      }} />
    </div>
  );
};

export default SpotMap;