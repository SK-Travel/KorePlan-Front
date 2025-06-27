// component/Search/SearchPanel.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 테마 설정
const THEME_CONFIG = {
    12: { icon: "🏛️", label: "관광지", color: "#FF6B6B" },
    14: { icon: "🎭", label: "문화시설", color: "#4ECDC4" },
    15: { icon: "🎪", label: "축제공연행사", color: "#45B7D1" },
    28: { icon: "🏃‍♂️", label: "레포츠", color: "#FECA57" },
    32: { icon: "🏨", label: "숙박", color: "#FF9FF3" },
    38: { icon: "🛍️", label: "쇼핑", color: "#54A0FF" },
    39: { icon: "🍽️", label: "음식점", color: "#5F27CD" }
};

// 테마에 따른 이름 반환 함수
const getThemeName = (theme) => {
    const config = THEME_CONFIG[theme];
    return config ? config.label : '기타';
};

// 테마에 따른 색상 반환 함수
const getThemeColor = (theme) => {
    const config = THEME_CONFIG[theme];
    return config ? config.color : '#95a5a6';
};

// 개별 장소 카드 컴포넌트
const PlaceCard = ({ place, isSelected, onHover, onClick, onBookmark }) => {
    const navigate = useNavigate();
    const handleDetailClick = (e) => {
        e.stopPropagation();
        navigate(`/spot/${place.contentId}`, {
            state: {
                contentId: place.contentId,
                contentTypeId: place.theme,
                spotData: place,
            }
        });
    };

    const handleBookmarkClick = (e) => {
        e.stopPropagation();
        onBookmark(place.id);
    };

    const handleAddToTripClick = (e) => {
        e.stopPropagation();
        alert(`${place.title}을(를) 여행 계획에 추가했습니다!`);
    };

    return (
        <div
            style={{
                padding: '16px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                backgroundColor: isSelected ? '#f8f9fa' : 'white',
                transition: 'background-color 0.2s ease',
                borderLeft: isSelected ? '4px solid #4ECDC4' : '4px solid transparent'
            }}
            onMouseEnter={onHover}
            onClick={onClick}
        >
            <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
            }}>
                {/* 이미지 */}
                <div style={{ flexShrink: 0 }}>
                    {place.firstImage ? (
                        <img
                            src={place.firstImage}
                            alt={place.title}
                            style={{
                                width: '80px',
                                height: '60px',
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
                        width: '80px',
                        height: '60px',
                        backgroundColor: '#f7f7f7',
                        borderRadius: '8px',
                        display: place.firstImage ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: '#717171',
                        textAlign: 'center'
                    }}>
                        이미지<br />없음
                    </div>
                </div>

                {/* 정보 영역 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    {/* 제목 */}
                    <div style={{ marginBottom: '4px' }}>
                        <h3 style={{
                            margin: 0,
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#222',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {place.title}
                        </h3>
                        {place.theme && (
                            <span style={{
                                display: 'inline-block',
                                padding: '2px 6px',
                                backgroundColor: getThemeColor(place.theme),
                                color: 'white',
                                fontSize: '11px',
                                borderRadius: '4px',
                                marginTop: '2px'
                            }}>
                                {getThemeName(place.theme)}
                            </span>
                        )}
                    </div>

                    {/* 주소 */}
                    <p style={{
                        margin: '4px 0',
                        fontSize: '12px',
                        color: '#666',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {place.addr1 || place.regionName || '주소 정보 없음'}
                    </p>

                    {/* 액션 버튼들 */}
                    <div style={{
                        display: 'flex',
                        gap: '6px',
                        alignItems: 'center',
                        marginTop: '8px'
                    }}>
                        {/* 찜하기 버튼 */}
                        <button
                            onClick={handleBookmarkClick}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px',
                                padding: '3px 6px',
                                border: 'none',
                                borderRadius: '4px',
                                backgroundColor: place.isBookmarked ? '#ff6b6b' : '#f8f9fa',
                                color: place.isBookmarked ? 'white' : '#666',
                                fontSize: '11px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {place.isBookmarked ? '💖' : '🤍'}
                            찜
                        </button>

                        {/* 상세보기 버튼 */}
                        <button
                            onClick={handleDetailClick}
                            style={{
                                padding: '3px 6px',
                                border: '1px solid #4ECDC4',
                                borderRadius: '4px',
                                backgroundColor: 'white',
                                color: '#4ECDC4',
                                fontSize: '11px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
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
                            상세
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 테마 버튼 컴포넌트
const ThemeButton = ({ theme, isActive, isLoading, onClick }) => {
    const config = THEME_CONFIG[theme];
    if (!config) return null;
    
    return (
        <button
            onClick={() => onClick(theme)}
            disabled={isLoading}
            style={{
                backgroundColor: isActive ? config.color : 'white',
                borderColor: config.color,
                color: isActive ? 'white' : config.color,
                border: `2px solid ${config.color}`,
                borderRadius: '20px',
                padding: '8px 16px',
                margin: '4px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                opacity: isLoading && !isActive ? 0.5 : 1,
                whiteSpace: 'nowrap'
            }}
        >
            <span>{config.icon}</span>
            <span>{config.label}</span>
            {isLoading && isActive && (
                <span>⏳</span>
            )}
        </button>
    );
};

const SearchPanel = ({
    isPanelOpen,
    onTogglePanel,
    selectedTheme,
    isThemeLoading,
    onThemeSelect,
    searchQuery,
    searchResults,
    themeSearchResults,
    isThemeMode,
    selectedPlace,
    onPlaceSelect,
    onBookmark,
    loading,
    hasMoreData,
    onKeywordLoadMore,
    onThemeLoadMore,
    likedPlacesCount,
    currentLocation,
    onRefreshThemeSearch
}) => {
    const [isMobile, setIsMobile] = useState(false);

    // 화면 크기 감지
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 장소 호버 처리
    const handlePlaceHover = (place) => {
        console.log('Hovering place:', place.title);
    };

    // 현재 위치에서 다시 검색 버튼 클릭 핸들러
    const handleRefreshSearch = () => {
        if (selectedTheme && onRefreshThemeSearch) {
            console.log('패널에서 테마 재검색 요청:', selectedTheme);
            onRefreshThemeSearch();
        }
    };

    // 패널에 표시될 내용 결정
    const getDisplayContent = () => {
        if (isThemeMode && themeSearchResults.length > 0) {
            return {
                title: `${THEME_CONFIG[selectedTheme]?.label} ${themeSearchResults.length}개`,
                items: themeSearchResults,
                emptyMessage: null,
                isThemeMode: true
            };
        } else if (isThemeMode && selectedTheme) {
            return {
                title: `${THEME_CONFIG[selectedTheme]?.label} 0개`,
                items: [],
                emptyMessage: {
                    icon: '🔍',
                    title: '해당 테마의 장소가 없습니다',
                    subtitle: '다른 테마를 선택하거나 현재 위치에서 다시 검색해보세요'
                },
                isThemeMode: true
            };
        } else if (searchResults.length > 0) {
            return {
                title: `검색 결과 ${searchResults.length}개`,
                items: searchResults,
                emptyMessage: null,
                isThemeMode: false
            };
        } else if (searchQuery.trim()) {
            return {
                title: '검색 결과 0개',
                items: [],
                emptyMessage: {
                    icon: '🔍',
                    title: '검색 결과가 없습니다',
                    subtitle: '다른 키워드로 검색해보세요'
                },
                isThemeMode: false
            };
        } else {
            return {
                title: `찜한 장소 ${likedPlacesCount}개가 지도에 표시됨`,
                items: [],
                emptyMessage: {
                    icon: '🔍',
                    title: '검색어를 입력해주세요',
                    subtitle: '장소나 주소를 검색하거나 테마 버튼을 클릭해보세요'
                },
                isThemeMode: false
            };
        }
    };

    const displayContent = getDisplayContent();

    // 데스크탑 스타일
    const desktopPanelStyle = {
        position: 'absolute',
        top: 0,
        right: isPanelOpen ? 0 : '-400px',
        width: '400px',
        height: '100%',
        backgroundColor: 'white',
        boxShadow: isPanelOpen ? '-5px 0 20px rgba(0,0,0,0.1)' : 'none',
        zIndex: 999,
        transition: 'right 0.3s ease, box-shadow 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
    };

    // 모바일 스타일
    const mobilePanelStyle = {
        position: 'fixed',
        bottom: isPanelOpen ? 0 : '-70vh',
        left: 0,
        right: 0,
        height: '70vh',
        backgroundColor: 'white',
        boxShadow: isPanelOpen ? '0 -5px 20px rgba(0,0,0,0.1)' : 'none',
        zIndex: 999,
        transition: 'bottom 0.3s ease, box-shadow 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px'
    };

    // 데스크탑 토글 버튼
    const desktopToggleStyle = {
        position: 'absolute',
        top: '50%',
        right: isPanelOpen ? '380px' : '20px',
        transform: 'translateY(-50%)',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        zIndex: 1002,
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        color: '#333'
    };

    // 모바일 토글 버튼
    const mobileToggleStyle = {
        position: 'fixed',
        bottom: isPanelOpen ? '65vh' : '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60px',
        height: '40px',
        borderRadius: '20px',
        border: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        zIndex: 1002,
        fontSize: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        color: '#333'
    };

    return (
        <>
            {/* 패널 토글 버튼 */}
            <button
                onClick={onTogglePanel}
                style={isMobile ? mobileToggleStyle : desktopToggleStyle}
            >
                {isMobile ? (isPanelOpen ? '⌄' : '⌃') : (isPanelOpen ? '>' : '<')}
            </button>

            {/* 사이드 패널 */}
            <div style={isMobile ? mobilePanelStyle : desktopPanelStyle}>
                {/* 모바일용 드래그 핸들 */}
                {isMobile && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '8px 0',
                        backgroundColor: 'white',
                        borderTopLeftRadius: '20px',
                        borderTopRightRadius: '20px'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '4px',
                            backgroundColor: '#ddd',
                            borderRadius: '2px'
                        }}></div>
                    </div>
                )}

                {/* 패널 헤더 */}
                <div style={{
                    padding: isMobile ? '10px 20px 20px' : '20px',
                    borderBottom: '1px solid #f0f0f0',
                    backgroundColor: 'white',
                    borderTopLeftRadius: isMobile ? '20px' : '0',
                    borderTopRightRadius: isMobile ? '20px' : '0'
                }}>
                    {/* 테마 뱃지들 */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: isMobile ? '4px' : '8px',
                        marginBottom: '16px'
                    }}>
                        {Object.keys(THEME_CONFIG).map(theme => (
                            <ThemeButton 
                                key={theme}
                                theme={parseInt(theme)}
                                isActive={selectedTheme === parseInt(theme)}
                                isLoading={isThemeLoading}
                                onClick={onThemeSelect}
                            />
                        ))}
                    </div>

                    {/* 현재 위치에서 다시 검색 버튼 - 테마 모드이고 선택된 테마가 있을 때만 표시 */}
                    {isThemeMode && selectedTheme && (
                        <div style={{ marginBottom: '16px' }}>
                            <button
                                onClick={handleRefreshSearch}
                                disabled={isThemeLoading}
                                style={{
                                    width: '100%',
                                    background: isThemeLoading 
                                        ? 'rgba(74, 144, 226, 0.1)' 
                                        : 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    padding: isMobile ? '10px 14px' : '12px 16px',
                                    fontSize: isMobile ? '13px' : '14px',
                                    fontWeight: '600',
                                    color: isThemeLoading ? '#999' : 'white',
                                    cursor: isThemeLoading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    boxShadow: isThemeLoading ? 'none' : '0 4px 12px rgba(74, 144, 226, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isThemeLoading) {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 6px 16px rgba(74, 144, 226, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isThemeLoading) {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.3)';
                                    }
                                }}
                            >
                                {isThemeLoading ? (
                                    <>
                                        <div style={{
                                            width: '16px',
                                            height: '16px',
                                            border: '2px solid #e0e0e0',
                                            borderTop: '2px solid #999',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }}></div>
                                        검색 중...
                                    </>
                                ) : (
                                    <>
                                        <span style={{ fontSize: '16px' }}>🔄</span>
                                        이 지역에서 {THEME_CONFIG[selectedTheme]?.label} 다시 검색
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* 검색 결과 개수 또는 상태 표시 */}
                    <div style={{
                        padding: '8px 12px',
                        backgroundColor: isThemeMode && selectedTheme ? getThemeColor(selectedTheme) + '15' : '#f8f9fa',
                        borderRadius: '8px',
                        fontSize: isMobile ? '13px' : '14px',
                        color: '#495057',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <span>{displayContent.title}</span>
                        {currentLocation && (searchResults.length > 0 || themeSearchResults.length > 0) && (
                            <span style={{ fontSize: isMobile ? '11px' : '12px', color: '#6c757d' }}>
                                📍 현재 화면 기준
                            </span>
                        )}
                    </div>
                </div>

                {/* 검색 결과 리스트 */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    maxHeight: isMobile ? 'calc(70vh - 200px)' : 'auto'
                }}>
                    {/* 첫 검색 시에만 전체 로딩 표시 */}
                    {((loading && searchResults.length === 0) || (isThemeLoading && themeSearchResults.length === 0)) ? (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '200px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    border: '2px solid #f3f3f3',
                                    borderTop: '2px solid #4ECDC4',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                {isThemeLoading ? '테마 검색 중...' : '검색 중...'}
                            </div>
                        </div>
                    ) : displayContent.emptyMessage ? (
                        <div style={{
                            textAlign: 'center',
                            padding: isMobile ? '40px 20px' : '60px 20px',
                            color: '#717171'
                        }}>
                            <div style={{ fontSize: isMobile ? '40px' : '48px', marginBottom: '16px' }}>
                                {displayContent.emptyMessage.icon}
                            </div>
                            <p style={{ fontSize: isMobile ? '15px' : '16px', fontWeight: '500', marginBottom: '8px' }}>
                                {displayContent.emptyMessage.title}
                            </p>
                            <p style={{ fontSize: isMobile ? '13px' : '14px', color: '#999' }}>
                                {displayContent.emptyMessage.subtitle}
                            </p>
                        </div>
                    ) : (
                        <div>
                            {/* 검색 결과 아이템들 */}
                            {displayContent.items.map((place) => (
                                <PlaceCard
                                    key={place.id}
                                    place={place}
                                    isSelected={selectedPlace?.id === place.id}
                                    onHover={() => handlePlaceHover(place)}
                                    onClick={() => onPlaceSelect(place)}
                                    onBookmark={onBookmark}
                                />
                            ))}
                            
                            {/* 더보기 로딩 - 테마 검색 모드 */}
                            {isThemeMode && isThemeLoading && themeSearchResults.length > 0 && (
                                <div style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    borderTop: '1px solid #f0f0f0'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        color: '#666'
                                    }}>
                                        <div style={{
                                            width: '16px',
                                            height: '16px',
                                            border: '2px solid #f3f3f3',
                                            borderTop: '2px solid #4ECDC4',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }}></div>
                                        더 많은 장소를 불러오는 중...
                                    </div>
                                </div>
                            )}
                            
                            {/* 더보기 로딩 - 키워드 검색 모드 */}
                            {!isThemeMode && loading && searchResults.length > 0 && (
                                <div style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    borderTop: '1px solid #f0f0f0'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        color: '#666'
                                    }}>
                                        <div style={{
                                            width: '16px',
                                            height: '16px',
                                            border: '2px solid #f3f3f3',
                                            borderTop: '2px solid #FF6B6B',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }}></div>
                                        더 많은 검색 결과를 불러오는 중...
                                    </div>
                                </div>
                            )}
                            
                            {/* 더보기 버튼 - 테마 검색 모드 */}
                            {isThemeMode && hasMoreData && displayContent.items.length > 0 && !isThemeLoading && (
                                <div style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    borderTop: '1px solid #f0f0f0'
                                }}>
                                    <button
                                        onClick={onThemeLoadMore}
                                        style={{
                                            padding: isMobile ? '10px 20px' : '12px 24px',
                                            backgroundColor: '#4ECDC4',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: isMobile ? '13px' : '14px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            margin: '0 auto'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#3DBDB3';
                                            e.target.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = '#4ECDC4';
                                            e.target.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        📄 더보기 ({THEME_CONFIG[selectedTheme]?.label})
                                    </button>
                                </div>
                            )}

                            {/* 더보기 버튼 - 키워드 검색 모드 */}
                            {!isThemeMode && searchQuery.trim() && hasMoreData && displayContent.items.length > 0 && !loading && (
                                <div style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    borderTop: '1px solid #f0f0f0'
                                }}>
                                    <button
                                        onClick={onKeywordLoadMore}
                                        style={{
                                            padding: isMobile ? '10px 20px' : '12px 24px',
                                            backgroundColor: '#FF6B6B',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: isMobile ? '13px' : '14px',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            margin: '0 auto'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = '#E55A5A';
                                            e.target.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = '#FF6B6B';
                                            e.target.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        📄 더보기 ("{searchQuery}")
                                    </button>
                                </div>
                            )}
                            
                            {/* 마지막 페이지 메시지 */}
                            {displayContent.items.length > 0 && !hasMoreData && (
                                <div style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    borderTop: '1px solid #f0f0f0',
                                    color: '#999',
                                    fontSize: isMobile ? '13px' : '14px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}>
                                        ✨ 모든 결과를 확인했습니다
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* CSS 애니메이션 */}
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                /* 모바일에서 스크롤 최적화 */
                @media (max-width: 768px) {
                    .search-panel-content {
                        -webkit-overflow-scrolling: touch;
                    }
                }
            `}</style>
        </>
    );
};

export default SearchPanel;