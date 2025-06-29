// component/Search/NaverMap.jsx
import React, { useRef, useEffect, useCallback, useState } from 'react';

// 테마 설정
const THEME_CONFIG = {
    12: { icon: "🏛️", label: "관광지", color: "#FF6B6B" },
    14: { icon: "🎭", label: "문화시설", color: "#4ECDC4" },
    15: { icon: "🎪", label: "축제공연행사", color: "#45B7D1" },
    28: { icon: "🏃‍♂️", label: "레포츠", color: "#FECA57" },
    32: { icon: "🏨", label: "숙박", color: "#FF9FF3" },
    38: { icon: "🛍️", label: "쇼핑", color: "#54A0FF" },
    39: { icon: "🍽️", label: "음식점", color: "#5F27CD" }
};

const NaverMap = ({ 
    selectedPlace, 
    searchResults, 
    themeSearchResults, 
    likedPlaces, 
    isThemeMode, 
    selectedTheme,
    onPlaceSelect, 
    onCurrentLocationUpdate, 
    isPanelOpen,
    loadLikedPlaces,
    mapInstanceRef // 부모에서 전달받은 ref
}) => {
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const likedMarkersRef = useRef([]);
    const infoWindowRef = useRef(null);
    const [userLocation, setUserLocation] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [originalCenter, setOriginalCenter] = useState(null); // 원래 중심점 저장용

    // 화면 크기 감지
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 네이버 지도 초기화
    useEffect(() => {
        if (!mapRef.current) return;

        // 네이버 지도 API 로드 확인
        if (typeof window.naver === 'undefined') {
            console.error('네이버 지도 API가 로드되지 않았습니다.');
            mapRef.current.innerHTML = `
                <div style="
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 18px;
                    font-weight: 600;
                    text-align: center;
                    padding: 20px;
                ">
                    🗺️ 네이버 지도 API를 로드해주세요<br/>
                    <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">
                        HTML에 네이버 지도 스크립트를 추가하세요
                    </div>
                </div>
            `;
            return;
        }

        const naver = window.naver;

        if (!mapInstanceRef.current) {
            // 지도 생성
            mapInstanceRef.current = new naver.maps.Map(mapRef.current, {
                center: new naver.maps.LatLng(37.5665, 126.9780),
                zoom: 13,
                zoomControl: false,
                mapTypeControl: false,
                scaleControl: false,
                logoControl: false,
                mapDataControl: false
            });

            // 정보창 생성
            infoWindowRef.current = new naver.maps.InfoWindow({
                anchorSkew: true,
                borderColor: '#4ECDC4',
                borderWidth: 2,
                pixelOffset: new naver.maps.Point(20, -20)
            });

            // 지도 이벤트 등록
            naver.maps.Event.addListener(mapInstanceRef.current, 'click', () => {
                if (infoWindowRef.current) {
                    infoWindowRef.current.close();
                }
            });

            // 현재 위치 가져오기
            getCurrentLocation();

            console.log('✅ 지도 초기화 완료');
        }
    }, []);

    // 현재 위치 가져오기
    const getCurrentLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    setUserLocation({ lat, lng });
                    
                    if (onCurrentLocationUpdate) {
                        onCurrentLocationUpdate({ lat, lng });
                    }
                    
                    if (mapInstanceRef.current && window.naver) {
                        const center = new window.naver.maps.LatLng(lat, lng);
                        mapInstanceRef.current.setCenter(center);
                        setOriginalCenter({ lat, lng });
                        
                        // 현재 위치 마커 생성
                        new window.naver.maps.Marker({
                            position: center,
                            map: mapInstanceRef.current,
                            icon: {
                                content: `
                                    <div style="
                                        width: 20px; 
                                        height: 20px; 
                                        background-color: #4285f4; 
                                        border: 3px solid white;
                                        border-radius: 50%; 
                                        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                                    "></div>
                                `,
                                anchor: new window.naver.maps.Point(10, 10)
                            },
                            title: '현재 위치',
                            zIndex: 5
                        });
                    }
                },
                (error) => {
                    console.error('위치 정보를 가져올 수 없습니다:', error);
                    // 위치 정보 실패 시 서울 시청을 원래 중심점으로 설정
                    setOriginalCenter({ lat: 37.5665, lng: 126.9780 });
                }
            );
        } else {
            // Geolocation을 지원하지 않는 경우 서울 시청을 원래 중심점으로 설정
            setOriginalCenter({ lat: 37.5665, lng: 126.9780 });
        }
    }, [onCurrentLocationUpdate]);

    // 데스크탑에서 패널 상태에 따른 지도 중심점 조정
    const adjustMapCenterForPanel = useCallback(() => {
        if (isMobile || !mapInstanceRef.current || !window.naver || !originalCenter) return;

        const map = mapInstanceRef.current;
        const currentCenter = map.getCenter();
        
        if (isPanelOpen) {
            // 패널이 열렸을 때: 지도의 시각적 중심을 왼쪽으로 이동
            // 400px 패널 너비의 절반만큼 왼쪽으로 이동 (약 200px = 지도 너비의 약 15-20%)
            const mapSize = map.getSize();
            const offsetPixels = 100; // 픽셀 단위로 왼쪽 이동량
            
            // 현재 중심점에서 픽셀 오프셋만큼 이동한 좌표 계산
            const projection = map.getProjection();
            const centerPoint = projection.fromCoordToOffset(currentCenter);
            const newCenterPoint = new window.naver.maps.Point(
                centerPoint.x - offsetPixels,
                centerPoint.y
            );
            const newCenter = projection.fromOffsetToCoord(newCenterPoint);
            
            console.log('🗺️ 패널 열림 - 지도 중심을 왼쪽으로 이동:', {
                original: { lat: currentCenter.lat(), lng: currentCenter.lng() },
                adjusted: { lat: newCenter.lat(), lng: newCenter.lng() }
            });
            
            map.setCenter(newCenter);
        } else {
            // 패널이 닫혔을 때: 원래 중심점으로 복원하거나 현재 중심점 유지
            console.log('🗺️ 패널 닫힘 - 지도 중심 유지');
            // 특별한 조정 없이 현재 상태 유지
        }
    }, [isMobile, isPanelOpen, originalCenter]);

    // 패널 상태 변경에 따른 지도 중심점 조정
    useEffect(() => {
        if (!isMobile && mapInstanceRef.current) {
            // 지도 리사이즈 후 중심점 조정
            const adjustCenter = () => {
                if (window.naver && mapInstanceRef.current) {
                    try {
                        // 지도 리사이즈 이벤트 트리거
                        window.naver.maps.Event.trigger(mapInstanceRef.current, 'resize');
                        
                        // 중심점 조정
                        setTimeout(() => {
                            adjustMapCenterForPanel();
                        }, 100);
                    } catch (error) {
                        console.error('지도 중심점 조정 실패:', error);
                    }
                }
            };
            
            // 패널 애니메이션과 동기화하여 여러 번 조정
            setTimeout(adjustCenter, 100);
            setTimeout(adjustCenter, 350);
        }
    }, [isPanelOpen, isMobile, adjustMapCenterForPanel]);

    // 찜한 장소 마커 업데이트
    const updateLikedMarkersOnMap = useCallback((likedPlaces) => {
        if (!mapInstanceRef.current || !window.naver) return;

        const map = mapInstanceRef.current;
        const naver = window.naver;

        // 기존 찜 마커 제거
        likedMarkersRef.current.forEach(marker => marker.setMap(null));
        likedMarkersRef.current = [];

        likedPlaces.forEach((place) => {
            const marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(place.mapy, place.mapx),
                map,
                title: place.title,
                icon: {
                    content: `
                        <div style="
                            width: 28px; 
                            height: 28px; 
                            background-color: #ff4757; 
                            border-radius: 50%; 
                            border: 2px solid white; 
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-weight: bold;
                            font-size: 14px;
                            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                            cursor: pointer;
                            opacity: 0.8;
                        ">
                            💖
                        </div>
                    `,
                    anchor: new naver.maps.Point(14, 14)
                },
                zIndex: 1
            });

            naver.maps.Event.addListener(marker, 'click', () => {
                const content = `
                    <div style="padding: 12px; min-width: ${isMobile ? '180px' : '200px'};">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            <h4 style="margin: 0; font-size: ${isMobile ? '13px' : '14px'}; flex: 1;">${place.title}</h4>
                            <span style="color: #ff4757; font-size: 16px;">💖</span>
                        </div>
                        <p style="margin: 0; font-size: ${isMobile ? '11px' : '12px'}; color: #666;">${place.addr1}</p>
                        <div style="margin-top: 8px; text-align: center;">
                            <small style="color: #ff4757; font-size: ${isMobile ? '10px' : '11px'}; font-weight: 500;">
                                찜한 장소
                            </small>
                        </div>
                    </div>
                `;
                
                infoWindowRef.current.setContent(content);
                infoWindowRef.current.open(map, marker);
            });

            likedMarkersRef.current.push(marker);
        });
    }, [isMobile]);

    // 테마 검색 결과 마커 업데이트
    const updateThemeMarkersOnMap = useCallback((themeResults, theme) => {
        if (!mapInstanceRef.current || !window.naver) return;

        const map = mapInstanceRef.current;
        const naver = window.naver;

        // 기존 검색 마커 제거
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        const themeConfig = THEME_CONFIG[theme];
        
        themeResults.forEach((place, index) => {
            const isSelected = selectedPlace?.id === place.id;
            
            const marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(place.mapy, place.mapx),
                map,
                title: place.title,
                icon: {
                    content: `
                        <div style="
                            width: ${isMobile ? '32px' : '36px'}; 
                            height: ${isMobile ? '32px' : '36px'}; 
                            background-color: ${isSelected ? '#FF6B6B' : themeConfig.color}; 
                            border-radius: 50%; 
                            border: 3px solid white; 
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-weight: bold;
                            font-size: ${isMobile ? '14px' : '16px'};
                            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                            cursor: pointer;
                        ">
                            ${themeConfig.icon}
                        </div>
                    `,
                    anchor: new naver.maps.Point(isMobile ? 16 : 18, isMobile ? 16 : 18)
                },
                zIndex: isSelected ? 100 : 10
            });

            // 마커 클릭 이벤트
            naver.maps.Event.addListener(marker, 'click', () => {
                console.log('테마 마커 클릭:', place.title);
                onPlaceSelect(place);
                
                // 클릭한 마커로 지도 센터 이동
                const newCenter = new window.naver.maps.LatLng(place.mapy, place.mapx);
                mapInstanceRef.current.setCenter(newCenter);
                mapInstanceRef.current.setZoom(13);
                
                // 원래 중심점 업데이트
                setOriginalCenter({ lat: place.mapy, lng: place.mapx });
                
                // 정보창 표시
                const content = `
                    <div style="padding: 12px; min-width: ${isMobile ? '180px' : '220px'};">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            <h4 style="margin: 0; font-size: ${isMobile ? '13px' : '15px'}; flex: 1;">${place.title}</h4>
                            ${place.isBookmarked ? '<span style="color: #ff4757; font-size: 16px;">💖</span>' : ''}
                        </div>
                        <p style="margin: 0; font-size: ${isMobile ? '11px' : '12px'}; color: #666; margin-bottom: 4px;">${place.addr1}</p>
                        <div style="margin-top: 8px; text-align: center;">
                            <small style="color: ${themeConfig.color}; font-size: ${isMobile ? '10px' : '11px'}; font-weight: 500;">
                                ${themeConfig.label} #${index + 1}
                            </small>
                        </div>
                    </div>
                `;
                
                infoWindowRef.current.setContent(content);
                infoWindowRef.current.open(map, marker);
            });

            // 선택된 마커는 자동으로 인포윈도우 열기
            if (isSelected) {
                setTimeout(() => {
                    const content = `
                        <div style="padding: 12px; min-width: ${isMobile ? '180px' : '220px'};">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                                <h4 style="margin: 0; font-size: ${isMobile ? '13px' : '15px'}; flex: 1;">${place.title}</h4>
                                ${place.isBookmarked ? '<span style="color: #ff4757; font-size: 16px;">💖</span>' : ''}
                            </div>
                            <p style="margin: 0; font-size: ${isMobile ? '11px' : '12px'}; color: #666; margin-bottom: 4px;">${place.addr1}</p>
                            <div style="margin-top: 8px; text-align: center;">
                                <small style="color: ${themeConfig.color}; font-size: ${isMobile ? '10px' : '11px'}; font-weight: 500;">
                                    ${themeConfig.label} #${index + 1}
                                </small>
                            </div>
                        </div>
                    `;
                    
                    infoWindowRef.current.setContent(content);
                    infoWindowRef.current.open(map, marker);
                }, 100);
            }

            markersRef.current.push(marker);
        });
    }, [selectedPlace, onPlaceSelect, isMobile]);

    // 일반 검색 결과 마커 업데이트
    const updateSearchMarkersOnMap = useCallback((searchResults) => {
        if (!mapInstanceRef.current || !window.naver) return;

        const map = mapInstanceRef.current;
        const naver = window.naver;

        // 기존 검색 마커 제거
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        searchResults.forEach((place, index) => {
            const isSelected = selectedPlace?.id === place.id;
            
            const marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(place.mapy, place.mapx),
                map,
                title: place.title,
                icon: {
                    content: `
                        <div style="
                            width: ${isSelected ? (isMobile ? '14px' : '16px') : (isMobile ? '10px' : '12px')}; 
                            height: ${isSelected ? (isMobile ? '14px' : '16px') : (isMobile ? '10px' : '12px')}; 
                            background-color: ${isSelected ? '#FF6B6B' : '#E74C3C'}; 
                            border-radius: 50%; 
                            border: 2px solid white; 
                            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                            cursor: pointer;
                        ">
                        </div>
                    `,
                    anchor: new naver.maps.Point(
                        isSelected ? (isMobile ? 7 : 8) : (isMobile ? 5 : 6), 
                        isSelected ? (isMobile ? 7 : 8) : (isMobile ? 5 : 6)
                    )
                },
                zIndex: isSelected ? 100 : 10
            });

            // 마커 클릭 이벤트
            naver.maps.Event.addListener(marker, 'click', () => {
                console.log('검색 마커 클릭:', place.title);
                onPlaceSelect(place);
                
                const newCenter = new window.naver.maps.LatLng(place.mapy, place.mapx);
                mapInstanceRef.current.setCenter(newCenter);
                mapInstanceRef.current.setZoom(13);
                
                // 원래 중심점 업데이트
                setOriginalCenter({ lat: place.mapy, lng: place.mapx });
                
                // 정보창 표시
                const content = `
                    <div style="padding: 12px; min-width: ${isMobile ? '180px' : '220px'};">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                            <h4 style="margin: 0; font-size: ${isMobile ? '13px' : '15px'}; flex: 1;">${place.title}</h4>
                            ${place.isBookmarked ? '<span style="color: #ff4757; font-size: 16px;">💖</span>' : ''}
                        </div>
                        <p style="margin: 0; font-size: ${isMobile ? '11px' : '12px'}; color: #666; margin-bottom: 4px;">${place.addr1}</p>
                        ${place.regionName ? `<p style="margin: 0; font-size: ${isMobile ? '10px' : '11px'}; color: #4ECDC4;">${place.regionName}</p>` : ''}
                        ${place.dist ? `<p style="margin: 0; font-size: ${isMobile ? '10px' : '11px'}; color: #4ECDC4;">📍 ${Math.round(place.dist)}m</p>` : ''}
                        <div style="margin-top: 8px; text-align: center;">
                            <small style="color: #E74C3C; font-size: ${isMobile ? '10px' : '11px'}; font-weight: 500;">
                                검색 결과
                            </small>
                        </div>
                    </div>
                `;
                
                infoWindowRef.current.setContent(content);
                infoWindowRef.current.open(map, marker);
            });

            // 선택된 마커는 자동으로 인포윈도우 열기
            if (isSelected) {
                setTimeout(() => {
                    const content = `
                        <div style="padding: 12px; min-width: ${isMobile ? '180px' : '220px'};">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                                <h4 style="margin: 0; font-size: ${isMobile ? '13px' : '15px'}; flex: 1;">${place.title}</h4>
                                ${place.isBookmarked ? '<span style="color: #ff4757; font-size: 16px;">💖</span>' : ''}
                            </div>
                            <p style="margin: 0; font-size: ${isMobile ? '11px' : '12px'}; color: #666; margin-bottom: 4px;">${place.addr1}</p>
                            ${place.regionName ? `<p style="margin: 0; font-size: ${isMobile ? '10px' : '11px'}; color: #4ECDC4;">${place.regionName}</p>` : ''}
                            ${place.dist ? `<p style="margin: 0; font-size: ${isMobile ? '10px' : '11px'}; color: #4ECDC4;">📍 ${Math.round(place.dist)}m</p>` : ''}
                            <div style="margin-top: 8px; text-align: center;">
                                <small style="color: #E74C3C; font-size: ${isMobile ? '10px' : '11px'}; font-weight: 500;">
                                    검색 결과
                                </small>
                            </div>
                        </div>
                    `;
                    
                    infoWindowRef.current.setContent(content);
                    infoWindowRef.current.open(map, marker);
                }, 100);
            }

            markersRef.current.push(marker);
        });

        // 검색 결과가 있으면 지도 범위 조정
        if (searchResults.length > 0) {
            const bounds = new window.naver.maps.LatLngBounds();
            searchResults.forEach(place => {
                bounds.extend(new window.naver.maps.LatLng(place.mapy, place.mapx));
            });
            mapInstanceRef.current.fitBounds(bounds);
            
            // fitBounds 후 중심점 저장
            setTimeout(() => {
                if (mapInstanceRef.current) {
                    const center = mapInstanceRef.current.getCenter();
                    setOriginalCenter({ lat: center.lat(), lng: center.lng() });
                }
            }, 500);
        }
    }, [selectedPlace, onPlaceSelect, isMobile]);

    // 찜한 장소 마커 업데이트
    useEffect(() => {
        if (likedPlaces && likedPlaces.length > 0) {
            updateLikedMarkersOnMap(likedPlaces);
        }
    }, [likedPlaces, updateLikedMarkersOnMap]);

    // 검색 결과 마커 업데이트
    useEffect(() => {
        if (isThemeMode && themeSearchResults && selectedTheme) {
            updateThemeMarkersOnMap(themeSearchResults, selectedTheme);
        } else if (!isThemeMode && searchResults) {
            updateSearchMarkersOnMap(searchResults);
        }
    }, [isThemeMode, themeSearchResults, searchResults, selectedTheme, updateThemeMarkersOnMap, updateSearchMarkersOnMap]);

    // 선택된 장소 변경 시 지도 중심 이동
    useEffect(() => {
        if (selectedPlace && mapInstanceRef.current) {
            const newCenter = new window.naver.maps.LatLng(selectedPlace.mapy, selectedPlace.mapx);
            mapInstanceRef.current.setCenter(newCenter);
            mapInstanceRef.current.setZoom(13);
            
            // 선택된 장소를 원래 중심점으로 저장
            setOriginalCenter({ lat: selectedPlace.mapy, lng: selectedPlace.mapx });
        }
    }, [selectedPlace]);

    return (
        <div style={{ 
            position: 'relative', 
            width: '100%', 
            height: '100%'
        }}>
            {/* 지도 컨테이너 - 항상 100% 크기 유지 */}
            <div 
                ref={mapRef} 
                style={{ 
                    width: '100%', 
                    height: '100%'
                }}
            />
        </div>
    );
};

export default NaverMap;