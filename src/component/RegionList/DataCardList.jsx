import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const DataCardList = ({ selectedRegion, selectedWard, selectedTheme, shouldLoadData, onNavigateToDetail, initialDataListState, onStateChange }) => { 
    const [dataList, setDataList] = useState(initialDataListState?.dataList || []);
    const [totalCount, setTotalCount] = useState(initialDataListState?.totalCount || 0);
    const [message, setMessage] = useState(initialDataListState?.message || '');
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    
    // 페이징 상태
    const [currentPage, setCurrentPage] = useState(initialDataListState?.currentPage || 0);
    const [totalPages, setTotalPages] = useState(initialDataListState?.totalPages || 0);
    const [hasNext, setHasNext] = useState(initialDataListState?.hasNext || false);
    const [hasPrevious, setHasPrevious] = useState(initialDataListState?.hasPrevious || false);
    
    const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [bookmarkLoading, setBookmarkLoading] = useState(new Set());
    const [selectedSort, setSelectedSort] = useState(initialDataListState?.selectedSort || 'SCORE');
    
    // ✅ 스크롤 위치 저장을 위한 ref
    const containerRef = useRef(null);
    
    const navigate = useNavigate();
    
    const PAGE_SIZE = 12;
    const API_BASE_URL = '/api/region-list';
    const LIKE_API_BASE_URL = '/api/like';

    // 컴포넌트 마운트 시 사용자의 찜 목록 로드
    useEffect(() => {
        loadUserLikes();
    }, []);

    // ✅ 상태가 변경될 때마다 부모에게 알려주기 + 스크롤 위치 저장
    useEffect(() => {
        if (onStateChange) {
            const currentState = {
                dataList,
                totalCount,
                currentPage,
                totalPages,
                hasNext,
                hasPrevious,
                selectedSort,
                message,
                scrollPosition: containerRef.current?.scrollTop || 0,
                searchConditions: {
                    selectedRegion,
                    selectedWard,
                    selectedTheme,
                    selectedSort
                }
            };
            onStateChange(currentState);
        }
    }, [dataList, totalCount, currentPage, totalPages, hasNext, hasPrevious, selectedSort, message, selectedRegion, selectedWard, selectedTheme]);

    // ✅ 스크롤 위치 복원 함수
    const restoreScrollPosition = (scrollPosition) => {
        if (containerRef.current && scrollPosition > 0) {
            setTimeout(() => {
                containerRef.current.scrollTop = scrollPosition;
                console.log('📜 스크롤 위치 복원:', scrollPosition);
            }, 100);
        }
    };

    // ✅ 메인 로직: 복원할 데이터가 있으면 복원, 없으면 새로 조회
    useEffect(() => {
        if (shouldLoadData && selectedRegion && selectedTheme) {
            const hasRestoredData = initialDataListState?.dataList?.length > 0;
            
            console.log('🔍 DataCardList 조회 판단:', {
                shouldLoadData,
                hasRestoredData,
                dataLength: initialDataListState?.dataList?.length || 0,
                selectedRegion,
                selectedTheme
            });
            
            if (hasRestoredData) {
                console.log('🔄 기존 데이터 복원 경로 (뒤로가기)');
                
                // 찜 상태만 다시 확인
                if (initialDataListState.dataList.length > 0) {
                    const dataIds = initialDataListState.dataList.map(item => item.id).filter(id => id);
                    if (dataIds.length > 0) {
                        checkLikeStatus(dataIds);
                    }
                }
                
                // ✅ 스크롤 위치 복원
                if (initialDataListState.scrollPosition) {
                    restoreScrollPosition(initialDataListState.scrollPosition);
                }
            } else {
                console.log('🔄 새로운 API 조회 경로 (조회 버튼 클릭)');
                // ✅ 기존 상태 완전 초기화 후 새로 조회
                setDataList([]);
                setTotalCount(0);
                setCurrentPage(0);
                setTotalPages(0);
                setHasNext(false);
                setHasPrevious(false);
                setMessage('');
                setError(null);
                
                resetAndLoadFirstPage();
            }
        }
    }, [shouldLoadData]);

    // ✅ 정렬 변경 시 새로 조회
    useEffect(() => {
        if (shouldLoadData && selectedRegion && selectedTheme && dataList.length > 0) {
            console.log('📊 정렬 변경으로 인한 첫 페이지 재로드:', selectedSort);
            resetAndLoadFirstPage();
        }
    }, [selectedSort]);

    // 정렬 변경 핸들러
    const handleSortChange = (sortType) => {
        console.log('📊 정렬 변경:', sortType);
        setSelectedSort(sortType);
    };

    // 토스트 자동 닫기
    useEffect(() => {
        if (snackbar.open) {
            const timer = setTimeout(() => {
                handleSnackbarClose();
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [snackbar.open]);

    // 사용자의 찜 목록 불러오기
    const loadUserLikes = async () => {
        try {
            const response = await fetch(`${LIKE_API_BASE_URL}/my-likes`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const result = await response.json();
                if (result.code === 200 && result.likedDataIds) {
                    setBookmarkedItems(new Set(result.likedDataIds));
                    console.log('✅ 사용자 찜 목록 로드 성공:', result.likedDataIds);
                }
            }
        } catch (error) {
            console.error('❌ 찜 목록 로드 실패:', error);
        }
    };

    // 여러 데이터의 찜 상태 확인
    const checkLikeStatus = async (dataIds) => {
        try {
            const response = await fetch(`${LIKE_API_BASE_URL}/check-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ dataIds }),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.code === 200 && result.likeStatusMap) {
                    const likedIds = Object.entries(result.likeStatusMap)
                        .filter(([id, isLiked]) => isLiked)
                        .map(([id]) => parseInt(id));
                    
                    setBookmarkedItems(new Set(likedIds));
                    console.log('✅ 찜 상태 확인 성공:', result.likeStatusMap);
                }
            }
        } catch (error) {
            console.error('❌ 찜 상태 확인 실패:', error);
        }
    };

    // 첫 페이지 로드 (기존 데이터 초기화)
    const resetAndLoadFirstPage = () => {
        console.log('🧹 모든 상태 초기화 후 첫 페이지 로드');
        
        // ✅ 모든 상태를 명시적으로 초기화
        setDataList([]);
        setTotalCount(0);
        setCurrentPage(0);
        setTotalPages(0);
        setHasNext(false);
        setHasPrevious(false);
        setMessage('');
        setError(null);
        setLoading(false);
        setLoadingMore(false);
        
        // 잠시 후 첫 페이지 로드 (상태 초기화가 확실히 적용되도록)
        setTimeout(() => {
            loadData(0, true); // 첫 페이지 로드, 기존 데이터 대체
        }, 50);
    };

    // 다음 페이지 로드 ("더보기" 버튼)
    const loadMoreData = () => {
        if (loadingMore || !hasNext) return;

        console.log('🔄 더보기 버튼 클릭 - 다음 페이지:', currentPage + 1);
        loadData(currentPage + 1, false); // 다음 페이지 로드, 기존 데이터에 추가
    };

    // ✅ 데이터 로드 함수
    const loadData = async (page = 0, replaceData = true) => {
        try {
            if (replaceData) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            setError(null);

            const params = new URLSearchParams();
            params.append('region', selectedRegion || '전국');
            params.append('theme', selectedTheme || '관광지');
            params.append('sort', selectedSort || 'SCORE');
            params.append('page', page.toString());
            params.append('size', PAGE_SIZE.toString());

            if (selectedWard && Array.isArray(selectedWard) && selectedWard.length > 0) {
                selectedWard.forEach(ward => {
                    if (ward && ward !== '전체') {
                        params.append('ward', ward);
                    }
                });
            }

            console.log('🔍 API 요청:', `${API_BASE_URL}/filter?${params.toString()}`);

            const response = await fetch(`${API_BASE_URL}/filter?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('📊 API 응답 데이터:', data);

            if (data.success !== false) {
                const newDataList = data.dataList || [];
                
                setCurrentPage(data.currentPage || 0);
                setTotalPages(data.totalPages || 0);
                setHasNext(data.hasNext || false);
                setHasPrevious(data.hasPrevious || false);
                setTotalCount(data.totalCount || 0);
                setMessage(data.message || '데이터를 불러왔습니다.');

                // 데이터 업데이트 (첫 페이지면 대체, 추가 페이지면 추가)
                if (replaceData) {
                    console.log('🔄 기존 데이터 완전 대체:', newDataList.length + '개');
                    setDataList([...newDataList]); // ✅ 새 배열로 완전 대체
                } else {
                    console.log('➕ 기존 데이터에 추가:', newDataList.length + '개');
                    setDataList(prevList => [...prevList, ...newDataList]);
                }

                if (newDataList.length > 0) {
                    const dataIds = newDataList.map(item => item.id).filter(id => id);
                    if (dataIds.length > 0) {
                        await checkLikeStatus(dataIds);
                    }
                }

                console.log('✅ 페이징 로드 완료 - 페이지: {}/{}, 현재 표시: {}개, 전체: {}개', 
                           data.currentPage + 1, data.totalPages, 
                           replaceData ? newDataList.length : dataList.length + newDataList.length, 
                           data.totalCount);

            } else {
                throw new Error(data.message || '데이터 조회에 실패했습니다.');
            }
        } catch (error) {
            console.error('❌ 데이터 로드 실패:', error.message);
            setError(error.message);
            
            if (replaceData) {
                setDataList([]);
                setCurrentPage(0);
                setTotalPages(0);
                setHasNext(false);
                setHasPrevious(false);
                setTotalCount(0);
            }
            setMessage('데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            if (replaceData) {
                setLoading(false);
            } else {
                setLoadingMore(false);
            }
        }
    };

    // 카드 클릭 핸들러
    const handleCardClick = (item) => {
        console.log('🔍 카드 클릭됨:', {
            contentId: item.contentId,
            title: item.title,
            targetUrl: `/spot/${item.contentId}`
        });
        
        // ✅ 상세 페이지로 이동하기 전에 현재 스크롤 위치 저장
        if (onNavigateToDetail) {
            onNavigateToDetail();
        }
        
        console.log('🚀 navigate 호출 시작');
        navigate(`/spot/${item.contentId}`, {
            state: {
                contentId: item.contentId,
                contentTypeId: item.theme,
                selectedTheme: selectedTheme,
                spotData: item,
            }
        });
        console.log('✅ navigate 호출 완료');
    };

    // 찜 버튼 토글
    const toggleBookmark = async (item, e) => {
        e.stopPropagation();
        
        const itemId = item.id;
        const itemTitle = item.title || '항목';
        
        if (bookmarkLoading.has(itemId)) {
            return;
        }

        const isCurrentlyBookmarked = bookmarkedItems.has(itemId);
        setBookmarkLoading(prev => new Set([...prev, itemId]));
        
        try {
            const response = await fetch(`${LIKE_API_BASE_URL}/${itemId}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.code === 200) {
                const newIsBookmarked = result.likeStatus;
                
                setBookmarkedItems(prev => {
                    const newSet = new Set(prev);
                    if (newIsBookmarked) {
                        newSet.add(itemId);
                    } else {
                        newSet.delete(itemId);
                    }
                    return newSet;
                });
                
                setDataList(prevList => 
                    prevList.map(dataItem => 
                        dataItem.id === itemId
                            ? { 
                                ...dataItem, 
                                likeCount: newIsBookmarked 
                                    ? (dataItem.likeCount || 0) + 1 
                                    : Math.max((dataItem.likeCount || 0) - 1, 0)
                            }
                            : dataItem
                    )
                );
                
                setSnackbar({
                    open: true,
                    message: result.message || (newIsBookmarked ? 
                        `"${itemTitle}"이(가) 찜 목록에 추가되었습니다` : 
                        `"${itemTitle}"이(가) 찜 목록에서 제거되었습니다`),
                    severity: 'success'
                });
                
            } else if (result.code === 401) {
                setSnackbar({
                    open: true,
                    message: '로그인이 필요한 서비스입니다',
                    severity: 'info'
                });
            } else {
                throw new Error(result.error_message || '찜 처리 중 오류가 발생했습니다');
            }
            
        } catch (error) {
            console.error('❌ 찜 처리 실패:', error);
            setSnackbar({
                open: true,
                message: '찜 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
                severity: 'error'
            });
        } finally {
            setBookmarkLoading(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        }
    };

    // 유틸리티 함수들
    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const formatNumber = (num) => {
        if (!num) return '0';
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    };

    const getSortDisplayName = (sortType) => {
        switch (sortType) {
            case 'SCORE': return '종합점수';
            case 'VIEW_COUNT': return '조회수';
            case 'LIKE_COUNT': return '찜수';
            case 'RATING': return '평점';
            case 'REVIEW_COUNT': return '리뷰수';
            default: return '종합점수';
        }
    };

    // 이미지 관련 함수들
    const getImageUrl = (imageUrl) => {
        if (!imageUrl || imageUrl.trim() === '') {
            return createPlaceholderImage();
        }

        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }

        if (imageUrl.startsWith('/')) {
            return `http://localhost:8080${imageUrl}`;
        }

        return imageUrl;
    };

    const createPlaceholderImage = () => {
        const svg = `
            <svg width="320" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f8f9fa"/>
                <rect x="10" y="10" width="300" height="180" fill="#e9ecef" stroke="#dee2e6" stroke-width="2" rx="8"/>
                <circle cx="160" cy="80" r="20" fill="#6c757d"/>
                <rect x="100" y="110" width="120" height="8" fill="#6c757d" rx="4"/>
                <rect x="120" y="125" width="80" height="6" fill="#adb5bd" rx="3"/>
                <text x="160" y="155" text-anchor="middle" fill="#6c757d" font-family="Arial, sans-serif" font-size="12">대표 이미지 없음</text>
            </svg>
        `;
        return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
    };

    const handleImageError = (e) => {
        e.target.src = createPlaceholderImage();
    };

    // 스타일 정의
    const cardStyle = {
        width: '320px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        margin: '12px',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        border: '1px solid #f0f0f0'
    };

    const cardHoverStyle = {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
    };

    // shouldLoadData가 false인 경우 렌더링하지 않음
    if (!shouldLoadData) {
        return null;
    }

    if (loading) {
        return (
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                textAlign: 'center'
            }}>
                <div style={{
                    fontSize: '18px',
                    color: '#7f8c8d',
                    marginBottom: '15px'
                }}>
                    🔄 데이터를 불러오는 중...
                </div>
                <div style={{
                    fontSize: '14px',
                    color: '#bdc3c7'
                }}>
                    {selectedRegion} {selectedWard && Array.isArray(selectedWard) && selectedWard.length > 0 ? `> ${selectedWard.join(', ')}` : ''}  {selectedTheme} ({getSortDisplayName(selectedSort)} 순)
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                textAlign: 'center'
            }}>
                <div style={{
                    fontSize: '48px',
                    marginBottom: '20px'
                }}>
                    ⚠️
                </div>
                <div style={{
                    fontSize: '18px',
                    color: '#e74c3c',
                    fontWeight: '600',
                    marginBottom: '10px'
                }}>
                    데이터 로드 실패
                </div>
                <div style={{
                    fontSize: '14px',
                    color: '#7f8c8d',
                    marginBottom: '20px'
                }}>
                    {error}
                </div>
                <button
                    onClick={() => loadData(0, true)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                    }}
                >
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <div 
            ref={containerRef} // ✅ 스크롤 위치 추적을 위한 ref 추가
            style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                maxHeight: '80vh',
                overflowY: 'auto'
            }}
        >
            {/* 결과 헤더 + 정렬 셀렉터 */}
            <div style={{
                marginBottom: '25px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: '20px'
            }}>
                {/* 결과 정보 */}
                <div style={{
                    padding: '20px',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef',
                    textAlign: 'center',
                    maxWidth: '600px'
                }}>
                    <div style={{
                        fontSize: '18px',
                        color: '#34495e',
                        lineHeight: '1.5'
                    }}>
                        선택된 지역의 <span style={{ color: '#3498db', fontWeight: 'bold' }}>{selectedTheme}</span>{' '}
                        <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>{totalCount.toLocaleString()}개</span>를{' '}
                        <select
                            value={selectedSort}
                            onChange={(e) => handleSortChange(e.target.value)}
                            style={{
                                display: 'inline-block',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                border: '1px solid #ddd',
                                backgroundColor: 'white',
                                color: '#f39c12',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                outline: 'none',
                                margin: '0 4px'
                            }}
                        >
                            <option value="SCORE">종합점수 순</option>
                            <option value="VIEW_COUNT">조회수 순</option>
                            <option value="LIKE_COUNT">찜수 순</option>
                            <option value="RATING">평점 순</option>
                            <option value="REVIEW_COUNT">리뷰수 순</option>
                        </select>
                        으로 조회하였습니다.
                    </div>
                    {/* 페이징 정보 표시 */}
                    <div style={{
                        fontSize: '14px',
                        color: '#7f8c8d',
                        marginTop: '10px'
                    }}>
                        현재 {dataList.length}개 표시 중 (페이지 {currentPage + 1}/{totalPages})
                    </div>
                </div>
            </div>

            {/* 데이터 카드 목록 */}
            {dataList.length > 0 ? (
                <>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '20px',
                        justifyContent: 'center',
                    }}>
                        {dataList.map((item, index) => {
                            const itemId = item.id;
                            const isBookmarked = bookmarkedItems.has(itemId);
                            const isBookmarkLoading = bookmarkLoading.has(itemId);
                            
                            return (
                                <div
                                    key={`${item.id || index}-${itemId}`}
                                    style={cardStyle}
                                    onClick={() => handleCardClick(item)}
                                    onMouseEnter={(e) => {
                                        Object.assign(e.currentTarget.style, cardHoverStyle);
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                    }}
                                >
                                    {/* 이미지 섹션 */}
                                    <div style={{
                                        height: '200px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        backgroundColor: '#f8f9fa'
                                    }}>
                                        <img
                                            src={getImageUrl(item.firstImage || item.firstimage)}
                                            alt={item.title || '이미지'}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.3s ease'
                                            }}
                                            onError={handleImageError}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = 'scale(1.05)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = 'scale(1)';
                                            }}
                                        />

                                        {/* 테마 배지 */}
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            left: '12px',
                                            backgroundColor: 'rgba(52, 152, 219, 0.9)',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '600'
                                        }}>
                                            {selectedTheme}
                                        </div>

                                        {/* 찜 버튼 */}
                                        <button
                                            onClick={(e) => toggleBookmark(item, e)}
                                            disabled={isBookmarkLoading}
                                            style={{
                                                position: 'absolute',
                                                top: '12px',
                                                right: '12px',
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                border: 'none',
                                                backgroundColor: isBookmarkLoading ? 
                                                    'rgba(255, 255, 255, 0.7)' : 
                                                    'rgba(255, 255, 255, 0.9)',
                                                cursor: isBookmarkLoading ? 'not-allowed' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '16px',
                                                transition: 'all 0.2s ease',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                opacity: isBookmarkLoading ? 0.7 : 1
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isBookmarkLoading) {
                                                    e.target.style.transform = 'scale(1.1)';
                                                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isBookmarkLoading) {
                                                    e.target.style.transform = 'scale(1)';
                                                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                                                }
                                            }}
                                        >
                                            {isBookmarkLoading ? '⏳' : (isBookmarked ? '❤️' : '🤍')}
                                        </button>
                                    </div>

                                    {/* 카드 내용 */}
                                    <div style={{ padding: '20px' }}>
                                        {/* 제목 */}
                                        <h3 style={{
                                            margin: '0 0 12px 0',
                                            fontSize: '18px',
                                            fontWeight: '600',
                                            color: '#2c3e50',
                                            lineHeight: '1.4',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {item.title || '제목 없음'}
                                        </h3>

                                        {/* 위치 정보 */}
                                        <div style={{
                                            fontSize: '14px',
                                            color: '#7f8c8d',
                                            marginBottom: '15px',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <span>📍</span>
                                            {item.regionName || selectedRegion}
                                            {item.wardName && item.wardName !== selectedRegion && (
                                                <span> {item.wardName}</span>
                                            )}
                                        </div>

                                        {/* 실제 통계 정보 표시 */}
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '15px',
                                            padding: '10px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: '8px'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <span>⭐</span>
                                                <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                                    {item.rating ? item.rating.toFixed(1) : '0.0'}
                                                </span>
                                                <span style={{ fontSize: '12px', color: '#7f8c8d' }}>
                                                    ({formatNumber(item.reviewCount || 0)})
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <span>👁️</span>
                                                <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                                    {formatNumber(item.viewCount || 0)}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <span>❤️</span>
                                                <span style={{ fontSize: '14px', fontWeight: '600' }}>
                                                    {formatNumber(item.likeCount || 0)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* 자세히 보기 버튼 */}
                                        <button
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                backgroundColor: '#3498db',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '10px',
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#2980b9';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = '#3498db';
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCardClick(item);
                                            }}
                                        >
                                            자세히 보기 →
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* 더보기 버튼 (hasNext가 true일 때만 표시) */}
                    {hasNext && (
                        <div style={{
                            textAlign: 'center',
                            marginTop: '40px',
                            marginBottom: '20px'
                        }}>
                            <button
                                onClick={loadMoreData}
                                disabled={loadingMore}
                                style={{
                                    padding: '16px 32px',
                                    backgroundColor: loadingMore ? '#bdc3c7' : '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '25px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: loadingMore ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    margin: '0 auto',
                                    minWidth: '160px',
                                    justifyContent: 'center'
                                }}
                                onMouseEnter={(e) => {
                                    if (!loadingMore) {
                                        e.target.style.backgroundColor = '#2980b9';
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 6px 16px rgba(52, 152, 219, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!loadingMore) {
                                        e.target.style.backgroundColor = '#3498db';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.3)';
                                    }
                                }}
                            >
                                {loadingMore ? (
                                    <>
                                        <div style={{
                                            width: '16px',
                                            height: '16px',
                                            border: '2px solid transparent',
                                            borderTop: '2px solid white',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }}></div>
                                        로딩 중...
                                    </>
                                ) : (
                                    <>
                                        📄 더보기 (페이지 {currentPage + 2}/{totalPages})
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* 모든 데이터 로드 완료 메시지 */}
                    {!hasNext && dataList.length > 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '30px',
                            color: '#95a5a6',
                            fontSize: '14px',
                            borderTop: '1px solid #ecf0f1',
                            marginTop: '30px'
                        }}>
                            🎉 모든 데이터를 확인했습니다! (총 {totalCount.toLocaleString()}개 중 {dataList.length}개 표시)
                        </div>
                    )}

                    {/* 향상된 토스트 메시지 */}
                    {snackbar.open && (
                        <div style={{
                            position: 'fixed',
                            top: '80px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 9999,
                            backgroundColor: snackbar.severity === 'success' ? '#4caf50' : 
                                           snackbar.severity === 'error' ? '#f44336' : '#2196f3',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            fontSize: '14px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            animation: 'slideDown 0.3s ease-out',
                            maxWidth: '400px'
                        }}>
                            <span>
                                {snackbar.severity === 'success' ? '✅' : 
                                 snackbar.severity === 'error' ? '❌' : 'ℹ️'}
                            </span>
                            {snackbar.message}
                            <button
                                onClick={handleSnackbarClose}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    marginLeft: '8px',
                                    fontSize: '16px',
                                    padding: '0'
                                }}
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* CSS 애니메이션 */}
                    <style>
                        {`
                            @keyframes slideDown {
                                0% {
                                    opacity: 0;
                                    transform: translateX(-50%) translateY(-20px);
                                }
                                100% {
                                    opacity: 1;
                                    transform: translateX(-50%) translateY(0);
                                }
                            }
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}
                    </style>
                </>
            ) : (
                /* 빈 결과 표시 */
                <div style={{
                    textAlign: 'center',
                    padding: '80px 20px',
                    color: '#7f8c8d'
                }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
                    <div style={{ fontSize: '24px', fontWeight: '600', marginBottom: '12px', color: '#34495e' }}>
                        검색 결과가 없습니다
                    </div>
                    <div style={{ fontSize: '16px', color: '#95a5a6', marginBottom: '8px' }}>
                        다른 지역이나 테마를 선택해보세요
                    </div>
                    <div style={{ fontSize: '14px', color: '#bdc3c7' }}>
                        현재 조건: {selectedRegion}
                        {selectedWard && Array.isArray(selectedWard) && selectedWard.length > 0 ? ` > ${selectedWard.join(', ')}` : ''}
                        {` > ${selectedTheme} (${getSortDisplayName(selectedSort)} 순)`}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataCardList;