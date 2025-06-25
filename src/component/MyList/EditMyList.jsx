import React, { useState, useEffect, useRef, useCallback } from 'react';
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
    CalendarToday,
    SwapHoriz  // 새로 추가
} from '@mui/icons-material';
import dayjs from 'dayjs';
import axios from 'axios';
import 'dayjs/locale/ko';

// @dnd-kit imports
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

dayjs.locale('ko');

// 업데이트된 드래그 가능한 아이템 컴포넌트
const SortableLocationItem = ({ 
    location, 
    index, 
    selectedDay, 
    onDelete, 
    onMoveToDay, // 새로 추가된 함수
    DAY_COLOR_MAP,
    totalLocations,
    totalDays // 전체 day 수
}) => {
    const [showDayMenu, setShowDayMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    
    // 반응형 처리
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ 
        id: `${location.contentId}-${location.day}-${location.order}-${index}` 
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1000 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={{
                ...style,
                display: 'flex',
                gap: '12px',
                padding: '20px 0',
                borderBottom: index < totalLocations - 1 ? '1px solid #f0f0f0' : 'none',
                position: 'relative',
                backgroundColor: isDragging ? '#e3f2fd' : 'transparent',
                border: isDragging ? '2px dashed #2196f3' : '2px solid transparent',
                borderRadius: '8px',
                transition: isDragging ? 'none' : 'all 0.2s ease',
            }}
        >
            {/* 드래그 핸들 */}
            <div 
                {...attributes}
                {...listeners}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    touchAction: 'none',
                    padding: '4px',
                }}
                title="드래그하여 순서 변경"
            >
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
                    transform: isDragging ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.2s ease',
                    boxShadow: isDragging ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 6px rgba(0,0,0,0.1)',
                }}>
                    {index + 1}
                </div>
            </div>

            {/* 이미지 */}
            <div style={{ flexShrink: 0 }}>
                {location.firstImage ? (
                    <img
                        src={location.firstImage}
                        alt={location.title}
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
                    {location.title}
                </h4>

                <p style={{
                    margin: '0 0 4px 0',
                    fontSize: '13px',
                    color: '#999',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {location.addr || '주소 정보 없음'}
                </p>

                {/* Day 정보 표시 */}
                <div style={{
                    display: 'inline-block',
                    padding: '2px 6px',
                    backgroundColor: DAY_COLOR_MAP[location.day],
                    color: 'white',
                    fontSize: '10px',
                    borderRadius: '10px',
                    fontWeight: 'bold'
                }}>
                    Day {location.day}
                </div>
            </div>

            {/* 모바일에서 오른쪽 중앙에 배치되는 액션 버튼들 */}
            {isMobile && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingLeft: '8px'
                }}>
                    {/* Day 이동 버튼 */}
                    <div style={{ position: 'relative' }}>
                        <IconButton
                            size="small"
                            onClick={() => setShowDayMenu(!showDayMenu)}
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                width: '32px',
                                height: '32px'
                            }}
                            title="다른 날로 이동"
                        >
                            <SwapHoriz fontSize="small" color="primary" />
                        </IconButton>

                        {/* Day 선택 드롭다운 */}
                        {showDayMenu && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: '0',
                                marginTop: '4px',
                                backgroundColor: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                zIndex: 1000,
                                minWidth: '80px',
                                overflow: 'hidden'
                            }}>
                                {Array.from({ length: totalDays }, (_, i) => i + 1)
                                    .filter(day => day !== location.day)
                                    .map(day => (
                                        <button
                                            key={day}
                                            onClick={() => {
                                                onMoveToDay(location, day);
                                                setShowDayMenu(false);
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                border: 'none',
                                                backgroundColor: 'transparent',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                        >
                                            <div style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                backgroundColor: DAY_COLOR_MAP[day]
                                            }} />
                                            Day {day}
                                        </button>
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* 삭제 버튼 */}
                    <IconButton
                        size="small"
                        onClick={onDelete}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            width: '32px',
                            height: '32px'
                        }}
                    >
                        <Delete fontSize="small" color="error" />
                    </IconButton>
                </div>
            )}

            {/* 데스크톱에서 오른쪽 상단에 배치되는 액션 버튼들 */}
            {!isMobile && (
                <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '0px',
                    display: 'flex',
                    gap: '4px'
                }}>
                    {/* Day 이동 버튼 */}
                    <div style={{ position: 'relative' }}>
                        <IconButton
                            size="small"
                            onClick={() => setShowDayMenu(!showDayMenu)}
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            title="다른 날로 이동"
                        >
                            <SwapHoriz fontSize="small" color="primary" />
                        </IconButton>

                        {/* Day 선택 드롭다운 */}
                        {showDayMenu && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: '0',
                                marginTop: '4px',
                                backgroundColor: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                zIndex: 1000,
                                minWidth: '80px',
                                overflow: 'hidden'
                            }}>
                                {Array.from({ length: totalDays }, (_, i) => i + 1)
                                    .filter(day => day !== location.day)
                                    .map(day => (
                                        <button
                                            key={day}
                                            onClick={() => {
                                                onMoveToDay(location, day);
                                                setShowDayMenu(false);
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px',
                                                border: 'none',
                                                backgroundColor: 'transparent',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                        >
                                            <div style={{
                                                width: '12px',
                                                height: '12px',
                                                borderRadius: '50%',
                                                backgroundColor: DAY_COLOR_MAP[day]
                                            }} />
                                            Day {day}
                                        </button>
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* 삭제 버튼 */}
                    <IconButton
                        size="small"
                        onClick={onDelete}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Delete fontSize="small" color="error" />
                    </IconButton>
                </div>
            )}
        </div>
    );
};

const EditMyList = ({
    onOpenSpotSearch,
    onOpenWishlistModal,
    onOpenDateModal,
    onAddLocation,
    onUpdateDates,
    totalDays 
}) => {
    const { planId } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(planId);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersByDay = useRef({});
    const polylinesByDay = useRef({});

    // @dnd-kit 센서 설정 (터치 지원 포함)
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px 이동 후 드래그 시작 (터치 스크롤과 구분)
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // 상태 관리
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState(1);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [planData, setPlanData] = useState({
        title: '',
        startDate: null,
        endDate: null,
        locations: []
    });

    const DAY_COLOR_MAP = {
        1: '#FF6B6B',
        2: '#4ECDC4',
        3: '#45B7D1',
        4: '#FFA07A',
        5: '#98D8C8',
        6: '#F7DC6F',
        7: '#BB8FCE'
    };

    // Day 이동 핸들러 추가
    const handleMoveToDay = useCallback((location, targetDay) => {
        if (location.day === targetDay) return;

        setPlanData(prev => {
            // 대상 day의 최대 order 구하기
            const maxOrderInTargetDay = prev.locations
                .filter(loc => Number(loc.day) === Number(targetDay))
                .reduce((max, loc) => Math.max(max, loc.order || 0), 0);

            // 이동할 장소 업데이트
            const updatedLocations = prev.locations.map(loc => {
                if (loc.contentId === location.contentId && 
                    loc.day === location.day && 
                    loc.order === location.order) {
                    return {
                        ...loc,
                        day: Number(targetDay),
                        order: maxOrderInTargetDay + 1
                    };
                }
                return loc;
            });

            // 원래 day에서 순서 재정렬
            const originalDayLocations = updatedLocations
                .filter(loc => Number(loc.day) === Number(location.day))
                .sort((a, b) => a.order - b.order);

            originalDayLocations.forEach((loc, index) => {
                const locationIndex = updatedLocations.findIndex(l => 
                    l.contentId === loc.contentId && l.day === loc.day && l.order === loc.order
                );
                if (locationIndex !== -1) {
                    updatedLocations[locationIndex].order = index + 1;
                }
            });

            return {
                ...prev,
                locations: updatedLocations
            };
        });

        alert(`Day ${location.day}에서 Day ${targetDay}로 이동했습니다.`);
    }, []);

    // 스크롤바 숨기는 CSS 추가
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .day-tabs-scroll::-webkit-scrollbar {
                display: none;
            }
            .day-tabs-scroll {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
        `;
        document.head.appendChild(style);

        return () => {
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
        };
    }, []);

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
                const newPlanData = {
                    title: result.title || '',
                    startDate: result.startDate ? dayjs(result.startDate) : null,
                    endDate: result.endDate ? dayjs(result.endDate) : null,
                    locations: locations
                };

                setPlanData(newPlanData);

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

            markersByDay.current[day] = dayLocs.map((loc, index) => {
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
                                ${index + 1}
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

    // @dnd-kit 드래그 종료 핸들러
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = dayLocations.findIndex(
            (loc, idx) => `${loc.contentId}-${loc.day}-${loc.order}-${idx}` === active.id
        );
        const newIndex = dayLocations.findIndex(
            (loc, idx) => `${loc.contentId}-${loc.day}-${loc.order}-${idx}` === over.id
        );

        if (oldIndex !== -1 && newIndex !== -1) {
            // arrayMove로 순서 변경
            const reorderedLocations = arrayMove(dayLocations, oldIndex, newIndex);
            
            // order 값 재할당
            const updatedDayLocations = reorderedLocations.map((loc, index) => ({
                ...loc,
                order: index + 1
            }));

            // 전체 locations 업데이트
            setPlanData(prev => {
                const otherDayLocations = prev.locations.filter(loc => Number(loc.day) !== selectedDay);
                return {
                    ...prev,
                    locations: [...otherDayLocations, ...updatedDayLocations]
                };
            });
        }
    };

    // 장소 삭제
    const handleDeleteLocation = useCallback((locationIndex) => {
        if (confirm('이 장소를 삭제하시겠습니까?')) {
            setPlanData(prev => {
                const updatedLocations = prev.locations.filter((_, index) => index !== locationIndex);
                return { ...prev, locations: updatedLocations };
            });
        }
    }, []);

    // 제목 수정 (인라인 편집) - 15자 제한 추가
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

    // 15자 제한 핸들러
    const handleTitleChange = (e) => {
        const value = e.target.value;
        if (value.length <= 12) {
            setTempTitle(value);
        }
    };

    // 장소 추가 핸들러들
    const handleOpenSpotSearch = useCallback(() => {
        onOpenSpotSearch({
            selectedDay,
            currentLocations: planData.locations
        });
    }, [selectedDay, planData.locations, onOpenSpotSearch]);

    const handleOpenWishlist = useCallback(() => {
        onOpenWishlistModal({
            selectedDay,
            currentLocations: planData.locations
        });
    }, [selectedDay, planData.locations, onOpenWishlistModal]);

    const handleOpenDateModal = useCallback(() => {
        onOpenDateModal({
            startDate: planData.startDate,
            endDate: planData.endDate
        });
    }, [planData.startDate, planData.endDate, onOpenDateModal]);

    // 외부에서 호출되는 장소 추가 함수
    const addLocationToDay = useCallback((newLocation, targetDay) => {
        setPlanData(prev => {
            const maxOrder = prev.locations
                .filter(loc => Number(loc.day) === Number(targetDay))
                .reduce((max, loc) => Math.max(max, loc.order || 0), 0);

            const locationWithOrder = {
                ...newLocation,
                day: Number(targetDay),
                order: maxOrder + 1,
                id: `${newLocation.contentId}-${targetDay}-${Date.now()}`
            };

            const updatedLocations = [...prev.locations, locationWithOrder];
            return {
                ...prev,
                locations: updatedLocations
            };
        });
    }, []);

    const updatePlanDates = useCallback((startDate, endDate) => {
        setPlanData(prev => {
            const newDayCount = endDate.diff(startDate, 'day') + 1;
            const currentDayCount = prev.endDate ? prev.endDate.diff(prev.startDate, 'day') + 1 : 0;

            let adjustedLocations = [...prev.locations];

            if (newDayCount < currentDayCount) {
                adjustedLocations = prev.locations.map(loc => {
                    if (loc.day > newDayCount) {
                        return { ...loc, day: newDayCount };
                    }
                    return loc;
                });
            }

            const updated = {
                ...prev,
                startDate,
                endDate,
                locations: adjustedLocations
            };

            return updated;
        });

        const newDayCount = endDate.diff(startDate, 'day') + 1;
        if (selectedDay > newDayCount) {
            setSelectedDay(1);
        }
    }, [selectedDay]);

    // 부모 컴포넌트에 함수들 전달
    useEffect(() => {
        if (onAddLocation && onAddLocation.current !== addLocationToDay) {
            onAddLocation.current = addLocationToDay;
        }
        if (onUpdateDates && onUpdateDates.current !== updatePlanDates) {
            onUpdateDates.current = updatePlanDates;
        }
    }, [addLocationToDay, updatePlanDates, onAddLocation, onUpdateDates]);

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

        try {
            const userId = localStorage.getItem('userId') || 1;
            const payload = {
                userId: Number(userId),
                title: planData.title,
                travelLists: planData.locations.map(loc => ({
                    dataId: loc.dataId,
                    day: loc.day,
                    order: loc.order
                })),
                startDate: planData.startDate.format('YYYY-MM-DD'),
                endDate: planData.endDate.format('YYYY-MM-DD'),
            };

            let response;
            let successMessage;

            if (isEditMode) {
                response = await axios.put(`/api/my-plan/update/${planId}`, payload, {
                    headers: { 'userId': userId }
                });
                successMessage = '여행 계획이 수정되었습니다.';
            } else {
                response = await axios.post('/api/my-plan/add-my-plan', payload, {
                    headers: { 'userId': userId }
                });
                successMessage = '새 여행 계획이 저장되었습니다.';
            }

            if (response.data.code === 200) {
                alert(successMessage);
                navigate('/myplan');
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
                flex: isMobile ? 'none' : '3',
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
            </div>

            {/* 장소 목록 영역 */}
            <div style={{
                flex: isMobile ? 'none' : '2',
                width: isMobile ? '100%' : 'auto',
                height: isMobile ? 'auto' : '100%',
                backgroundColor: 'white',
                borderLeft: isMobile ? 'none' : '1px solid #e5e5e5',
                borderTop: isMobile ? '1px solid #e5e5e5' : 'none',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* 상단 컨트롤 패널 */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: isMobile ? '0' : '0 0 12px 12px',
                    padding: isMobile ? '16px 20px' : '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderBottom: '1px solid #f0f0f0'
                }}>
                    {/* 제목과 날짜 정보 */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px'
                    }}>
                        {/* 제목 편집 - 왼쪽 (15자 제한 적용) */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                            {editingTitle ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <input
                                            type="text"
                                            value={tempTitle}
                                            onChange={handleTitleChange}
                                            onKeyPress={(e) => e.key === 'Enter' && saveTitleEdit()}
                                            onBlur={saveTitleEdit}
                                            autoFocus
                                            maxLength={12}
                                            style={{
                                                fontSize: isMobile ? '16px' : '18px',
                                                fontWeight: '600',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                padding: '4px 8px',
                                                width: '100%',
                                                maxWidth: '200px'
                                            }}
                                        />
                                    </div>
                                    {/* 글자 수 표시 */}
                                    <span style={{
                                        fontSize: '11px',
                                        color: tempTitle.length >= 12 ? '#ff4444' : '#666',
                                        marginLeft: '4px'
                                    }}>
                                        {tempTitle.length}/12자
                                    </span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h2 style={{
                                        margin: 0,
                                        fontSize: isMobile ? '16px' : '18px',
                                        fontWeight: '600',
                                        color: '#222',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
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

                        {/* 날짜 정보 카드 - 오른쪽 */}
                        <div
                            onClick={handleOpenDateModal}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#f8f9fa',
                                padding: '6px 10px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'background 0.2s ease',
                                border: '1px solid #e9ecef',
                                marginLeft: '8px',
                                flexShrink: 0
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#e9ecef'}
                            onMouseLeave={(e) => e.currentTarget.style.background = '#f8f9fa'}
                        >
                            <CalendarToday style={{ fontSize: '14px', color: '#495057' }} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{
                                    fontSize: '11px',
                                    color: '#6c757d',
                                    lineHeight: 1
                                }}>
                                    {planData.startDate && planData.endDate ?
                                        `${planData.startDate.format('M/D')} ~ ${planData.endDate.format('M/D')}`
                                        : '날짜 설정'
                                    }
                                </span>
                                <span style={{
                                    fontSize: '12px',
                                    color: '#495057',
                                    fontWeight: '600',
                                    marginTop: '1px'
                                }}>
                                    {getDurationText()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Day 탭들과 액션 버튼들 */}
                    <div style={{
                        display: 'flex',
                        alignItems: isMobile ? 'stretch' : 'center',
                        justifyContent: 'space-between',
                        gap: isMobile ? '0' : '16px',
                        flexDirection: isMobile ? 'column' : 'row'
                    }}>
                        {/* Day 탭들 */}
                        <div
                            className={isMobile ? "day-tabs-scroll" : ""}
                            style={{
                                display: 'flex',
                                gap: '6px',
                                flexWrap: 'nowrap',
                                marginBottom: isMobile ? '12px' : '0',
                                overflowX: isMobile ? 'scroll' : 'visible',
                                paddingBottom: isMobile ? '4px' : '0',
                                WebkitOverflowScrolling: 'touch'
                            }}>
                            {Array.from({ length: totalDays || (planData.startDate && planData.endDate ? planData.endDate.diff(planData.startDate, 'day') + 1 : 3) }, (_, index) => index + 1).map(day => (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDay(day)}
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: '20px',
                                        border: 'none',
                                        backgroundColor: selectedDay === day ? DAY_COLOR_MAP[day] : '#f7f7f7',
                                        color: selectedDay === day ? 'white' : '#717171',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        whiteSpace: 'nowrap',
                                        flexShrink: 0
                                    }}
                                >
                                    Day {day}
                                </button>
                            ))}
                        </div>

                        {/* 액션 버튼들 */}
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            flexShrink: 0,
                            flexDirection: isMobile ? 'column' : 'row',
                            width: isMobile ? '100%' : 'auto'
                        }}>
                            {/* 장소 추가하기 버튼 (드롭다운) */}
                            <div className="add-menu-container" style={{
                                position: 'relative',
                                width: isMobile ? '100%' : 'auto'
                            }}>
                                <button
                                    onClick={() => setShowAddMenu(!showAddMenu)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: isMobile ? '10px 16px' : '6px 12px',
                                        backgroundColor: 'white',
                                        border: '2px solid #4ECDC4',
                                        borderRadius: isMobile ? '8px' : '20px',
                                        color: '#4ECDC4',
                                        fontSize: isMobile ? '14px' : '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        whiteSpace: 'nowrap',
                                        width: isMobile ? '100%' : 'auto',
                                        justifyContent: isMobile ? 'center' : 'flex-start'
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
                                    <Add style={{ fontSize: isMobile ? '16px' : '14px' }} />
                                    장소 추가하기
                                </button>

                                {/* 드롭다운 메뉴 */}
                                {showAddMenu && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: isMobile ? 0 : 'auto',
                                        right: isMobile ? 0 : 0,
                                        marginTop: '4px',
                                        backgroundColor: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        zIndex: 1000,
                                        minWidth: isMobile ? 'auto' : '140px',
                                        overflow: 'hidden'
                                    }}>
                                        <button
                                            onClick={() => {
                                                handleOpenSpotSearch();
                                                setShowAddMenu(false);
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: isMobile ? '12px 16px' : '10px 12px',
                                                border: 'none',
                                                backgroundColor: 'transparent',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                fontSize: isMobile ? '14px' : '13px',
                                                borderBottom: '1px solid #f0f0f0'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                        >
                                            🔍 장소 검색
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleOpenWishlist();
                                                setShowAddMenu(false);
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: isMobile ? '12px 16px' : '10px 12px',
                                                border: 'none',
                                                backgroundColor: 'transparent',
                                                textAlign: 'left',
                                                cursor: 'pointer',
                                                fontSize: isMobile ? '14px' : '13px'
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                        >
                                            💖 찜 목록에서
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* 저장하기 버튼 */}
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: isMobile ? '10px 16px' : '6px 12px',
                                    backgroundColor: saving ? '#ccc' : '#28a745',
                                    border: 'none',
                                    borderRadius: isMobile ? '8px' : '20px',
                                    color: 'white',
                                    fontSize: isMobile ? '14px' : '12px',
                                    fontWeight: '600',
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    whiteSpace: 'nowrap',
                                    width: isMobile ? '100%' : 'auto',
                                    justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    if (!saving) {
                                        e.target.style.backgroundColor = '#218838';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!saving) {
                                        e.target.style.backgroundColor = '#28a745';
                                    }
                                }}
                            >
                                {saving ? <CircularProgress size={isMobile ? 16 : 12} /> : <Save style={{ fontSize: isMobile ? '16px' : '14px' }} />}
                                {saving ? '저장 중...' : '저장하기'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 장소 목록 - @dnd-kit으로 드래그 앤 드롭 */}
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
                            color: '#717171',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <p>이 날에는 아직 계획된 장소가 없습니다.</p>
                            </div>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={dayLocations.map((loc, idx) => `${loc.contentId}-${loc.day}-${loc.order}-${idx}`)}
                                strategy={verticalListSortingStrategy}
                            >
                                {dayLocations.map((loc, idx) => (
                                    <SortableLocationItem
                                        key={`${loc.contentId}-${loc.day}-${loc.order}-${idx}`}
                                        location={loc}
                                        index={idx}
                                        selectedDay={selectedDay}
                                        onDelete={() => handleDeleteLocation(planData.locations.findIndex(l =>
                                            l.contentId === loc.contentId && l.day === loc.day && l.order === loc.order
                                        ))}
                                        onMoveToDay={handleMoveToDay}
                                        DAY_COLOR_MAP={DAY_COLOR_MAP}
                                        totalLocations={dayLocations.length}
                                        totalDays={totalDays || (planData.startDate && planData.endDate ? planData.endDate.diff(planData.startDate, 'day') + 1 : 3)}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditMyList;