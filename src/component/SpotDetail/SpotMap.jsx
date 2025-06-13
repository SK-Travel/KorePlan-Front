import React, { useEffect, useRef, useState } from 'react';

const SpotMap = ({ spotData }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // 지도 리사이즈 함수
  const resizeMap = () => {
    if (mapInstance.current) {
      try {
        // 네이버 지도 리사이즈
        mapInstance.current.autoResize();
        console.log('🗺️ 지도 리사이즈 실행');
      } catch (error) {
        console.warn('지도 리사이즈 실패:', error);
      }
    }
  };

  useEffect(() => {
    if (!window.naver || !mapRef.current || !spotData) return;

    console.log('🗺️ SpotMap 초기화 시작');

    // 지도 컨테이너 크기 강제 설정
    if (mapRef.current) {
      mapRef.current.style.width = '100%';
      mapRef.current.style.height = '400px';
    }

    // 약간의 지연 후 지도 생성 (부모 컨테이너 크기 확정 대기)
    const initTimer = setTimeout(() => {
      try {
        // 맵 생성 - 모든 인터랙션 비활성화
        mapInstance.current = new window.naver.maps.Map(mapRef.current, {
          center: new window.naver.maps.LatLng(spotData.mapy, spotData.mapx),
          zoom: 15,
          // 모든 인터랙션 비활성화 옵션들
          draggable: false,          
          pinchZoom: false,          
          scrollWheel: false,        
          keyboardShortcuts: false,  
          disableDoubleTapZoom: true, 
          disableDoubleClickZoom: true, 
          disableTwoFingerTapZoom: true, 
          zoomControl: false,        
          mapTypeControl: false,     
          scaleControl: false,       
          logoControl: false,        
          mapDataControl: false,     
          zoomControlOptions: {
            style: window.naver.maps.ZoomControlStyle.NONE
          }
        });

        // 마커 생성
        markerInstance.current = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(spotData.mapy, spotData.mapx),
          map: mapInstance.current
        });

        setIsMapLoaded(true);
        console.log('🗺️ 지도 생성 완료');

        // 지도 로드 완료 후 리사이즈 실행
        setTimeout(() => {
          resizeMap();
        }, 100);

        // 추가 안전장치 - 300ms 후 한 번 더
        setTimeout(() => {
          resizeMap();
        }, 300);

      } catch (error) {
        console.error('지도 생성 실패:', error);
      }
    }, 50);

    // 클린업 함수
    return () => {
      clearTimeout(initTimer);
      if (markerInstance.current) {
        markerInstance.current.setMap(null);
      }
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
      setIsMapLoaded(false);
    };
  }, [spotData]);

  // 윈도우 리사이즈 감지
  useEffect(() => {
    const handleResize = () => {
      console.log('🔄 윈도우 리사이즈 감지');
      setTimeout(resizeMap, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Intersection Observer로 컴포넌트가 화면에 보일 때 리사이즈
  useEffect(() => {
    if (!mapRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && isMapLoaded) {
            console.log('👁️ 지도가 화면에 보임 - 리사이즈 실행');
            setTimeout(resizeMap, 50);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(mapRef.current);

    return () => observer.disconnect();
  }, [isMapLoaded]);

  // spotData 변경 시 지도 중심점 업데이트
  useEffect(() => {
    if (mapInstance.current && spotData && spotData.mapx && spotData.mapy) {
      const newCenter = new window.naver.maps.LatLng(spotData.mapy, spotData.mapx);
      mapInstance.current.setCenter(newCenter);
      
      if (markerInstance.current) {
        markerInstance.current.setPosition(newCenter);
      }
      
      // 위치 변경 후 리사이즈
      setTimeout(resizeMap, 100);
    }
  }, [spotData?.mapx, spotData?.mapy]);

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
      position: 'relative',
      width: '100%',
      height: '400px'
    }}>
      {/* 로딩 인디케이터 */}
      {!isMapLoaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          color: '#6c757d',
          fontSize: '14px'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #e9ecef',
              borderTop: '2px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span>지도 로딩 중...</span>
          </div>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'relative'
        }}
      />
      
      {/* 지도 위에 투명한 오버레이를 추가하여 클릭 방지 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        pointerEvents: 'none',
        zIndex: 1
      }} />
    </div>
  );
};

export default SpotMap;