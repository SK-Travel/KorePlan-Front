import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const FestivalCardList = ({ selectedRegion, selectedCategory, selectedStatus, selectedMonth, searchKeyword }) => {
    const [dataList, setDataList] = useState([]);
    const [displayedData, setDisplayedData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();
    const observerRef = useRef();
    const ITEMS_PER_PAGE = 12;

    const API_BASE_URL = 'http://localhost:8080/api/festival';

    // 초기 로드: 전체 축제 조회
    useEffect(() => {
        loadData();
    }, [selectedRegion, selectedCategory, selectedStatus, selectedMonth, searchKeyword]);

    // 무한 스크롤 설정
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

    // 통합된 API 엔드포인트 결정 함수
    const getApiEndpoint = () => {
        // 검색 키워드가 있으면 키워드 검색 API 사용
        if (searchKeyword && searchKeyword.trim() !== '') {
            return `/keyword?q=${encodeURIComponent(searchKeyword.trim())}`;
        }

        // 통합 검색 API 사용
        const params = new URLSearchParams();
        
        // 지역 조건 (빈 문자열이나 null도 처리)
        if (selectedRegion && selectedRegion !== '전국' && selectedRegion.trim() !== '') {
            params.append('region', selectedRegion.trim());
        }
        
        // 카테고리 조건 (빈 문자열이나 null도 처리)
        if (selectedCategory && selectedCategory !== '전체' && selectedCategory.trim() !== '') {
            params.append('category', selectedCategory.trim());
        }
        
        // 상태 조건 처리
        if (selectedStatus && selectedStatus !== '전체' && selectedStatus.trim() !== '') {
            params.append('status', selectedStatus.trim());
        }
        
        // 월 조건 (상태가 설정되지 않았을 때만 또는 상태가 '전체'일 때)
        if (selectedMonth && selectedMonth.trim() !== '' && 
            (!selectedStatus || selectedStatus === '전체' || selectedStatus.trim() === '')) {
            const monthNum = parseInt(selectedMonth.replace('월', '').trim());
            if (!isNaN(monthNum) && monthNum >= 1 && monthNum <= 12) {
                params.append('month', monthNum);
            }
        }

        const queryString = params.toString();
        const endpoint = `/search${queryString ? `?${queryString}` : ''}`;
        
        console.log('🔍 필터링 상태:', {
            selectedRegion,
            selectedCategory, 
            selectedStatus,
            selectedMonth,
            params: Object.fromEntries(params.entries()),
            endpoint
        });

        return endpoint;
    };

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const endpoint = getApiEndpoint();
            console.log('🔗 API 호출:', `${API_BASE_URL}${endpoint}`);

            const response = await fetch(`${API_BASE_URL}${endpoint}`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('📋 받은 데이터:', data);

            // 백엔드에서 배열을 직접 반환하는 경우
            const festivalList = Array.isArray(data) ? data : [];

            setDataList(festivalList);
            setDisplayedData(festivalList.slice(0, ITEMS_PER_PAGE));
            setTotalCount(festivalList.length);
            setMessage('축제 데이터를 불러왔습니다.');
            setHasMore(festivalList.length > ITEMS_PER_PAGE);

        } catch (error) {
            console.error('❌ 축제 데이터 로드 실패:', error.message);
            setError(error.message);
            setDataList([]);
            setDisplayedData([]);
            setTotalCount(0);
            setMessage('축제 데이터를 불러오는 중 오류가 발생했습니다.');
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = (festival) => {
        navigate(`/festival/${festival.contentId}`, {
            state: {
                contentId: festival.contentId,
                contentTypeId: festival.contentTypeId,
                festivalData: festival,
            }
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
                <text x="160" y="155" text-anchor="middle" fill="#6c757d" font-family="Arial, sans-serif" font-size="12">축제 이미지 없음</text>
            </svg>
        `;
        return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
    };

    const handleImageError = (e) => {
        e.target.src = createPlaceholderImage();
    };

    // 상태에 따른 배지 스타일
    const getStatusBadgeStyle = (status) => {
        const baseStyle = {
            position: 'absolute',
            top: '12px',
            right: '12px',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            color: 'white'
        };

        switch (status) {
            case '진행중':
                return { ...baseStyle, backgroundColor: 'rgba(46, 204, 113, 0.9)' };
            case '진행예정':
                return { ...baseStyle, backgroundColor: 'rgba(52, 152, 219, 0.9)' };
            case '종료됨':
                return { ...baseStyle, backgroundColor: 'rgba(149, 165, 166, 0.9)' };
            default:
                return { ...baseStyle, backgroundColor: 'rgba(52, 152, 219, 0.9)' };
        }
    };

    // 날짜 포맷팅 (년도 포함)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
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
                    🎪 축제 정보를 불러오는 중...
                </div>
                <div style={{
                    fontSize: '14px',
                    color: '#bdc3c7'
                }}>
                    {selectedRegion && selectedRegion !== '전국' ? selectedRegion : '전국'} 
                    {selectedCategory && selectedCategory !== '전체' ? ` > ${selectedCategory}` : ''}
                    {selectedStatus && selectedStatus !== '전체' ? ` > ${selectedStatus}` : ''}
                    {selectedMonth ? ` > ${selectedMonth}` : ''}
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
                    축제 데이터 로드 실패
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
                    🎪 축제 목록
                </div>
                <div style={{
                    fontSize: '16px',
                    color: '#34495e'
                }}>
                    {searchKeyword ? (
                        <>
                            "<strong>{searchKeyword}</strong>" 검색 결과: <strong style={{ color: '#e74c3c' }}>{totalCount.toLocaleString()}개</strong>
                        </>
                    ) : (
                        <>
                            {selectedRegion && selectedRegion !== '전국' ? selectedRegion : '전국'}의 
                            {selectedCategory && selectedCategory !== '전체' ? ` ${selectedCategory}` : ' 축제'}
                            {selectedStatus && selectedStatus !== '전체' ? ` (${selectedStatus})` : ''}
                            {selectedMonth ? ` (${selectedMonth})` : ''}
                            {' '}
                            <strong style={{ color: '#e74c3c' }}>{totalCount.toLocaleString()}개</strong>를 조회하였습니다.
                        </>
                    )}
                </div>
            </div>

            {/* 축제 카드 목록 */}
            {displayedData.length > 0 ? (
                <>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '20px',
                        justifyContent: 'center',
                    }}>
                        {displayedData.map((festival, index) => (
                            <div
                                key={festival.contentId || index}
                                style={cardStyle}
                                onClick={() => handleCardClick(festival)}
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
                                        src={getImageUrl(festival.firstimage)}
                                        alt={festival.title || '축제 이미지'}
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

                                    {/* 카테고리 배지 */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        backgroundColor: 'rgba(230, 126, 34, 0.9)',
                                        color: 'white',
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}>
                                        {festival.c2Name || '축제'}
                                    </div>

                                    {/* 상태 배지 */}
                                    <div style={getStatusBadgeStyle(festival.status)}>
                                        {festival.status || '정보없음'}
                                    </div>
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
                                        {festival.title || '축제명 없음'}
                                    </h3>

                                    {/* 날짜 정보 */}
                                    <div style={{
                                        fontSize: '14px',
                                        color: '#e74c3c',
                                        marginBottom: '8px',
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <span>📅</span>
                                        {formatDate(festival.eventStartDate)} ~ {formatDate(festival.eventEndDate)}
                                    </div>

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
                                        {festival.regionName || '지역정보없음'}
                                        {festival.wardName && festival.wardName !== festival.regionName && (
                                            <span> {festival.wardName}</span>
                                        )}
                                    </div>

                                    {/* 조회수 정보 */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom: '15px',
                                        padding: '12px',
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px'
                                    }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '6px',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            color: '#555'
                                        }}>
                                            <span style={{ fontSize: '16px' }}>👀</span>
                                            <span>조회수</span>
                                            <span style={{ 
                                                color: '#e67e22',
                                                fontSize: '16px'
                                            }}>
                                                {festival.viewCount?.toLocaleString() || '0'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 자세히 보기 버튼 */}
                                    <button
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            backgroundColor: '#e67e22',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '10px',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#d35400';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = '#e67e22';
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCardClick(festival);
                                        }}
                                    >
                                        축제 정보 보기 →
                                    </button>
                                </div>
                            </div>
                        ))}
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
                                        borderTop: '2px solid #e67e22',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }}></div>
                                    더 많은 축제를 불러오는 중...
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
                            🎉 모든 축제를 확인했습니다! ({displayedData.length}개)
                        </div>
                    )}

                    {/* 로딩 애니메이션 CSS */}
                    <style>
                        {`
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
                    <div style={{
                        fontSize: '64px',
                        marginBottom: '20px'
                    }}>
                        🎪
                    </div>
                    <div style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        marginBottom: '12px',
                        color: '#34495e'
                    }}>
                        {searchKeyword ? '검색 결과가 없습니다' : '해당 조건의 축제가 없습니다'}
                    </div>
                    <div style={{
                        fontSize: '16px',
                        color: '#95a5a6',
                        marginBottom: '8px'
                    }}>
                        {searchKeyword ? '다른 키워드로 검색해보세요' : '다른 지역이나 카테고리를 선택해보세요'}
                    </div>
                    <div style={{
                        fontSize: '14px',
                        color: '#bdc3c7'
                    }}>
                        {searchKeyword ? (
                            `검색어: "${searchKeyword}"`
                        ) : (
                            <>
                                현재 조건: {selectedRegion && selectedRegion !== '전국' ? selectedRegion : '전국'}
                                {selectedCategory && selectedCategory !== '전체' ? ` > ${selectedCategory}` : ''}
                                {selectedStatus && selectedStatus !== '전체' ? ` > ${selectedStatus}` : ''}
                                {selectedMonth ? ` > ${selectedMonth}` : ''}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FestivalCardList;