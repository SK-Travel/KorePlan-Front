import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const TravelMap = ({ locations, days, region, startDate, endDate, onReset }) => {
    const [selectedDay, setSelectedDay] = useState(1);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersByDay = useRef({});
    const polylinesByDay = useRef({});
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [planTitle, setPlanTitle] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        console.log("📌 전달받은 locations 데이터:", locations, days, region, startDate, endDate);
    }, []);

    const DAY_COLOR_MAP = {
        1: '#FF6B6B',
        2: '#4ECDC4',
        3: '#45B7D1',
        4: '#FFA07A',
        5: '#98D8C8',
        6: '#F7DC6F',
        7: '#BB8FCE'
    };

    const dayList = [...new Set(locations.map(loc => Number(loc.day)))].sort((a, b) => a - b);
    const dayLocations = locations
        .filter(loc => Number(loc.day) === selectedDay)
        .sort((a, b) => a.order - b.order);

    // 지도 및 마커/폴리라인 생성
    useEffect(() => {
        if (!mapRef.current || !window.naver || locations.length === 0) return;

        const naver = window.naver;

        if (!mapInstanceRef.current) {
            const firstLoc = locations[0];
            mapInstanceRef.current = new naver.maps.Map(mapRef.current, {
                center: new naver.maps.LatLng(firstLoc.mapy, firstLoc.mapx),
                zoom: 13,
                disableDoubleClickZoom: true,
            });

            requestAnimationFrame(() => {
                naver.maps.Event.trigger(mapInstanceRef.current, 'resize');
            });
        }

        const map = mapInstanceRef.current;

        if (!map._hasCenteredOnce) {
            map.setCenter(new naver.maps.LatLng(locations[0].mapy, locations[0].mapx));
            map._hasCenteredOnce = true;
        }

        dayList.forEach(day => {
            const dayLocs = locations.filter(loc => Number(loc.day) === day).sort((a, b) => a.order - b.order);
            if (!dayLocs.length) return;

            if (markersByDay.current[day]) markersByDay.current[day].forEach(m => m.setMap(null));
            if (polylinesByDay.current[day]) polylinesByDay.current[day].setMap(null);

            markersByDay.current[day] = dayLocs.map(loc => {
                const marker = new naver.maps.Marker({
                    position: new naver.maps.LatLng(loc.mapy, loc.mapx),
                    map,
                    title: loc.title,
                    icon: {
                        content: `
                            <div style="
                                width: 30px; 
                                height: 30px; 
                                background-color: ${DAY_COLOR_MAP[day]}; 
                                border-radius: 50%; 
                                border: 2px solid white; 
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                                font-weight: bold;
                                font-size: 12px;
                                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                            ">
                                ${loc.order}
                            </div>
                        `,
                        anchor: new naver.maps.Point(15, 15),
                    },
                });

                naver.maps.Event.addListener(marker, 'click', () => {
                    setSelectedDay(day);
                });

                return marker;
            });

            const path = dayLocs.map(loc => new naver.maps.LatLng(loc.mapy, loc.mapx));
            const polyline = new naver.maps.Polyline({
                path,
                map,
                strokeColor: DAY_COLOR_MAP[day],
                strokeOpacity: 0.8,
                strokeWeight: 3,
                strokeStyle: 'solid',
            });

            naver.maps.Event.addListener(polyline, 'click', () => {
                setSelectedDay(day);
            });

            polylinesByDay.current[day] = polyline;
        });
    }, [locations]);

    // 선택된 Day의 첫 장소로 지도 중심 이동
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        const firstLoc = locations
            .filter(loc => Number(loc.day) === selectedDay)
            .sort((a, b) => a.order - b.order)[0];

        if (firstLoc) {
            window.naver.maps.Event.trigger(map, 'resize');
            map.panTo(new window.naver.maps.LatLng(firstLoc.mapy, firstLoc.mapx));
        }
    }, [selectedDay]);

    useEffect(() => {
        dayList.forEach(day => {
            const polyline = polylinesByDay.current[day];
            if (!polyline) return;

            polyline.setOptions({
                strokeOpacity: selectedDay === day ? 1 : 0.3,
                strokeWeight: selectedDay === day ? 4 : 2,
            });
        });
    }, [selectedDay, dayList]);

    // 지도 리사이즈 처리
    useEffect(() => {
        if (mapInstanceRef.current) {
            setTimeout(() => {
                window.naver.maps.Event.trigger(mapInstanceRef.current, 'resize');
            }, 100);
        }
    }, [isMobile]);

    // API 호출
    const handleSubmitPlan = async () => {
        if (!planTitle.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }

        try {
            const userId = localStorage.getItem('userId');
            const travelPlan = {
                userId: Number(userId),
                title: planTitle,
                travelLists: locations,
                startDate: startDate,
                endDate: endDate,
            };

            const response = await fetch('/api/my-plan/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': userId.toString(),
                },
                body: JSON.stringify(travelPlan),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                if (data.code === 200) {
                    alert("리스트에 추가되었습니다.");
                    setShowModal(false);
                    navigate('/myplan', { state: { locations, region, days, title: planTitle, startDate, endDate } });
                }
            } else {
                alert("서버로부터 오류 응답을 받았습니다.");
            }
        } catch (error) {
            console.log("리스트 저장 실패: ", error);
            alert("리스트 저장 중 오류가 발생했습니다.");
        }
    };

    const handleCardClick = (loc) => {
        navigate(`/spot/${loc.contentId}`, {
            state: {
                contentId: loc.contentId,
                contentTypeId: loc.contentTypeId,
                spotData: loc,
                locations,
            }
        });
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        });
    };

    const getDurationText = () => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (diffDays === 1) return '당일치기';
        return `${diffDays - 1}박 ${diffDays}일`;
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            width: '100%',
            height: isMobile ? 'auto' : '100vh',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* 모달 */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: isMobile ? '1rem' : '0'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: isMobile ? '24px' : '32px',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        width: isMobile ? '100%' : '420px',
                        maxWidth: isMobile ? '400px' : '420px',
                        boxShadow: '0 16px 70px rgba(0,0,0,0.2)'
                    }}>
                        <h2 style={{
                            margin: '0',
                            fontSize: isMobile ? '20px' : '24px',
                            fontWeight: '600',
                            color: '#222'
                        }}>
                            여행 계획 저장
                        </h2>
                        <input
                            type="text"
                            placeholder="예: 2025 여름 충청북도 여행"
                            value={planTitle}
                            onChange={(e) => setPlanTitle(e.target.value)}
                            style={{
                                padding: '16px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '16px',
                                outline: 'none',
                                fontFamily: 'inherit'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    backgroundColor: '#f7f7f7',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '500',
                                    color: '#666'
                                }}
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSubmitPlan}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    backgroundColor: '#FF385C',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '500'
                                }}
                            >
                                저장하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 지도 영역 */}
            <div style={{
                flex: isMobile ? 'none' : '1',
                height: isMobile ? '50vh' : '100vh',
                width: isMobile ? '100%' : 'auto',
                position: 'relative'
            }}>
                <div
                    ref={mapRef}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                />

                {/* 지도 위 컨트롤 패널 */}
                <div style={{
                    position: 'absolute',
                    top: isMobile ? '90px' : '20px', // 헤더(약 70px) + 여백(20px)
                    left: isMobile ? '10px' : '20px',
                    right: isMobile ? '10px' : '20px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: isMobile ? '12px 16px' : '16px 20px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                    zIndex: 10
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: isMobile ? '8px' : '12px'
                    }}>
                        <h2 style={{
                            margin: 0,
                            fontSize: isMobile ? '16px' : '18px',
                            fontWeight: '600',
                            color: '#222'
                        }}>
                            {region} 여행
                        </h2>
                        <span style={{
                            fontSize: isMobile ? '12px' : '14px',
                            color: '#717171',
                            backgroundColor: '#f7f7f7',
                            padding: '4px 8px',
                            borderRadius: '6px'
                        }}>
                            {getDurationText()}
                        </span>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: isMobile ? '6px' : '8px',
                        flexWrap: 'wrap'
                    }}>
                        {dayList.map(day => (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                style={{
                                    padding: isMobile ? '6px 12px' : '8px 16px',
                                    borderRadius: '24px',
                                    border: 'none',
                                    backgroundColor: selectedDay === day ? DAY_COLOR_MAP[day] : '#f7f7f7',
                                    color: selectedDay === day ? 'white' : '#717171',
                                    fontSize: isMobile ? '12px' : '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                Day {day}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 장소 목록 영역 */}
            <div style={{
                width: isMobile ? '100%' : '400px',
                height: isMobile ? 'auto' : '100vh',
                backgroundColor: 'white',
                borderLeft: isMobile ? 'none' : '1px solid #e5e5e5',
                borderTop: isMobile ? '1px solid #e5e5e5' : 'none',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* 헤더 */}
                <div style={{
                    padding: isMobile ? '16px' : '24px 20px 20px',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                    }}>
                        <div style={{
                            width: isMobile ? '16px' : '20px',
                            height: isMobile ? '16px' : '20px',
                            borderRadius: '50%',
                            backgroundColor: DAY_COLOR_MAP[selectedDay],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: isMobile ? '10px' : '12px',
                            fontWeight: 'bold'
                        }}>
                            {selectedDay}
                        </div>
                        <h3 style={{
                            margin: 0,
                            fontSize: isMobile ? '18px' : '20px',
                            fontWeight: '600',
                            color: '#222'
                        }}>
                            Day {selectedDay}의 여행
                        </h3>
                    </div>
                    <p style={{
                        margin: 0,
                        fontSize: isMobile ? '13px' : '14px',
                        color: '#717171'
                    }}>
                        {dayLocations.length}개의 장소를 방문해요
                    </p>
                </div>

                {/* 장소 목록 스크롤 영역 */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: isMobile ? '0 16px' : '0 20px',
                    maxHeight: isMobile ? '60vh' : 'none'
                }}>
                    {dayLocations.map((loc, idx) => (
                        <div
                            key={idx}
                            style={{
                                display: 'flex',
                                gap: isMobile ? '10px' : '12px',
                                padding: isMobile ? '16px 0' : '20px 0',
                                borderBottom: idx < dayLocations.length - 1 ? '1px solid #f0f0f0' : 'none',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleCardClick(loc)}
                        >
                            {/* 순서 번호 */}
                            <div style={{
                                width: isMobile ? '28px' : '32px',
                                height: isMobile ? '28px' : '32px',
                                borderRadius: '50%',
                                backgroundColor: DAY_COLOR_MAP[selectedDay],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: isMobile ? '12px' : '14px',
                                fontWeight: 'bold',
                                flexShrink: 0,
                                marginTop: '4px'
                            }}>
                                {idx + 1}
                            </div>

                            {/* 이미지 */}
                            <div style={{ flexShrink: 0 }}>
                                {loc.firstimage ? (
                                    <img
                                        src={loc.firstimage}
                                        alt={loc.title}
                                        style={{
                                            width: isMobile ? '60px' : '72px',
                                            height: isMobile ? '60px' : '72px',
                                            borderRadius: '8px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: isMobile ? '60px' : '72px',
                                        height: isMobile ? '60px' : '72px',
                                        backgroundColor: '#f7f7f7',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: isMobile ? '10px' : '11px',
                                        color: '#717171',
                                        textAlign: 'center'
                                    }}>
                                        이미지<br />없음
                                    </div>
                                )}
                            </div>

                            {/* 정보 */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h4 style={{
                                    margin: '0 0 4px 0',
                                    fontSize: isMobile ? '14px' : '16px',
                                    fontWeight: '600',
                                    color: '#222',
                                    lineHeight: '1.3',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {loc.title}
                                </h4>
                                <p style={{
                                    margin: '0 0 8px 0',
                                    fontSize: isMobile ? '12px' : '14px',
                                    color: '#717171',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {loc.regionName} • {loc.wardName}
                                </p>
                                <span style={{
                                    fontSize: isMobile ? '11px' : '12px',
                                    color: '#0066CC',
                                    textDecoration: 'underline'
                                }}>
                                    상세보기
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 하단 버튼들 */}
                <div style={{
                    padding: isMobile ? '16px' : '20px',
                    borderTop: '1px solid #f0f0f0'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: '12px'
                    }}>
                        {/* 일정 다시 추천받기 버튼 */}
                        <button
                            onClick={onReset}
                            style={{
                                flex: 1,
                                padding: isMobile ? '16px' : '14px 16px',
                                fontSize: isMobile ? '16px' : '15px',
                                fontWeight: '600',
                                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            🔄 다시 추천받기
                        </button>

                        {/* 내 일정으로 담기 버튼 */}
                        <button
                            onClick={() => setShowModal(true)}
                            style={{
                                flex: 1,
                                padding: isMobile ? '16px' : '14px 16px',
                                fontSize: isMobile ? '16px' : '15px',
                                fontWeight: '600',
                                background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(78, 205, 196, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            💾 내 일정에 담기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

TravelMap.propTypes = {
    locations: PropTypes.array.isRequired,
    days: PropTypes.string,
    region: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    onReset: PropTypes.func.isRequired,
};

export default TravelMap;