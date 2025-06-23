import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    CircularProgress,
    Typography,
    Box,
    Chip
} from '@mui/material';
import {
    Add,
    Close,
    LocationOn,
    Favorite,
    Refresh
} from '@mui/icons-material';
import DaySelectionModal from './DaySelectionModal.jsx';

const WishlistModal = ({
    open,
    onClose,
    onAddLocation,
    selectedDay,
    currentLocations = [],
    excludeIdentifiers = []
}) => {
    const [likedPlaces, setLikedPlaces] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [addingIds, setAddingIds] = useState(new Set());

    // Day 선택 모달 상태
    const [daySelectionModal, setDaySelectionModal] = useState({
        open: false,
        selectedLocation: null,
        availableDays: [1, 2, 3] // 기본값, 부모에서 받아올 수도 있음
    });

    // 찜 목록 조회
    const fetchLikedPlaces = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/like/all-liked-places', {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();

            if (data.code === 200) {
                setLikedPlaces(data.allLikedPlaces || []);
            } else if (data.code === 401) {
                setError('로그인이 필요합니다.');
            } else {
                setError(data.error_message || '데이터를 불러오는데 실패했습니다.');
            }
        } catch (err) {
            setError('네트워크 오류가 발생했습니다.');
            console.error('찜 목록 조회 오류:', err);
        } finally {
            setLoading(false);
        }
    };

    // 모달이 열릴 때마다 데이터 로드
    useEffect(() => {
        if (open) {
            fetchLikedPlaces();
        }
    }, [open]);

    // "추가하기" 클릭 시 Day 선택 모달 열기
    const handleAddClick = (place) => {
        console.log('💖 찜에서 추가하기 클릭:', place);

        setDaySelectionModal({
            open: true,
            selectedLocation: place,
            availableDays: [1, 2, 3, 4, 5, 6, 7] // 실제로는 부모에서 받아와야 함
        });
    };

    // Day 선택 완료
    const handleDaySelect = (selectedDay) => {
        console.log('💖 Day 선택 완료:', selectedDay);
        console.log('💖 추가할 장소:', daySelectionModal.selectedLocation);

        if (onAddLocation && daySelectionModal.selectedLocation) {
            const place = daySelectionModal.selectedLocation;
            const placeId = place.id || place.contentId;

            // 로딩 상태 시작
            setAddingIds(prev => new Set([...prev, placeId]));

            // 데이터 형식을 맞춰서 전달
            const formattedPlace = {
                contentId: place.contentId || place.id,
                title: place.title,
                addr: place.addr1,
                firstImage: place.firstImage || place.firstimage,
                mapx: place.mapx || place.longitude,
                mapy: place.mapy || place.latitude,
                regionName: place.regionName,
                wardName: place.wardName,
                dataId: place.id,
                day: selectedDay,
                order: null
            };

            // 부모 컴포넌트에 장소와 Day를 함께 전달
            onAddLocation(formattedPlace, selectedDay);

            // Day 선택 모달 닫기
            setDaySelectionModal({
                open: false,
                selectedLocation: null,
                availableDays: []
            });

            // 로딩 상태 해제 및 메인 모달 닫기
            setTimeout(() => {
                setAddingIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(placeId);
                    return newSet;
                });
                onClose();
            }, 300);
        }
    };

    // Day 선택 모달 닫기
    const handleCloseDaySelection = () => {
        setDaySelectionModal({
            open: false,
            selectedLocation: null,
            availableDays: []
        });
    };

    // 이미 추가된 장소인지 확인 (개선된 버전)
    const isAlreadyAdded = (place) => {
        const placeId = place.contentId || place.id;

        // excludeIdentifiers로 정확한 중복 검사
        return excludeIdentifiers.some(excluded =>
            excluded.contentId === placeId ||
            (excluded.title === place.title &&
                Math.abs(excluded.mapx - (place.mapx || place.longitude)) < 0.0001 &&
                Math.abs(excluded.mapy - (place.mapy || place.latitude)) < 0.0001)
        );
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    style: {
                        borderRadius: '16px',
                        maxHeight: '80vh'
                    }
                }}
            >
                <DialogTitle style={{
                    padding: '24px 24px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <Typography variant="h6" style={{ fontWeight: '600', marginBottom: '4px' }}>
                            찜 목록에서 추가
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            여행 계획에 추가할 찜한 장소를 선택하세요
                        </Typography>
                    </div>
                    <IconButton onClick={onClose} size="small">
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent style={{ padding: '0 24px 24px' }}>
                    {/* 새로고침 버튼 */}
                    {!loading && (
                        <Box style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px'
                        }}>
                            <Typography variant="body2" color="textSecondary">
                                총 {likedPlaces.length}개의 찜한 장소
                            </Typography>
                            <Button
                                startIcon={<Refresh />}
                                onClick={fetchLikedPlaces}
                                size="small"
                                variant="outlined"
                            >
                                새로고침
                            </Button>
                        </Box>
                    )}

                    {/* 로딩 상태 */}
                    {loading && (
                        <Box style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '40px 0'
                        }}>
                            <CircularProgress />
                            <Typography style={{ marginLeft: '12px' }}>
                                찜 목록을 불러오고 있습니다...
                            </Typography>
                        </Box>
                    )}

                    {/* 에러 상태 */}
                    {error && (
                        <Box style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: '#f44336'
                        }}>
                            <Typography color="error" style={{ marginBottom: '16px' }}>
                                {error}
                            </Typography>
                            <Button
                                onClick={fetchLikedPlaces}
                                variant="outlined"
                                color="primary"
                            >
                                다시 시도
                            </Button>
                        </Box>
                    )}

                    {/* 찜 목록 */}
                    {!loading && !error && (
                        <Box style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {likedPlaces.length === 0 ? (
                                <Box style={{
                                    textAlign: 'center',
                                    padding: '40px 20px',
                                    color: '#717171'
                                }}>
                                    <Favorite style={{
                                        fontSize: '48px',
                                        color: '#ddd',
                                        marginBottom: '16px'
                                    }} />
                                    <Typography style={{ marginBottom: '8px' }}>
                                        아직 찜한 여행지가 없습니다
                                    </Typography>
                                    <Typography variant="body2">
                                        마음에 드는 여행지를 찜해보세요!
                                    </Typography>
                                </Box>
                            ) : (
                                <List style={{ padding: 0 }}>
                                    {likedPlaces.map((place) => {
                                        const placeId = place.id || place.contentId;
                                        const isAdded = isAlreadyAdded(place);
                                        const isAdding = addingIds.has(placeId);

                                        return (
                                            <ListItem
                                                key={placeId}
                                                style={{
                                                    padding: '16px',
                                                    borderBottom: '1px solid #f0f0f0',
                                                    borderRadius: '8px',
                                                    marginBottom: '8px',
                                                    backgroundColor: isAdded ? '#f5f5f5' : 'white'
                                                }}
                                            >
                                                {/* 장소 이미지 */}
                                                <div style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    marginRight: '16px',
                                                    flexShrink: 0
                                                }}>
                                                    {place.firstImage || place.firstimage ? (
                                                        <img
                                                            src={place.firstImage || place.firstimage}
                                                            alt={place.title}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
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
                                                        width: '100%',
                                                        height: '100%',
                                                        backgroundColor: '#f7f7f7',
                                                        borderRadius: '8px',
                                                        display: (place.firstImage || place.firstimage) ? 'none' : 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '10px',
                                                        color: '#717171'
                                                    }}>
                                                        <LocationOn fontSize="small" />
                                                    </div>
                                                </div>

                                                {/* 장소 정보 */}
                                                <ListItemText
                                                    primary={
                                                        <Typography
                                                            style={{
                                                                fontWeight: '600',
                                                                fontSize: '16px',
                                                                marginBottom: '4px',
                                                                color: isAdded ? '#999' : '#222'
                                                            }}
                                                        >
                                                            {place.title || '제목 없음'}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <div>
                                                            <Typography
                                                                variant="body2"
                                                                color="textSecondary"
                                                                style={{ marginBottom: '8px' }}
                                                            >
                                                                {place.regionName || place.addr1 || '주소 정보 없음'}
                                                                {place.wardName && place.wardName !== place.regionName && (
                                                                    <span> • {place.wardName}</span>
                                                                )}
                                                            </Typography>
                                                            {isAdded && (
                                                                <Chip
                                                                    label="이미 추가됨"
                                                                    size="small"
                                                                    color="default"
                                                                    style={{ fontSize: '12px' }}
                                                                />
                                                            )}
                                                            {isAdding && (
                                                                <Chip
                                                                    label="추가 중..."
                                                                    size="small"
                                                                    color="primary"
                                                                    style={{ fontSize: '12px' }}
                                                                />
                                                            )}
                                                        </div>
                                                    }
                                                />

                                                {/* 추가 버튼 */}
                                                <ListItemSecondaryAction>
                                                    <IconButton
                                                        onClick={() => handleAddClick(place)}
                                                        disabled={isAdded || isAdding}
                                                        color="primary"
                                                        style={{
                                                            backgroundColor: isAdded || isAdding ? '#f5f5f5' : '#e3f2fd',
                                                            borderRadius: '8px'
                                                        }}
                                                    >
                                                        {isAdding ? (
                                                            <CircularProgress size={20} />
                                                        ) : (
                                                            <Add />
                                                        )}
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            )}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            {/* Day 선택 모달 */}
            <DaySelectionModal
                open={daySelectionModal.open}
                onClose={handleCloseDaySelection}
                onDaySelect={handleDaySelect}
                availableDays={daySelectionModal.availableDays}
                locationTitle={daySelectionModal.selectedLocation?.title}
            />
        </>
    );
};

export default WishlistModal;