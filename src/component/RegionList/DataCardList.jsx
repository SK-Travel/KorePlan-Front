import React, { useState, useEffect, useCallback, useRef } from 'react';

const DataCardList = ({ selectedRegion, selectedWard, selectedTheme }) => {
    const [dataList, setDataList] = useState([]);
    const [displayedData, setDisplayedData] = useState([]); // 현재 화면에 표시된 데이터
    const [totalCount, setTotalCount] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false); // 추가 로딩 상태
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지
    
    const observerRef = useRef(); // 무한 스크롤용 Observer
    const ITEMS_PER_PAGE = 12; // 한 번에 보여줄 아이템 개수 

    // API 기본 URL
    const API_BASE_URL = 'http://localhost:8080/api/region-list';

    // 선택된 조건이 변경될 때마다 데이터 초기화 및 로드
    useEffect(() => {
        if (selectedRegion && selectedTheme) {
            resetAndLoadData();
        }
    }, [selectedRegion, selectedWard, selectedTheme]);

    // 무한 스크롤을 위한 Observer 설정
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

    // 데이터 초기화 및 첫 페이지 로드
    const resetAndLoadData = () => {
        setDataList([]);
        setDisplayedData([]);
        setHasMore(true);
        loadData();
    };

    // 더 많은 데이터 로드 (무한 스크롤)
    const loadMoreData = useCallback(() => {
        if (loadingMore || !hasMore) return;
        
        const currentLength = displayedData.length;
        const remainingData = dataList.slice(currentLength, currentLength + ITEMS_PER_PAGE);
        
        if (remainingData.length === 0) {
            setHasMore(false);
            return;
        }

        setLoadingMore(true);
        
        // 실제 환경에서는 네트워크 지연을 시뮬레이션 (12개씩 로드)
        setTimeout(() => {
            setDisplayedData(prev => [...prev, ...remainingData]);
            setLoadingMore(false);
            
            // 더 이상 보여줄 데이터가 없으면 hasMore를 false로
            if (currentLength + remainingData.length >= dataList.length) {
                setHasMore(false);
            }
        }, 500);
    }, [displayedData, dataList, loadingMore, hasMore]);

    // 초기 데이터 로드
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

            console.log('🔍 데이터 요청:', {
                region: selectedRegion,
                ward: selectedWard,
                theme: selectedTheme
            });

            const response = await fetch(`${API_BASE_URL}/filter?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.success !== false) {
                const newDataList = data.dataList || [];
                setDataList(newDataList);
                setDisplayedData(newDataList.slice(0, ITEMS_PER_PAGE)); // 첫 12개만 표시
                setTotalCount(data.totalCount || 0);
                setMessage(data.message || '데이터를 불러왔습니다.');
                setHasMore(newDataList.length > ITEMS_PER_PAGE); // 12개보다 많으면 더 있음
                                console.log('✅ 데이터 로드 성공:', {
                    total: data.totalCount,
                    loaded: newDataList.length,
                    displaying: Math.min(newDataList.length, ITEMS_PER_PAGE),
                    message: data.message
                });
                
                // 샘플 데이터 로그 (상세보기 연결 확인용)
                if (newDataList.length > 0) {
                    console.log('🔍 첫 번째 아이템 ID 확인:', {
                        contentId: newDataList[0].contentId,
                        id: newDataList[0].id,
                        title: newDataList[0].title
                    });
                }
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

    // 카드 클릭 핸들러 (상세보기 페이지로 이동)
    const handleCardClick = (item) => {
        console.log('📄 카드 클릭:', item.title);
        // 상세보기 페이지로 이동
        // 방법 1: React Router 사용
        navigate(`/detail/${item.contentId || item.id}`);
    };

    // 이미지 URL 처리 함수
    const getImageUrl = (imageUrl) => {
        // 이미지 URL이 없는 경우
        if (!imageUrl || imageUrl.trim() === '') {
            return createPlaceholderImage();
        }
        
        // 이미 완전한 URL인 경우
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }
        
        // 상대경로인 경우 절대경로로 변환
        if (imageUrl.startsWith('/')) {
            return `http://localhost:8080${imageUrl}`;
        }
        
        // 그 외의 경우 그대로 반환
        return imageUrl;
    };

    // 로컬 placeholder 이미지 생성 함수
    const createPlaceholderImage = () => {
        // SVG 기반 placeholder 생성 (외부 서비스 의존성 없음)
        const svg = `
            <svg width="320" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f8f9fa"/>
                <rect x="10" y="10" width="300" height="180" fill="#e9ecef" stroke="#dee2e6" stroke-width="2" rx="8"/>
                <circle cx="160" cy="80" r="20" fill="#6c757d"/>
                <rect x="100" y="110" width="120" height="8" fill="#6c757d" rx="4"/>
                <rect x="120" y="125" width="80" height="6" fill="#adb5bd" rx="3"/>
                <text x="160" y="155" text-anchor="middle" fill="#6c757d" font-family="Arial, sans-serif" font-size="12">이미지 없음</text>
            </svg>
        `;
        return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
    };

    // 이미지 에러 핸들러
    const handleImageError = (e) => {
        console.log('❌ 이미지 로드 실패:', e.target.src);
        // 외부 서비스 대신 로컬 SVG 사용
        e.target.src = createPlaceholderImage();
    };

    // 카드 스타일
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

    // 로딩 중 표시
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

    // 에러 표시
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
                    color: '#34495e',
                    marginBottom: '5px'
                }}>
                    {message}
                </div>
                <div style={{
                    fontSize: '14px',
                    color: '#7f8c8d'
                }}>
                    총 <strong style={{ color: '#e74c3c' }}>{totalCount.toLocaleString()}</strong>개의 결과
                    {displayedData.length < totalCount && (
                        <span style={{ marginLeft: '8px', color: '#27ae60' }}>
                            (현재 {displayedData.length}개 표시)
                        </span>
                    )}
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
                        {displayedData.map((item, index) => (
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
                                    src={getImageUrl(item.firstImage || item.firstimage || item.image || item.imageUrl)}
                                    alt={item.title || '이미지'}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease'
                                    }}
                                    onError={(e) => {
                                        console.log('❌ 이미지 로드 실패:', e.target.src);
                                        handleImageError(e);
                                    }}
                                    onLoad={(e) => {
                                        console.log('✅ 이미지 로드 성공:', e.target.src);
                                    }}
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

                                {/* TODO: 나중에 리뷰/찜 개수 추가 예정  현재 하드코딩으로 ui 구성*/}
                                
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
                                        <span style={{ fontSize: '14px', fontWeight: '600' }}>4.5</span>
                                        <span style={{ fontSize: '12px', color: '#7f8c8d' }}>(128)</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span>❤️</span>
                                        <span style={{ fontSize: '14px', fontWeight: '600' }}>234</span>
                                    </div>
                                </div>
                               

                                {/* 추가 정보 제거됨 - 전화번호, ID 정보 불필요 */}

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
                                        e.stopPropagation(); // 카드 클릭 이벤트 방지
                                        handleCardClick(item);
                                    }}
                                >
                                    자세히 보기 →
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
                        🔍
                    </div>
                    <div style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        marginBottom: '12px',
                        color: '#34495e'
                    }}>
                        검색 결과가 없습니다
                    </div>
                    <div style={{
                        fontSize: '16px',
                        color: '#95a5a6',
                        marginBottom: '8px'
                    }}>
                        다른 지역이나 테마를 선택해보세요
                    </div>
                    <div style={{
                        fontSize: '14px',
                        color: '#bdc3c7'
                    }}>
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