import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const CATEGORIES = [
    { id: 'all', label: '전체', icon: '🌟' },
    { id: 'tourist', label: '관광지', icon: '🏛️' },
    { id: 'restaurant', label: '맛집', icon: '🍽️' },
    { id: 'cafe', label: '카페', icon: '☕' },
    { id: 'shopping', label: '쇼핑', icon: '🛍️' },
    { id: 'accommodation', label: '숙박', icon: '🏨' },
    { id: 'activity', label: '놀거리', icon: '🎯' }
];

// 개별 장소 카드 컴포넌트
const PlaceCard = ({ place, isSelected, onHover, onClick, onBookmark }) => {
    const handleDetailClick = (e) => {
        e.stopPropagation();
        alert(`${place.title || place.name} 상세보기 페이지로 이동`);
    };

    const handleBookmarkClick = (e) => {
        e.stopPropagation();
        onBookmark(place.contentId || place.id);
    };

    const handleAddToTripClick = (e) => {
        e.stopPropagation();
        // 여행 계획에 추가하는 로직
        alert(`${place.title || place.name}을(를) 여행 계획에 추가했습니다!`);
    };

    return (
        <div
            style={{
                padding: '16px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#f8f9fa' : 'white',
                transition: 'background-color 0.2s ease',
                borderLeft: isSelected ? '4px solid #4ECDC4' : '4px solid transparent'
            }}
            onMouseEnter={onHover}
            onClick={onClick}
        >
            <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
            }}>
                {/* 이미지 */}
                <div style={{ flexShrink: 0 }}>
                    {place.firstImage ? (
                        <img
                            src={place.firstImage}
                            alt={place.title || place.name}
                            style={{
                                width: '80px',
                                height: '60px',
                                borderRadius: '8px',
                                objectFit: 'cover'
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    <div style={{
                        width: '80px',
                        height: '60px',
                        backgroundColor: '#f7f7f7',
                        borderRadius: '8px',
                        display: place.firstImage ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: '#717171',
                        textAlign: 'center'
                    }}>
                        이미지<br />없음
                    </div>
                </div>

                {/* 정보 영역 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* 제목 */}
                    <div style={{ marginBottom: '4px' }}>
                        <h3 style={{
                            margin: 0,
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#222',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {place.title || place.name}
                        </h3>
                        {place.contentTypeId && (
                            <span style={{
                                display: 'inline-block',
                                padding: '2px 6px',
                                backgroundColor: '#e9ecef',
                                color: '#495057',
                                fontSize: '11px',
                                borderRadius: '4px',
                                marginTop: '2px'
                            }}>
                                {getContentTypeName(place.contentTypeId)}
                            </span>
                        )}
                    </div>

                    {/* 주소 */}
                    <p style={{
                        margin: '4px 0',
                        fontSize: '12px',
                        color: '#666',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {place.addr1 || place.address || '주소 정보 없음'}
                    </p>

                    {/* 거리 정보 (있는 경우) */}
                    {place.dist && (
                        <p style={{
                            margin: '2px 0',
                            fontSize: '11px',
                            color: '#4ECDC4',
                            fontWeight: '500'
                        }}>
                            📍 {Math.round(place.dist)}m
                        </p>
                    )}

                    {/* 액션 버튼들 */}
                    <div style={{
                        display: 'flex',
                        gap: '6px',
                        alignItems: 'center',
                        marginTop: '8px'
                    }}>
                        {/* 찜하기 버튼 */}
                        <button
                            onClick={handleBookmarkClick}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px',
                                padding: '3px 6px',
                                border: 'none',
                                borderRadius: '4px',
                                backgroundColor: place.isBookmarked ? '#ff6b6b' : '#f8f9fa',
                                color: place.isBookmarked ? 'white' : '#666',
                                fontSize: '11px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {place.isBookmarked ? '💖' : '🤍'}
                            찜
                        </button>

                        {/* 계획 추가 버튼 */}
                        <button
                            onClick={handleAddToTripClick}
                            style={{
                                padding: '3px 6px',
                                border: '1px solid #28a745',
                                borderRadius: '4px',
                                backgroundColor: 'white',
                                color: '#28a745',
                                fontSize: '11px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#28a745';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'white';
                                e.target.style.color = '#28a745';
                            }}
                        >
                            ➕ 계획
                        </button>

                        {/* 상세보기 버튼 */}
                        <button
                            onClick={handleDetailClick}
                            style={{
                                padding: '3px 6px',
                                border: '1px solid #4ECDC4',
                                borderRadius: '4px',
                                backgroundColor: 'white',
                                color: '#4ECDC4',
                                fontSize: '11px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#4ECDC4';
                                e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'white';
                                e.target.style.color = '#4ECDC4';
                            }}
                        >
                            상세
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 콘텐츠 타입 이름 반환 함수
const getContentTypeName = (contentTypeId) => {
    const typeMap = {
        12: '관광지',
        14: '문화시설',
        15: '축제/공연/행사',
        25: '여행코스',
        28: '레포츠',
        32: '숙박',
        38: '쇼핑',
        39: '음식점'
    };
    return typeMap[contentTypeId] || '기타';
};

// 메인 컴포넌트
const MapSearchMainContent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 });
    const [currentLocation, setCurrentLocation] = useState(null);
    
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const infoWindowRef = useRef(null);

    // 찜한 장소 목록 불러오기
    const loadLikedPlaces = useCallback(async () => {
        try {
            const response = await axios.get('/api/liked-places/all-liked-places', {
                withCredentials: true
            });

            if (response.data.code === 200) {
                const likedPlaces = response.data.allLikedPlaces.map(place => ({
                    ...place,
                    contentId: place.contentId,
                    title: place.title,
                    addr1: place.addr1,
                    firstImage: place.firstimage,
                    mapy: parseFloat(place.mapy),
                    mapx: parseFloat(place.mapx),
                    contentTypeId: place.contenttypeid,
                    isBookmarked: true, // 찜한 목록이므로 true
                    dist: 0 // 초기에는 거리 계산 안함
                }));

                setSearchResults(likedPlaces);
                updateMapMarkers(likedPlaces);
                
                console.log('찜한 장소 불러오기 성공:', likedPlaces.length + '개');
            }
        } catch (error) {
            console.error('찜한 장소 불러오기 실패:', error);
        }
    }, []);

    // 네이버 지도 초기화
    useEffect(() => {
        if (!mapRef.current) return;

        // 네이버 지도 API 로드 확인
        if (typeof window.naver === 'undefined') {
            console.error('네이버 지도 API가 로드되지 않았습니다.');
            // 임시 지도 표시
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
                center: new naver.maps.LatLng(mapCenter.lat, mapCenter.lng),
                zoom: 13,
                zoomControl: false,        // 줌 컨트롤 숨기기 (+-버튼)
                mapTypeControl: false,     // 지도 타입 컨트롤 숨기기 (위성지도 버튼)
                scaleControl: false,       // 스케일 컨트롤 숨기기
                logoControl: false,        // 네이버 로고 숨기기
                mapDataControl: false      // 지도 데이터 컨트롤 숨기기
            });

            // 인포윈도우 생성
            infoWindowRef.current = new naver.maps.InfoWindow({
                anchorSkew: true,
                borderColor: '#4ECDC4',
                borderWidth: 2,
                pixelOffset: new naver.maps.Point(20, -20)
            });

            // 현재 위치 가져오기
            getCurrentLocation();
            
            // 찜한 장소 목록 불러오기
            loadLikedPlaces();
        }
    }, [loadLikedPlaces]);

    // 현재 위치 가져오기
    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setCurrentLocation({ lat, lng });
                    setMapCenter({ lat, lng });
                    
                    if (mapInstanceRef.current && window.naver) {
                        mapInstanceRef.current.setCenter(new window.naver.maps.LatLng(lat, lng));
                        
                        // 현재 위치 마커 추가
                        new window.naver.maps.Marker({
                            position: new window.naver.maps.LatLng(lat, lng),
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
                            title: '현재 위치'
                        });
                    }
                },
                (error) => {
                    console.error('위치 정보를 가져올 수 없습니다:', error);
                }
            );
        }
    };

    // 검색 처리 - 백엔드 API 호출
    const handleSearch = useCallback(async (query = searchQuery) => {
        if (!query.trim() && selectedCategory === 'all') {
            // 검색어가 없고 전체 카테고리인 경우 찜한 장소 다시 로드
            loadLikedPlaces();
            return;
        }

        setLoading(true);
        
        try {
            // 실제 백엔드 API 호출
            const response = await axios.get('/api/my-plan/search', {
                params: {
                    keyword: query.trim()
                }
            });

            if (response.data.code === 200) {
                const searchResults = response.data.result || [];
                
                // 데이터 구조 변환 (DataSearchDto -> 컴포넌트 형식)
                const convertedResults = searchResults.map(item => ({
                    contentId: item.dataId,
                    title: item.title,
                    addr1: item.regionName || item.addr1 || '',
                    firstImage: item.firstImage || '',
                    mapy: parseFloat(item.mapy) || 37.5665,
                    mapx: parseFloat(item.mapx) || 126.9780,
                    contentTypeId: item.contentTypeId || 12,
                    isBookmarked: false, // 검색 결과는 기본적으로 찜하지 않은 상태
                    dist: 0
                }));

                // 카테고리 필터링 적용
                let filteredResults = convertedResults;
                if (selectedCategory !== 'all') {
                    const categoryMap = {
                        'tourist': [12, 14], // 관광지, 문화시설
                        'restaurant': [39],   // 음식점
                        'cafe': [39],        // 카페도 음식점에 포함
                        'shopping': [38],     // 쇼핑
                        'accommodation': [32], // 숙박
                        'activity': [28, 15]  // 레포츠, 축제/공연/행사
                    };
                    
                    const targetTypes = categoryMap[selectedCategory] || [];
                    filteredResults = convertedResults.filter(place => 
                        targetTypes.includes(place.contentTypeId)
                    );
                }

                setSearchResults(filteredResults);
                updateMapMarkers(filteredResults);
                
                console.log('검색 성공:', filteredResults.length + '개 결과');
            } else {
                console.error('검색 실패:', response.data.message);
                setSearchResults([]);
                clearMarkers();
            }
        } catch (error) {
            console.error('검색 API 호출 실패:', error);
            
            // 에러 시 더미 데이터로 대체 (개발용)
            const dummyResults = generateDummyResults(query);
            setSearchResults(dummyResults);
            updateMapMarkers(dummyResults);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedCategory, loadLikedPlaces]);

    // 더미 데이터 생성 (개발용)
    const generateDummyResults = (query) => {
        const baseResults = [
            {
                contentId: 'dummy_001',
                title: '경복궁',
                addr1: '서울특별시 종로구 사직로 161',
                firstImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
                mapy: 37.5796,
                mapx: 126.9770,
                contentTypeId: 12,
                isBookmarked: false,
                dist: 1200
            },
            {
                contentId: 'dummy_002',
                title: '명동교자',
                addr1: '서울특별시 중구 명동10길 29',
                firstImage: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop',
                mapy: 37.5636,
                mapx: 126.9834,
                contentTypeId: 39,
                isBookmarked: true,
                dist: 800
            },
            {
                contentId: 'dummy_003',
                title: '카페 온유',
                addr1: '서울특별시 강남구 가로수길 32',
                firstImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&h=200&fit=crop',
                mapy: 37.5205,
                mapx: 127.0235,
                contentTypeId: 39,
                isBookmarked: false,
                dist: 2100
            }
        ];

        return baseResults.filter(place => 
            !query || place.title.toLowerCase().includes(query.toLowerCase())
        );
    };

    // 지도 마커 업데이트
    const updateMapMarkers = (places) => {
        if (!mapInstanceRef.current || !window.naver) return;

        const map = mapInstanceRef.current;
        const naver = window.naver;

        // 기존 마커 제거
        clearMarkers();

        // 새 마커 생성
        places.forEach((place, index) => {
            const marker = new naver.maps.Marker({
                position: new naver.maps.LatLng(place.mapy, place.mapx),
                map,
                title: place.title,
                icon: {
                    content: `
                        <div style="
                            width: 32px; 
                            height: 32px; 
                            background-color: ${selectedPlace?.contentId === place.contentId ? '#ff6b6b' : '#4ECDC4'}; 
                            border-radius: 50%; 
                            border: 2px solid white; 
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-weight: bold;
                            font-size: 12px;
                            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                            cursor: pointer;
                        ">
                            ${index + 1}
                        </div>
                    `,
                    anchor: new naver.maps.Point(16, 16)
                }
            });

            // 마커 클릭 이벤트
            naver.maps.Event.addListener(marker, 'click', () => {
                setSelectedPlace(place);
                
                // 인포윈도우 내용 설정
                const content = `
                    <div style="padding: 10px; min-width: 200px;">
                        <h4 style="margin: 0 0 5px 0; font-size: 14px;">${place.title}</h4>
                        <p style="margin: 0; font-size: 12px; color: #666;">${place.addr1}</p>
                        ${place.dist ? `<p style="margin: 5px 0 0 0; font-size: 11px; color: #4ECDC4;">📍 ${Math.round(place.dist)}m</p>` : ''}
                    </div>
                `;
                
                infoWindowRef.current.setContent(content);
                infoWindowRef.current.open(map, marker);
            });

            markersRef.current.push(marker);
        });

        // 첫 번째 결과로 지도 중심 이동 (결과가 있는 경우)
        if (places.length > 0) {
            const bounds = new naver.maps.LatLngBounds();
            places.forEach(place => {
                bounds.extend(new naver.maps.LatLng(place.mapy, place.mapx));
            });
            map.fitBounds(bounds);
        }
    };

    // 마커 제거
    const clearMarkers = () => {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
        if (infoWindowRef.current) {
            infoWindowRef.current.close();
        }
    };

    // 카테고리 변경
    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    // 카테고리 변경 시 자동 검색
    useEffect(() => {
        handleSearch();
    }, [selectedCategory]);

    // 찜하기 처리
    const handleBookmark = async (contentId) => {
        try {
            // 실제 찜하기 API 호출 (토글 방식)
            const response = await axios.post('/api/liked-places/toggle-like', {
                contentId: contentId
            }, {
                withCredentials: true
            });

            if (response.data.code === 200) {
                const isLiked = response.data.isLiked;
                
                // 로컬 상태 업데이트
                setSearchResults(prev => 
                    prev.map(place => 
                        place.contentId === contentId 
                            ? { ...place, isBookmarked: isLiked }
                            : place
                    )
                );

                // 찜하기 해제된 경우, 찜한 목록에서만 검색 중이라면 해당 항목 제거
                if (!isLiked && !searchQuery && selectedCategory === 'all') {
                    setSearchResults(prev => prev.filter(place => place.contentId !== contentId));
                    // 지도 마커도 업데이트
                    const updatedResults = searchResults.filter(place => place.contentId !== contentId);
                    updateMapMarkers(updatedResults);
                }

                console.log(isLiked ? '찜하기 추가' : '찜하기 해제', contentId);
            }
        } catch (error) {
            console.error('찜하기 실패:', error);
            // 에러 시에도 UI 업데이트 (개발용)
            setSearchResults(prev => 
                prev.map(place => 
                    place.contentId === contentId 
                        ? { ...place, isBookmarked: !place.isBookmarked }
                        : place
                )
            );
        }
    };

    // 장소 호버 처리
    const handlePlaceHover = (place) => {
        // 해당 마커 강조 효과 등 구현 가능
        console.log('Hovering place:', place.title);
    };

    // 패널 토글
    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: 'calc(100vh - 143px)', // 헤더 높이 142.5px + 여유 0.5px
            overflow: 'hidden',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* 전체 화면 지도 */}
            <div
                ref={mapRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1
                }}
            />

            {/* 상단 검색바 (지도 위 오버레이) */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                right: isPanelOpen ? '420px' : '20px',
                zIndex: 998, // 사이드 패널보다 낮게
                transition: 'right 0.3s ease'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.3)'
                }}>
                    <span style={{ color: '#6c757d', marginRight: '12px', fontSize: '18px' }}>🔍</span>
                    <input
                        type="text"
                        placeholder="장소, 주소 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        style={{
                            flex: 1,
                            border: 'none',
                            backgroundColor: 'transparent',
                            outline: 'none',
                            fontSize: '16px',
                            fontWeight: '500'
                        }}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSearchResults([]);
                                clearMarkers();
                            }}
                            style={{
                                border: 'none',
                                backgroundColor: 'transparent',
                                color: '#6c757d',
                                cursor: 'pointer',
                                padding: '4px',
                                fontSize: '16px'
                            }}
                        >
                            ✕
                        </button>
                    )}
                    <button
                        onClick={() => handleSearch()}
                        style={{
                            marginLeft: '8px',
                            padding: '8px 16px',
                            backgroundColor: '#4ECDC4',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        검색
                    </button>
                </div>
            </div>

            {/* 패널 토글 버튼 */}
            <button
                onClick={togglePanel}
                style={{
                    position: 'absolute',
                    top: '50%',
                    right: isPanelOpen ? '380px' : '20px',
                    transform: 'translateY(-50%)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    zIndex: 1002, // 사이드 패널보다 높게 설정
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    color: '#333'
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                    e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                    e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
            >
                {isPanelOpen ? '>' : '<'}
            </button>

            {/* 현재 위치 버튼 */}
            <button
                onClick={getCurrentLocation}
                style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: isPanelOpen ? '420px' : '20px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    zIndex: 996, // 다른 요소들보다 낮게
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    color: '#4ECDC4'
                }}
                title="현재 위치로 이동"
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#4ECDC4';
                    e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                    e.target.style.color = '#4ECDC4';
                }}
            >
                📍
            </button>

            {/* 사이드 패널 (슬라이딩) */}
            <div style={{
                position: 'absolute',
                top: 0,
                right: isPanelOpen ? 0 : '-400px',
                width: '400px',
                height: '100%',
                backgroundColor: 'white',
                boxShadow: isPanelOpen ? '-5px 0 20px rgba(0,0,0,0.1)' : 'none',
                zIndex: 999, // 헤더 드롭다운보다 낮게 설정
                transition: 'right 0.3s ease, box-shadow 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* 패널 헤더 */}
                <div style={{
                    padding: '20px',
                    borderBottom: '1px solid #f0f0f0',
                    backgroundColor: 'white'
                }}>
                    {/* 카테고리 탭들 */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginBottom: '16px'
                    }}>
                        {CATEGORIES.map(category => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '8px 12px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    backgroundColor: selectedCategory === category.id ? '#4ECDC4' : '#f7f7f7',
                                    color: selectedCategory === category.id ? 'white' : '#717171',
                                    fontSize: '13px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                <span>{category.icon}</span>
                                {category.label}
                            </button>
                        ))}
                    </div>

                    {/* 검색 결과 개수 */}
                    {searchResults.length > 0 && (
                        <div style={{
                            padding: '8px 12px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '8px',
                            fontSize: '14px',
                            color: '#495057',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span>
                                {!searchQuery && selectedCategory === 'all' ? (
                                    <>💖 찜한 장소 <strong>{searchResults.length}개</strong></>
                                ) : (
                                    <>검색 결과 <strong>{searchResults.length}개</strong></>
                                )}
                            </span>
                            {currentLocation && (
                                <span style={{ fontSize: '12px', color: '#6c757d' }}>
                                    📍 내 위치 기준
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* 검색 결과 리스트 */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto'
                }}>
                    {loading ? (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '200px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid #f3f3f3',
                                    borderTop: '2px solid #4ECDC4',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                검색 중...
                            </div>
                        </div>
                    ) : searchResults.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#717171'
                        }}>
                            {searchQuery || selectedCategory !== 'all' ? (
                                <div>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                                    <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                                        검색 결과가 없습니다
                                    </p>
                                    <p style={{ fontSize: '14px', color: '#999' }}>
                                        다른 키워드로 검색해보세요
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>💖</div>
                                    <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                                        아직 찜한 장소가 없습니다
                                    </p>
                                    <p style={{ fontSize: '14px', color: '#999' }}>
                                        검색으로 좋아하는 장소를 찾아보세요
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            {searchResults.map((place, index) => (
                                <PlaceCard
                                    key={place.contentId}
                                    place={place}
                                    isSelected={selectedPlace?.contentId === place.contentId}
                                    onHover={() => handlePlaceHover(place)}
                                    onClick={() => {
                                        setSelectedPlace(place);
                                        // 지도 중심을 해당 장소로 이동
                                        if (mapInstanceRef.current && window.naver) {
                                            mapInstanceRef.current.setCenter(
                                                new window.naver.maps.LatLng(place.mapy, place.mapx)
                                            );
                                            mapInstanceRef.current.setZoom(15);
                                        }
                                    }}
                                    onBookmark={handleBookmark}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* CSS 애니메이션 */}
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                /* 스크롤바 스타일링 */
                div::-webkit-scrollbar {
                    width: 6px;
                }
                
                div::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                
                div::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 3px;
                }
                
                div::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }
            `}</style>
        </div>
    );
};

export default MapSearchMainContent;