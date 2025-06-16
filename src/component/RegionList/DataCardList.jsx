import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const DataCardList = ({ selectedRegion, selectedWard, selectedTheme }) => {
    const [dataList, setDataList] = useState([]);
    const [displayedData, setDisplayedData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [bookmarkedItems, setBookmarkedItems] = useState(new Set());
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const navigate = useNavigate();
    const observerRef = useRef();
    const ITEMS_PER_PAGE = 12;

    const API_BASE_URL = '/api/region-list';

    useEffect(() => {
        if (selectedRegion && selectedTheme) {
            resetAndLoadData();
        }
    }, [selectedRegion, selectedWard, selectedTheme]);

    useEffect(() => {
        if (!hasMore || loadingMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreData();
                }
            },
            { threshold: 0.1 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [hasMore, loadingMore, displayedData]);

    // 토스트 자동 닫기
    useEffect(() => {
        if (snackbar.open) {
            const timer = setTimeout(() => {
                handleSnackbarClose();
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [snackbar.open]);

    const resetAndLoadData = () => {
        setDataList([]);
        setDisplayedData([]);
        setHasMore(true);
        loadData();
    };

    const loadMoreData = useCallback(() => {
        if (loadingMore || !hasMore) return;

        const currentLength = displayedData.length;
        const remainingData = dataList.slice(currentLength, currentLength + ITEMS_PER_PAGE);

        if (remainingData.length === 0) {
            setHasMore(false);
            return;
        }

        setLoadingMore(true);

        setTimeout(() => {
            setDisplayedData(prev => [...prev, ...remainingData]);
            setLoadingMore(false);

            if (currentLength + remainingData.length >= dataList.length) {
                setHasMore(false);
            }
        }, 500);
    }, [displayedData, dataList, loadingMore, hasMore]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            params.append('region', selectedRegion || '전국');
            params.append('theme', selectedTheme || '관광지');

            if (selectedWard && selectedWard !== '전체' && selectedWard !== '') {
                params.append('ward', selectedWard);
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
                console.log('📝 받은 데이터 샘플:', newDataList[0]); // 첫 번째 아이템 로그 확인
                
                setDataList(newDataList);
                setDisplayedData(newDataList.slice(0, ITEMS_PER_PAGE));
                setTotalCount(data.totalCount || 0);
                setMessage(data.message || '데이터를 불러왔습니다.');
                setHasMore(newDataList.length > ITEMS_PER_PAGE);
            } else {
                throw new Error(data.message || '데이터 조회에 실패했습니다.');
            }
        } catch (error) {
            console.error('❌ 데이터 로드 실패:', error.message);
            setError(error.message);
            setDataList([]);
            setDisplayedData([]);
            setTotalCount(0);
            setMessage('데이터를 불러오는 중 오류가 발생했습니다.');
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (item) => {
        navigate(`/spot/${item.contentId}`, {
            state: {
                contentId: item.contentId,
                contentTypeId: item.theme,
                selectedTheme: selectedTheme,
                spotData: item,
            }
        });
    };

    // 찜 버튼 토글
    const toggleBookmark = (item, e) => {
        e.stopPropagation();
        const itemId = item.contentId || item.id;
        const itemTitle = item.title || '항목';
        
        const isCurrentlyBookmarked = bookmarkedItems.has(itemId);
        
        setBookmarkedItems(prev => {
            const newSet = new Set(prev);
            if (isCurrentlyBookmarked) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
        
        // 토스트 메시지 표시
        if (isCurrentlyBookmarked) {
            setSnackbar({
                open: true,
                message: `"${itemTitle}"이(가) 찜 목록에서 제거되었습니다`,
                severity: 'info'
            });
        } else {
            setSnackbar({
                open: true,
                message: `"${itemTitle}"이(가) 찜 목록에 추가되었습니다`,
                severity: 'success'
            });
        }
    };

    // 스낵바 닫기
    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    // 숫자 포맷팅
    const formatNumber = (num) => {
        if (!num) return '0';
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    };

    // 받은 데이터 확인용 (개발 중에만 사용)
    const logItemData = (item) => {
        console.log('📊 아이템 데이터:', {
            contentId: item.contentId,
            title: item.title,
            viewCount: item.viewCount,
            likeCount: item.likeCount,
            rating: item.rating,
            reviewCount: item.reviewCount
        });
    };

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
                    {selectedRegion} {selectedWard && selectedWard !== '전체' ? `> ${selectedWard}` : ''}  {selectedTheme}
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
                    onClick={loadData}
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
        <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* 결과 헤더 */}
            <div style={{
                marginBottom: '25px',
                textAlign: 'center',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                border: '1px solid #e9ecef'
            }}>
                <div style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '8px'
                }}>
                    📊 검색 결과
                </div>
                <div style={{
                    fontSize: '16px',
                    color: '#34495e'
                }}>
                    선택된 지역의 <strong style={{ color: '#3498db' }}>{selectedTheme}</strong> <strong style={{ color: '#e74c3c' }}>{totalCount.toLocaleString()}개</strong>를 조회하였습니다.
                </div>
            </div>

            {/* 데이터 카드 목록 */}
            {displayedData.length > 0 ? (
                <>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '20px',
                        justifyContent: 'center',
                    }}>
                        {displayedData.map((item, index) => {
                            const itemId = item.contentId || item.id;
                            const isBookmarked = bookmarkedItems.has(itemId);
                            
                            // 개발 중 데이터 확인 (첫 번째 아이템만)
                            if (index === 0) {
                                logItemData(item);
                            }
                            
                            return (
                                <div
                                    key={item.id || index}
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
                                            style={{
                                                position: 'absolute',
                                                top: '12px',
                                                right: '12px',
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                border: 'none',
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '16px',
                                                transition: 'all 0.2s ease',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = 'scale(1.1)';
                                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = 'scale(1)';
                                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                                            }}
                                        >
                                            {isBookmarked ? '❤️' : '🤍'}
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

                    {/* 무한 스크롤 트리거 */}
                    {hasMore && (
                        <div
                            ref={observerRef}
                            style={{
                                height: '50px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: '30px'
                            }}
                        >
                            {loadingMore ? (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    color: '#7f8c8d',
                                    fontSize: '14px'
                                }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        border: '2px solid #e9ecef',
                                        borderTop: '2px solid #3498db',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }}></div>
                                    더 많은 데이터를 불러오는 중...
                                </div>
                            ) : (
                                <div style={{
                                    color: '#bdc3c7',
                                    fontSize: '12px'
                                }}>
                                    스크롤하여 더 보기
                                </div>
                            )}
                        </div>
                    )}

                    {/* 모든 데이터 로드 완료 메시지 */}
                    {!hasMore && displayedData.length > 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '30px',
                            color: '#95a5a6',
                            fontSize: '14px',
                            borderTop: '1px solid #ecf0f1',
                            marginTop: '30px'
                        }}>
                            🎉 모든 데이터를 확인했습니다! ({displayedData.length}개)
                        </div>
                    )}

                    {/* 커스텀 토스트 */}
                    {snackbar.open && (
                        <div style={{
                            position: 'fixed',
                            top: '80px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 9999,
                            backgroundColor: snackbar.severity === 'success' ? '#4caf50' : '#2196f3',
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
                            <span>{snackbar.severity === 'success' ? '✅' : 'ℹ️'}</span>
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
                        {selectedWard && selectedWard !== '전체' ? ` > ${selectedWard}` : ''}
                        {` > ${selectedTheme}`}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataCardList;