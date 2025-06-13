import React, { useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';


const TravelMap = ({ locations }) => {
    const [selectedDay, setSelectedDay] = useState(1);       // 현재 선택된 일차

    const mapRef = useRef(null);         // 지도 DOM 참조
    const mapInstanceRef = useRef(null); // Naver 지도 인스턴스 저장

    // Day별 마커, 폴리라인, 애니메이션마커 refs를 저장하기 위해 객체로 관리
    const markersByDay = useRef({});
    const polylinesByDay = useRef({});

    const navigate = useNavigate(); // 네비게이트
    // 페이지 바로가기용 후버
    const [hovered, setHovered] = useState(null);

    // 페이지 바로가기용 스타일
    const getLinkStyle = (idx) => ({
        color: hovered === idx ? 'white' : 'black',
        textDecoration: 'none',
        fontWeight: 'bold',
        backgroundColor: hovered === idx ? 'deepskyblue' : 'lightgreen',
        padding: '4px 8px',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
        height: '30px',
    });

    // 기본 색 (Day에 따라)
    const DAY_COLOR_MAP = {
        1: '#FF4D4D', // 선명한 빨간색
        2: '#4CAF50', // 선명한 초록색
        3: '#2196F3', // 선명한 파란색
        4: '#FFC107', // 진한 노란색 (약간 주황 느낌)
        5: '#9C27B0', // 진한 보라색
    };

    // 여행 일차 목록 추출 (중복 제거)
    const dayList = [...new Set(locations.map(loc => Number(loc.day)))].sort((a, b) => a - b);

    // 선택된 일차의 장소만 필터링 및 정렬
    const dayLocations = locations
        .filter(loc => Number(loc.day) === selectedDay) // 수정된 부분: Number(loc.day)로 통일
        .sort((a, b) => a.order - b.order);
    
    
    // ✅ 지도 및 마커/폴리라인 최초 생성
    useEffect(() => {
        if (!mapRef.current || !window.naver || locations.length === 0) return;

        const naver = window.naver;

        // ✅ 지도 최초 1회 생성
        if (!mapInstanceRef.current) {
            const firstLoc = locations[0];
            mapInstanceRef.current = new naver.maps.Map(mapRef.current, {
                center: new naver.maps.LatLng(firstLoc.lat, firstLoc.lng),
                zoom: 14,
                disableDoubleClickZoom: true,
            });

           // resize
            requestAnimationFrame(() => {
                naver.maps.Event.trigger(mapInstanceRef.current, 'resize');
            });
        }

        const map = mapInstanceRef.current;

        if (!map._hasCenteredOnce) {
            map.setCenter(new naver.maps.LatLng(locations[0].lat, locations[0].lng));
            map._hasCenteredOnce = true;
        }

        dayList.forEach(day => {
            const dayLocs = locations.filter(loc => Number(loc.day) === day).sort((a, b) => a.order - b.order);
            if (!dayLocs.length) return;

            if (markersByDay.current[day]) markersByDay.current[day].forEach(m => m.setMap(null));
            if (polylinesByDay.current[day]) polylinesByDay.current[day].setMap(null);

            markersByDay.current[day] = dayLocs.map(loc => {
                const marker = new naver.maps.Marker({
                    position: new naver.maps.LatLng(loc.lat, loc.lng),
                    map,
                    title: loc.name,
                    icon: {
                        content: `
                            <div style="text-align:center;">
                                <div style="width: 16px; height: 16px; background-color: ${DAY_COLOR_MAP[day]}; border-radius: 50%; border: 2px solid black; margin: 0 auto;"></div>
                                <div style="font-size: 12px; margin-top:2px; color: black; font-weight: bold;">${loc.day}. ${loc.order}</div>
                            </div>
                        `,
                        anchor: new naver.maps.Point(8, 8), // ✅ 동그라미 중심에 anchor 맞춤 (16px 기준)
                    },
                });

                naver.maps.Event.addListener(marker, 'click', () => {
                    setSelectedDay(day);
                });

                return marker;
            });

            const path = dayLocs.map(loc => new naver.maps.LatLng(loc.lat, loc.lng));
            const polyline = new naver.maps.Polyline({
                path,
                map,
                strokeColor: DAY_COLOR_MAP[day],
                strokeOpacity: 0.6,
                strokeWeight: 4,
                strokeStyle: 'shortdash',
            });

            naver.maps.Event.addListener(polyline, 'click', () => {
                setSelectedDay(day);
            });

            polylinesByDay.current[day] = polyline;
        });
    }, []);

    // ✅ 선택된 Day의 첫 장소로 지도 중심 이동
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        const firstLoc = locations
            .filter(loc => Number(loc.day) === selectedDay)
            .sort((a, b) => a.order - b.order)[0];

        if (firstLoc) {
            // ✅ 이 줄 추가됨 (지도 깨짐 방지)
            window.naver.maps.Event.trigger(map, 'resize');

            map.panTo(new window.naver.maps.LatLng(firstLoc.lat, firstLoc.lng));
        }
    }, [selectedDay]);

    // ✅ 선택된 Day에 따라 폴리라인 강조 스타일 변경
    useEffect(() => {
        dayList.forEach(day => {
            const polyline = polylinesByDay.current[day];
            if (!polyline) return;

            polyline.setOptions({
                strokeOpacity: selectedDay === day ? 1 : 0.6,
                strokeWeight: selectedDay === day ? 6 : 4,
                strokeStyle: selectedDay === day ? 'solid' : 'shortdash',
            });
        });
    }, [selectedDay, dayList]);

    // myList추가 핸들
    const handleAddToMyPlan = async() => {
        try {
            const response = await fetch('/api/my-plan/list', locations, {
                widthCredentials: true
            });

            if (response.ok) {
                const data = await response.json();
                if (data.code === 200) {
                    alert("리스트에 추가되었습니다."); 
                    window.location.href= 'http://localhost:5173/myplan';
                } else {
                    alert(data.error_message);
                }
            }

        } catch (error) {
            console.log("리스트 저장 실패: ", error);
            alert("리스트 저장 중 오류가 발생했습니다.")
        }
    }

    // Data의 ContentId -> Theme의 ContentTypeId으로 ThemeName불러오기
    const handleCardClick = (item) => {
        navigate(`/spot/${item.contentId}`, {
            state: {
                contentId: item.contentId,
                selectedTheme: selectedTheme,
                spotData: item,
            }
        });
    };

