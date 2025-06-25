import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    CircularProgress,
    Typography,
    Box,
    InputAdornment,
    Chip
} from '@mui/material';
import {
    Search,
    Add,
    Close,
    LocationOn
} from '@mui/icons-material';

const SpotSearchModal = ({
    open,
    onClose,
    onAddLocation,
    selectedDay,  // 👈 현재 선택된 Day
    currentLocations = [],
    excludeIdentifiers = []
}) => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const userId = localStorage.getItem('userId') || '1';

    // 모달이 열릴 때마다 초기화
    useEffect(() => {
        if (open) {
            setSearchKeyword('');
            setSearchResults([]);
            setSearched(false);
        }
    }, [open]);

    // 검색 API 호출
    const fetchSearch = async () => {
        if (!searchKeyword.trim()) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/my-plan/search?keyword=${encodeURIComponent(searchKeyword)}`, {
                headers: {
                    userId
                }
            });
            const data = await response.json();
            console.log("검색 API 응답:", data);

            if (data.code === 200) {
                setSearchResults(data.result || []);
                setSearched(true);
            } else {
                console.error('검색 실패:', data.message);
                setSearchResults([]);
                setSearched(true);
            }
        } catch (err) {
            console.error("검색 실패", err);
            setSearchResults([]);
            setSearched(true);
        } finally {
            setLoading(false);
        }
    };

    // Enter 키로 검색
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchSearch();
        }
    };

    // "추가하기" 클릭 시 현재 선택된 Day에 바로 추가
    const handleAddClick = (spot) => {
        console.log('🔍 검색에서 추가하기 클릭:', spot);
        console.log('🔍 현재 선택된 Day:', selectedDay);

        if (onAddLocation) {
            // 데이터 형식을 맞춰서 전달
            const formattedSpot = {
                contentId: spot.contentId || spot.id,
                title: spot.title,
                addr: spot.addr1,
                firstImage: spot.firstImage || spot.firstimage,
                mapx: spot.mapx,
                mapy: spot.mapy,
                regionName: spot.regionName,
                wardName: spot.wardName,
                dataId: spot.id,
                day: selectedDay,
                order: null
            };

            // 부모 컴포넌트에 형식화된 데이터 전달 (Day는 이미 부모에서 처리)
            onAddLocation(formattedSpot);

            // 검색 모달 닫기
            setTimeout(() => {
                onClose();
            }, 300);
        }
    };

    // 이미 추가된 장소인지 확인
    const isAlreadyAdded = (spot) => {
        const spotId = spot.contentId || spot.contentid || spot.id;

        return excludeIdentifiers.some(excluded =>
            excluded.contentId === spotId ||
            (excluded.title === spot.title &&
                Math.abs(excluded.mapx - spot.mapx) < 0.0001 &&
                Math.abs(excluded.mapy - spot.mapy) < 0.0001)
        );
    };

    return (
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
                        장소 검색
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Day {selectedDay}에 추가할 장소를 검색하세요  {/* 👈 현재 Day 표시 */}
                    </Typography>
                </div>
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent style={{ padding: '0 24px 24px' }}>
                {/* 검색 입력 */}
                <Box style={{ marginBottom: '20px' }}>
                    <TextField
                        fullWidth
                        placeholder="장소명을 입력하세요 (예: 경복궁, 명동, 제주도)"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search color="action" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Button
                                        onClick={fetchSearch}
                                        disabled={loading || !searchKeyword.trim()}
                                        variant="contained"
                                        size="small"
                                        style={{ borderRadius: '8px' }}
                                    >
                                        {loading ? <CircularProgress size={16} /> : '검색'}
                                    </Button>
                                </InputAdornment>
                            ),
                            style: { borderRadius: '12px' }
                        }}
                    />
                </Box>

                {/* 검색 결과 */}
                <Box style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {loading && (
                        <Box style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '40px 0'
                        }}>
                            <CircularProgress />
                            <Typography style={{ marginLeft: '12px' }}>
                                검색 중...
                            </Typography>
                        </Box>
                    )}

                    {!loading && !searched && (
                        <Box style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: '#717171'
                        }}>
                            <Search style={{ fontSize: '48px', color: '#ddd', marginBottom: '16px' }} />
                            <Typography>
                                장소명을 입력하고 검색해보세요
                            </Typography>
                        </Box>
                    )}

                    {!loading && searched && searchResults.length === 0 && (
                        <Box style={{
                            textAlign: 'center',
                            padding: '40px 20px',
                            color: '#717171'
                        }}>
                            <Typography>
                                '{searchKeyword}'에 대한 검색 결과가 없습니다
                            </Typography>
                            <Typography variant="body2" style={{ marginTop: '8px' }}>
                                다른 키워드로 검색해보세요
                            </Typography>
                        </Box>
                    )}

                    {!loading && searchResults.length > 0 && (
                        <List style={{ padding: 0 }}>
                            {searchResults.map((spot, index) => {
                                const isAdded = isAlreadyAdded(spot);

                                return (
                                    <ListItem
                                        key={spot.contentId || spot.contentid || spot.id || index}
                                        style={{
                                            padding: '16px',
                                            borderBottom: index < searchResults.length - 1 ? '1px solid #f0f0f0' : 'none',
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
                                            {spot.firstImage || spot.firstimage ? (
                                                <img
                                                    src={spot.firstImage || spot.firstimage}
                                                    alt={spot.title}
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
                                                display: (spot.firstImage || spot.firstimage) ? 'none' : 'flex',
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
                                                    {spot.title}
                                                </Typography>
                                            }
                                            secondary={
                                                <div>
                                                    <Typography
                                                        variant="body2"
                                                        color="textSecondary"
                                                        style={{ marginBottom: '8px' }}
                                                    >
                                                        {spot.addr1 || spot.address || '주소 정보 없음'}
                                                    </Typography>
                                                    {isAdded && (
                                                        <Chip
                                                            label="이미 추가됨"
                                                            size="small"
                                                            color="default"
                                                            style={{ fontSize: '12px' }}
                                                        />
                                                    )}
                                                </div>
                                            }
                                        />

                                        {/* 추가 버튼 */}
                                        <ListItemSecondaryAction>
                                            <IconButton
                                                onClick={() => handleAddClick(spot)}
                                                disabled={isAdded}
                                                color="primary"
                                                style={{
                                                    backgroundColor: isAdded ? '#f5f5f5' : '#e3f2fd',
                                                    borderRadius: '8px'
                                                }}
                                            >
                                                <Add />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                );
                            })}
                        </List>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default SpotSearchModal;