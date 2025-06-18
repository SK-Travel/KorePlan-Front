import React, { useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { LockOpen } from 'lucide-react';

const TravelMap = ({ locations, days, region }) => {
    const [selectedDay, setSelectedDay] = useState(1);

    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    const markersByDay = useRef({});
    const polylinesByDay = useRef({});

    const navigate = useNavigate();
    const [hovered, setHovered] = useState(null);

    useEffect(() => {
        console.log("📌 전달받은 locations 데이터:", locations, days, region);
    }, []); 


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

    const DAY_COLOR_MAP = {
        1: '#FF4D4D',
        2: '#4CAF50',
        3: '#2196F3',
        4: '#FFC107',
        5: '#9C27B0',
    };

    const dayList = [...new Set(locations.map(loc => Number(loc.day)))].sort((a, b) => a - b);

    const dayLocations = locations
        .filter(loc => Number(loc.day) === selectedDay)
        .sort((a, b) => a.order - b.order);
    
    // ✅ 지도 및 마커/폴리라인 최초 생성 (좌표 순서 수정)
    useEffect(() => {
        if (!mapRef.current || !window.naver || locations.length === 0) return;
    
        const naver = window.naver;
        
        // ✅ 지도 최초 1회 생성 - 좌표 순서 수정: LatLng(위도, 경도) = LatLng(mapy, mapx)
        if (!mapInstanceRef.current) {
            const firstLoc = locations[0];
            mapInstanceRef.current = new naver.maps.Map(mapRef.current, {
                center: new naver.maps.LatLng(firstLoc.mapy, firstLoc.mapx), // ✅ 수정: mapy, mapx 순서
                zoom: 14,
                disableDoubleClickZoom: true,
            });

            requestAnimationFrame(() => {
                naver.maps.Event.trigger(mapInstanceRef.current, 'resize');
            });
        }

        const map = mapInstanceRef.current;

        // ✅ 초기 중심점 설정도 수정
        if (!map._hasCenteredOnce) {
            map.setCenter(new naver.maps.LatLng(locations[0].mapy, locations[0].mapx)); // ✅ 수정
            map._hasCenteredOnce = true;
        }

        dayList.forEach(day => {
            const dayLocs = locations.filter(loc => Number(loc.day) === day).sort((a, b) => a.order - b.order);
            if (!dayLocs.length) return;

            if (markersByDay.current[day]) markersByDay.current[day].forEach(m => m.setMap(null));
            if (polylinesByDay.current[day]) polylinesByDay.current[day].setMap(null);

            // ✅ 마커 생성 시 좌표 순서 수정
            markersByDay.current[day] = dayLocs.map(loc => {
                const marker = new naver.maps.Marker({
                    position: new naver.maps.LatLng(loc.mapy, loc.mapx), // ✅ 이미 올바름
                    map,
                    title: loc.title,
                    icon: {
                        content: `
                            <div style="text-align:center;">
                                <div style="width: 16px; height: 16px; background-color: ${DAY_COLOR_MAP[day]}; border-radius: 50%; border: 2px solid black; margin: 0 auto;"></div>
                                <div style="font-size: 12px; margin-top:2px; color: black; font-weight: bold;">${loc.day}. ${loc.order}</div>
                            </div>
                        `,
                        anchor: new naver.maps.Point(8, 8),
                    },
                });

                naver.maps.Event.addListener(marker, 'click', () => {
                    setSelectedDay(day);
                });

                return marker;
            });

            // ✅ 폴리라인 생성 시 좌표 순서 수정
            const path = dayLocs.map(loc => new naver.maps.LatLng(loc.mapy, loc.mapx)); // ✅ 이미 올바름
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

    // ✅ 선택된 Day의 첫 장소로 지도 중심 이동 (좌표 순서 수정)
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;
        
        const firstLoc = locations
        .filter(loc => Number(loc.day) === selectedDay)
        .sort((a, b) => a.order - b.order)[0];
        
        if (firstLoc) {
            window.naver.maps.Event.trigger(map, 'resize');
            // ✅ 수정: LatLng(위도, 경도) = LatLng(mapy, mapx)
            map.panTo(new window.naver.maps.LatLng(firstLoc.mapy, firstLoc.mapx));
        }
        // console.log("loc데이터 검사:", {firstLoc});
    }, [selectedDay]);

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

    // ✅ API 호출 방식 수정
    const handleAddToMyPlan = async() => {
        try {
            const userId = localStorage.getItem('userId');

            const travelPlan = {
                userId: Number(userId), // 백엔드는 이걸 무시하고 헤더에서 다시 세팅하지만 일단 포함
                region: region,
                days: days,
                travelLists: locations // 배열로
            };
            const response = await fetch('/api/my-plan/add', {
                method: 'POST', // ✅ HTTP 메서드 명시
                headers: {
                    'Content-Type': 'application/json', // ✅ 헤더 추가
                    'userId': userId.toString(), // 이렇게 헤더에 넣기
                },
                body: JSON.stringify(travelPlan), // ✅ body로 데이터 전송
            });

            if (response.ok) {
                const data = await response.json();
                if (data.code === 200) {
                    alert("리스트에 추가되었습니다."); 
                    navigate('/myplan', { state: { locations, region, days } });
                }
            }

        } catch (error) {
            console.log("리스트 저장 실패: ", error);
            alert("리스트 저장 중 오류가 발생했습니다.")
        }
    }

    const handleCardClick = (loc) => {
        navigate(`/spot/${loc.contentId}`, {
            state: {
                contentId: loc.contentId,
                contentTypeId: loc.contentTypeId,
                spotData: loc,
                locations, // 여행 일정 전체 정보도 같이 보냄
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
                                <button  onClick={(e) => { e.stopPropagation(); handleCardClick(loc);}} target="_blank" rel="noopener noreferrer" className="ms-4"
                                        style={getLinkStyle(idx)} onMouseEnter={() => setHovered(idx)} onMouseLeave={() => setHovered(null)}>
                                    상세 페이지 바로가기
                                </button>
                            </div>
                            <strong>{loc.title}</strong>
                            ({loc.regionName})
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
    days: PropTypes.string,     
    region: PropTypes.string, 
};

export default TravelMap;