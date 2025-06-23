import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Button, 
    Typography, 
    CircularProgress,
    Alert,
    IconButton,
    Fab
} from '@mui/material';
import { 
    ArrowBack, 
    Edit, 
    Delete, 
    Save, 
    Add,
    Favorite,
    CalendarToday
} from '@mui/icons-material';
import dayjs from 'dayjs';
import axios from 'axios';
import 'dayjs/locale/ko';

dayjs.locale('ko');

const EditMyList = ({ 
    onOpenSpotSearch, 
    onOpenWishlistModal, 
    onOpenDateModal,
    onAddLocation, // 부모에서 전달받는 장소 추가 함수
    onUpdateDates  // 부모에서 전달받는 날짜 업데이트 함수
}) => {
    const { planId } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(planId);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersByDay = useRef({});
    const polylinesByDay = useRef({});

    // 상태 관리
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState(1);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [planData, setPlanData] = useState({
        title: '',
        startDate: null,
        endDate: null,
        locations: []
    });
    // 삭제 장소 저장
    const [deletedLocations, setDeletedLocations] = useState([]);

    const DAY_COLOR_MAP = {
        1: '#FF6B6B',
        2: '#4ECDC4',
        3: '#45B7D1',
        4: '#FFA07A',
        5: '#98D8C8',
        6: '#F7DC6F',
        7: '#BB8FCE'
    };

    // 반응형 처리
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 데이터 로드
    useEffect(() => {
        if (isEditMode) {
            fetchPlanData();
        } else {
            initializeNewPlan();
        }
    }, [planId]);

    // 기존 여행 계획 데이터 불러오기
    const fetchPlanData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const userId = localStorage.getItem('userId') || 1;
            const response = await axios.get(`/api/my-plan/detail/${planId}`, {
                headers: { 'userId': userId }
            });

            if (response.data.code === 200) {
                const result = response.data.result;
                const locations = result.sendDataDto || [];
                console.log('🔍 API 응답 전체:', response.data);
                console.log('🔍 result:', result);
                console.log('🔍 locations 배열:', locations);
                const newPlanData = {
                    title: result.title || '',
                    startDate: result.startDate ? dayjs(result.startDate) : null,
                    endDate: result.endDate ? dayjs(result.endDate) : null,
                    locations: locations
                };
                
                setPlanData(newPlanData);
                console.log(newPlanData);

                if (locations.length > 0) {
                    setSelectedDay(locations[0].day || 1);
                }
            } else {
                setError('여행 계획을 불러오는데 실패했습니다.');
            }
        } catch (err) {
            console.error('API 호출 오류:', err);
            setError('서버 연결에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };


    // 새 여행 계획 초기화
    const initializeNewPlan = () => {
        setPlanData({
            title: '새로운 여행 계획',
            startDate: dayjs(),
            endDate: dayjs().add(2, 'day'),
            locations: []
        });
    };

    // 지도 초기화 및 마커 표시
    useEffect(() => {
        if (!mapRef.current || !window.naver || planData.locations.length === 0) return;

        const naver = window.naver;
        const locations = planData.locations;

        if (!mapInstanceRef.current) {
            const firstLoc = locations[0];
            mapInstanceRef.current = new naver.maps.Map(mapRef.current, {
                center: new naver.maps.LatLng(firstLoc.mapy, firstLoc.mapx),
                zoom: 13,
                disableDoubleClickZoom: true,
            });
        }

        const map = mapInstanceRef.current;
        const dayList = [...new Set(locations.map(loc => Number(loc.day)))].sort((a, b) => a - b);

        // 기존 마커/폴리라인 제거
        Object.values(markersByDay.current).flat().forEach(marker => marker.setMap(null));
        Object.values(polylinesByDay.current).forEach(polyline => polyline.setMap(null));
        markersByDay.current = {};
        polylinesByDay.current = {};

        // 새 마커/폴리라인 생성
        dayList.forEach(day => {
            const dayLocs = locations.filter(loc => Number(loc.day) === day).sort((a, b) => a.order - b.order);
            if (!dayLocs.length) return;

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
                strokeOpacity: selectedDay === day ? 1 : 0.3,
                strokeWeight: selectedDay === day ? 4 : 2,
                strokeStyle: 'solid',
            });

            naver.maps.Event.addListener(polyline, 'click', () => {
                setSelectedDay(day);
            });

            polylinesByDay.current[day] = polyline;
        });
    }, [planData.locations]);

    // 선택된 Day 변경 시 폴리라인 스타일 업데이트
    useEffect(() => {
        Object.entries(polylinesByDay.current).forEach(([day, polyline]) => {
            if (polyline) {
                polyline.setOptions({
                    strokeOpacity: selectedDay === Number(day) ? 1 : 0.3,
                    strokeWeight: selectedDay === Number(day) ? 4 : 2,
                });
            }
        });
    }, [selectedDay]);

    // 선택된 Day의 첫 장소로 지도 중심 이동
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        const firstLoc = planData.locations
            .filter(loc => Number(loc.day) === selectedDay)
            .sort((a, b) => a.order - b.order)[0];

        if (firstLoc) {
            map.panTo(new window.naver.maps.LatLng(firstLoc.mapy, firstLoc.mapx));
        }
    }, [selectedDay]);

    // 데이터 처리 함수들
    const dayList = [...new Set(planData.locations.map(loc => Number(loc.day)))].sort((a, b) => a - b);
    const dayLocations = planData.locations
        .filter(loc => Number(loc.day) === selectedDay)
        .sort((a, b) => a.order - b.order);



    // 장소 삭제
    const handleDeleteLocation = (locationIndex) => {
        const confirmDelete = confirm('이 장소를 삭제하시겠습니까?');
        if (!confirmDelete) return;

        const target = planData.locations[locationIndex];

        // 삭제된 장소 따로 저장
        setDeletedLocations(prev => [...prev, target]);

        // UI에서만 제거
        const updatedLocations = planData.locations.filter((_, index) => index !== locationIndex);
        setPlanData(prev => ({ ...prev, locations: updatedLocations }));
    };

    // 제목 수정 (인라인 편집)
    const [editingTitle, setEditingTitle] = useState(false);
    const [tempTitle, setTempTitle] = useState('');

    const startTitleEdit = () => {
        setTempTitle(planData.title);
        setEditingTitle(true);
    };

    const saveTitleEdit = () => {
        if (tempTitle.trim()) {
            setPlanData(prev => ({ ...prev, title: tempTitle.trim() }));
        }
        setEditingTitle(false);
    };

    // 장소 추가 핸들러들
    const handleOpenSpotSearch = () => {
        onOpenSpotSearch({
            selectedDay,
            currentLocations: planData.locations
        });
    };

    const handleOpenWishlist = () => {
        onOpenWishlistModal({
            selectedDay,
            currentLocations: planData.locations
        });
    };

    const handleOpenDateModal = () => {
        setTempDateRange([{
            startDate: planData.startDate?.toDate() || new Date(),
            endDate: planData.endDate?.toDate() || new Date(),
            key: 'selection'
        }]);
        setDateModalOpen(true);
    };

    // 외부에서 호출되는 장소 추가 함수
    const addLocationToDay = (newLocation, targetDay) => {
        const maxOrder = planData.locations
            .filter(loc => loc.day === targetDay)
            .reduce((max, loc) => Math.max(max, loc.order || 0), 0);

        const locationWithOrder = {
            ...newLocation,
            day: targetDay,
            order: maxOrder + 1
        };

        setPlanData(prev => ({
            ...prev,
            locations: [...prev.locations, locationWithOrder]
        }));
    };

    // 날짜 업데이트 함수
    const updatePlanDates = (startDate, endDate) => {
        setPlanData(prev => ({
            ...prev,
            startDate,
            endDate
        }));
    };

    // 부모 컴포넌트에 함수들 전달
    useEffect(() => {
        if (onAddLocation) {
            onAddLocation.current = addLocationToDay;
        }
        if (onUpdateDates) {
            onUpdateDates.current = updatePlanDates;
        }
    }, [onAddLocation, onUpdateDates]);

    // 저장
    const handleSave = async () => {
        if (!planData.title.trim()) {
            setError('여행 제목을 입력해주세요.');
            return;
        }

        if (!planData.startDate || !planData.endDate) {
            setError('여행 날짜를 선택해주세요.');
            return;
        }

        setSaving(true);
        setError(null);
        console.log(planData.startDate);
        console.log(planData.endDate);

        try {
            const userId = localStorage.getItem('userId') || 1;
            const token = localStorage.getItem('jwtToken');  // 토큰 꺼내기
            const payload = {
                id: planData.id,
                userId: Number(userId),
                title: planData.title,
                sendDataDto: planData.locations,
                deletedLocations: deletedLocations,
                startDate: planData.startDate.format('YYYY-MM-DD'),
                endDate: planData.endDate.format('YYYY-MM-DD'),
            };

            let response;
            if (isEditMode) {
                response = await axios.put(`/api/my-plan/update/${planId}`, payload, {                 
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'userId': userId}
                });
                // title="날짜 수정"
            } else {
                response = await axios.post('/api/my-plan/add-my-plan', payload, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'userId': userId },
                });
            }

            if (response.data.code === 200) {
                alert(isEditMode ? '여행 계획이 수정되었습니다.' : '새 여행 계획이 저장되었습니다.');
                navigate(`/myplan`);
            } else {
                setError('저장에 실패했습니다.');
            }
        } catch (err) {
            console.error('저장 오류:', err);
            setError('저장 중 오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    const getDurationText = () => {
        if (!planData.startDate || !planData.endDate) return '';
        const diffDays = planData.endDate.diff(planData.startDate, 'day') + 1;
        if (diffDays === 1) return '당일치기';
        return `${diffDays - 1}박 ${diffDays}일`;
    };

    // 로딩 상태
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh'
            }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            width: '100%',
            height: isMobile ? 'auto' : '80vh',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            position: 'relative'
        }}>
            {/* 에러 알림 */}
            {error && (
                <Alert 
                    severity="error" 
                    onClose={() => setError(null)}
                    style={{
                        position: 'fixed',
                        top: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1000,
                        width: isMobile ? '90%' : 'auto'
                    }}
                >
                    {error}
                </Alert>
            )}

            {/* 지도 영역 */}
            <div style={{
                flex: isMobile ? 'none' : '1',
                height: isMobile ? '50vh' : '100%',
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
                    top: '20px',
                    left: '20px',
                    right: '20px',
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
                        marginBottom: '12px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Button
                                startIcon={<ArrowBack />}
                                onClick={() => navigate('/calendar')}
                                size="small"
                            >
                                돌아가기
                            </Button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <IconButton 
                                size="small"
                                onClick={handleOpenDateModal}
                                title="날짜 수정"
                            >
                                <CalendarToday />
                            </IconButton>
                            <span style={{
                                fontSize: '14px',
                                color: '#717171',
                                backgroundColor: '#f7f7f7',
                                padding: '4px 8px',
                                borderRadius: '6px'
                            }}>
                                {getDurationText()}
                            </span>
                        </div>
                    </div>

                    {/* 제목 편집 */}
                    <div style={{ marginBottom: '12px' }}>
                        {editingTitle ? (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    value={tempTitle}
                                    onChange={(e) => setTempTitle(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && saveTitleEdit()}
                                    onBlur={saveTitleEdit}
                                    autoFocus
                                    style={{
                                        fontSize: isMobile ? '16px' : '18px',
                                        fontWeight: '600',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        padding: '4px 8px',
                                        flex: 1
                                    }}
                                />
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h2 style={{
                                    margin: 0,
                                    fontSize: isMobile ? '16px' : '18px',
                                    fontWeight: '600',
                                    color: '#222'
                                }}>
                                    {planData.title}
                                </h2>
                                <IconButton 
                                    size="small"
                                    onClick={startTitleEdit}
                                    title="제목 수정"
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                            </div>
                        )}
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap'
                    }}>
                        {dayList.map(day => (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '24px',
                                    border: 'none',
                                    backgroundColor: selectedDay === day ? DAY_COLOR_MAP[day] : '#f7f7f7',
                                    color: selectedDay === day ? 'white' : '#717171',
                                    fontSize: '14px',
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

                {/* 저장 버튼 */}
                <Fab
                    color="primary"
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                        position: 'absolute',
                        bottom: '20px',
                        right: '20px',
                        background: saving ? '#ccc' : 'linear-gradient(45deg, #1976d2 30%, #1565c0 90%)',
                    }}
                >
                    {saving ? <CircularProgress size={24} /> : <Save />}
                </Fab>
            </div>

            {/* 장소 목록 영역 */}
            <div style={{
                width: isMobile ? '100%' : '400px',
                height: isMobile ? 'auto' : '100%',
                backgroundColor: 'white',
                borderLeft: isMobile ? 'none' : '1px solid #e5e5e5',
                borderTop: isMobile ? '1px solid #e5e5e5' : 'none',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* 헤더 */}
                <div style={{
                    padding: '24px 20px 20px',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                    }}>
                        <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: DAY_COLOR_MAP[selectedDay],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold'
                        }}>
                            {selectedDay}
                        </div>
                        <h3 style={{
                            margin: 0,
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#222'
                        }}>
                            Day {selectedDay}의 여행
                        </h3>
                    </div>
                    <p style={{
                        margin: 0,
                        fontSize: '14px',
                        color: '#717171'
                    }}>
                        {dayLocations.length}개의 장소를 방문해요
                    </p>
                </div>

                {/* 장소 목록 */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '0 20px',
                    maxHeight: isMobile ? '60vh' : 'none'
                }}>
                    {dayLocations.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: '#717171'
                        }}>
                            <p>이 날에는 아직 계획된 장소가 없습니다.</p>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<Add />}
                                    onClick={handleOpenSpotSearch}
                                    size="small"
                                >
                                    장소 검색
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<Favorite />}
                                    onClick={handleOpenWishlist}
                                    size="small"
                                >
                                    찜 목록에서
                                </Button>
                            </div>
                        </div>
                    ) : (
                        dayLocations.map((loc, idx) => (
                            <div
                                key={`${loc.contentId}-${idx}`}
                                style={{
                                    display: 'flex',
                                    gap: '12px',
                                    padding: '20px 0',
                                    borderBottom: idx < dayLocations.length - 1 ? '1px solid #f0f0f0' : 'none',
                                    position: 'relative'
                                }}
                            >
                                {/* 순서 번호 */}
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: DAY_COLOR_MAP[selectedDay],
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    flexShrink: 0,
                                    marginTop: '4px'
                                }}>
                                    {idx + 1}
                                </div>

                                {/* 이미지 */}
                                <div style={{ flexShrink: 0 }}>
                                    {loc.firstImage ? (
                                        <img
                                            src={loc.firstImage}
                                            alt={loc.title}
                                            style={{
                                                width: '72px',
                                                height: '72px',
                                                borderRadius: '8px',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '72px',
                                            height: '72px',
                                            backgroundColor: '#f7f7f7',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '11px',
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
                                        fontSize: '16px',
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
                                        fontSize: '14px',
                                        color: '#717171',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {loc.regionName} • {loc.wardName}
                                    </p>
                                </div>

                                {/* 삭제 버튼 */}
                                <IconButton
                                    size="small"
                                    onClick={() => handleDeleteLocation(planData.locations.findIndex(l => 
                                        l.contentId === loc.contentId && l.day === loc.day && l.order === loc.order
                                    ))}
                                    style={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '0px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <Delete fontSize="small" color="error" />
                                </IconButton>
                            </div>
                        ))
                    )}
                </div>

                {/* 하단 장소 추가 버튼들 */}
                {dayLocations.length > 0 && (
                    <div style={{
                        padding: '20px',
                        borderTop: '1px solid #f0f0f0'
                    }}>
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'center'
                        }}>
                            <Button
                                variant="outlined"
                                startIcon={<Add />}
                                onClick={handleOpenSpotSearch}
                                size="small"
                            >
                                장소 검색
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<Favorite />}
                                onClick={handleOpenWishlist}
                                size="small"
                            >
                                찜 목록에서
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditMyList;