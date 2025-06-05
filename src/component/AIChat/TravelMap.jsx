import React, { useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';

const TravelMap = ({ locations }) => {
    const [selectedDay, setSelectedDay] = useState(1);       // 현재 선택된 일차

    const mapRef = useRef(null);         // 지도 DOM 참조
    const mapInstanceRef = useRef(null); // Naver 지도 인스턴스 저장

    // Day별 마커, 폴리라인, 애니메이션마커 refs를 저장하기 위해 객체로 관리
    const markersByDay = useRef({});
    const polylinesByDay = useRef({});

    // 기본 색 (Day에 따라)
    const DAY_COLOR_MAP = {
    1: '#FF4D4D',  // 빨간색
    2: '#A9F5A9',  // 연두색
    3: '#4DB8FF',  // 하늘색
    4: '#FFD700',  // 금색
    5: '#D291BC',  // 보라핑크
    };

    // 여행 일차 목록 추출 (중복 제거)
    const dayList = [...new Set(locations.map(loc => Number(loc.day)))].sort((a, b) => a - b);

    // 선택된 일차의 장소만 필터링 및 정렬
    const dayLocations = locations
        .filter(loc => Number(loc.day) === selectedDay) // 수정된 부분: Number(loc.day)로 통일
        .sort((a, b) => a.order - b.order);
    
    
    useEffect(() => {
        if (!mapRef.current || !window.naver || dayLocations.length === 0) return;

        const naver = window.naver;

        // 지도 생성 (최초 1회)
        if (!mapInstanceRef.current) {
            const firstLoc = locations[0];
            mapInstanceRef.current = new naver.maps.Map(mapRef.current, {
                center: new naver.maps.LatLng(firstLoc.lat, firstLoc.lng),
                zoom: 14,
                disableDoubleClickZoom: true,  // 더블클릭 줌 비활성화
            });
        }

        const map = mapInstanceRef.current;


        // 모든 Day에 대해 마커, 폴리라인, 애니메이션 마커 생성 or 재사용
        dayList.forEach(day => {
            const dayLocs = locations.filter(loc => Number(loc.day) === day).sort((a,b) => a.order - b.order);
            if (dayLocs.length === 0) return;

            // 기존 마커 삭제 후 새로 생성
            if (markersByDay.current[day]) {
            markersByDay.current[day].forEach(marker => marker.setMap(null));
            }
            markersByDay.current[day] = dayLocs.map(loc => {
                const marker = new naver.maps.Marker({
                    position: new naver.maps.LatLng(loc.lat, loc.lng),
                    map,
                    title: loc.name,
                    icon: {
                        content: `<div style="width: 16px; height: 16px; background-color: ${DAY_COLOR_MAP[day]}; border-radius: 50%; border: 2px solid black;"></div>`,
                        size: new naver.maps.Size(16, 16),
                        anchor: new naver.maps.Point(8, 8),
                    },
                });

                // 클릭 시 선택 day 변경 및 infoWindow 표시
                naver.maps.Event.addListener(marker, 'click', () => {
                setSelectedDay(day);  // 폴리라인 클릭 시에도 day 변경 효과를 동일하게 줌
                // infoWindow 처리 로직 추가 가능
                });

                return marker;
            });

        // 기존 폴리라인 삭제 후 새로 생성
        if (polylinesByDay.current[day]) {
            polylinesByDay.current[day].setMap(null);
        }

        const path = dayLocs.map(loc => new naver.maps.LatLng(loc.lat, loc.lng));
            polylinesByDay.current[day] = new naver.maps.Polyline({
            path,
            map,
            strokeColor: DAY_COLOR_MAP[day],
            strokeOpacity: selectedDay === day ? 1 : 0.6,
            strokeWeight: selectedDay === day ? 6 : 4,
            strokeStyle: selectedDay === day ? 'solid' : 'shortdash',
        });

        // 폴리라인 클릭 시 선택 day 변경
        naver.maps.Event.addListener(polylinesByDay.current[day], 'click', () => {
            setSelectedDay(day);
        });

        });

        // 선택된 Day 중심으로 지도 이동
        const selectedLocs = locations.filter(loc => Number(loc.day) === selectedDay);
        if (selectedLocs.length > 0) {
            map.setCenter(new naver.maps.LatLng(selectedLocs[0].lat, selectedLocs[0].lng));
        }

    }, [locations, selectedDay]);

    return(
    <div>
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

        <div ref={mapRef} style={{ width: '100%', height: '500px', border: '1px solid #ccc' }} />

        <div style={{ marginTop: '20px' }}>
            <h3>Day {selectedDay} 일정</h3>
            <ol>
            {locations.filter(loc => Number(loc.day) === selectedDay).map((loc, idx) => (
                <li key={idx} style={{ marginBottom: '8px' }}>
                <strong>{loc.name}</strong> ({loc.region}) - {loc.description}
                </li>
            ))}
            </ol>
        </div>
    </div>
    )

};


TravelMap.propTypes = {
    locations: PropTypes.array.isRequired,
};

export default TravelMap;