return (
        <div style={{ width: '900px', minHeight: '800px' }}>
            <div style={{ marginBottom: 20, display: 'flex', gap: 8 }}>
                {dayList.map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        style={{
                            padding: '8px 16px',
                            cursor: 'pointer',
                            borderRadius: 4,
                            border: selectedDay === day ? '2px solid #0077FF' : '1px solid #ccc',
                            backgroundColor: selectedDay === day ? '#E6F0FF' : '#fff',
                            fontWeight: selectedDay === day ? 'bold' : 'normal',
                            transition: 'all 0.2s ease-in-out',
                        }}
                    >
                        Day {day}
                    </button>
                ))}
            </div>

            <div>
                <div
                    ref={mapRef}
                    style={{
                        width: '100%',
                        height: '500px',
                        border: '1px solid #ccc',
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                />
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3>Day {selectedDay} 일정</h3>
                <ol>
                    {dayLocations.map((loc, idx) => (
                        <li key={idx} style={{ marginBottom: '8px' }}>
                            <div className="d-flex">
                                {loc.firstimage ? 
                                (<div><img src={loc.firstimage} width="170" /></div>) 
                                : 
                                (<div className="d-flex align-items-center justify-content-center" style={{ width: '170px', height: '170px', backgroundColor: '#f0f0f0', color: '#555', fontSize: '14px' }}>
                                    이미지가 부재합니다.
                                    </div>
                                )}
                                <button onClick={handleCardClick} target="_blank" rel="noopener noreferrer" className="ms-4"
                                        style={getLinkStyle(idx)} onMouseEnter={() => setHovered(idx)} onMouseLeave={() => setHovered(null)}>
                                    상세 페이지 바로가기
                                </button>
                            </div>
                            <strong>{loc.name}</strong>
                            ({loc.region})
                        </li>
                    ))}
                </ol>
            </div>

            <div style={{ marginTop: '30px' }}>
                <button onClick={handleAddToMyPlan}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#007BFF',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                    }}>
                    리스트에 추가하기
                </button>
            </div>
        </div>
    );

};


TravelMap.propTypes = {
    locations: PropTypes.array.isRequired,
};

export default TravelMap;