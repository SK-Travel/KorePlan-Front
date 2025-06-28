import React, { useEffect, useState } from 'react';

const ThemeSelector = ({ onThemeChange, selectedTheme }) => {
    const [isMobile, setIsMobile] = useState(false);

    // 모바일 감지
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 고정된 테마 목록 (하드코딩 - 서버와 무관하게 작동)
    const themes = [
        { key: '관광지', label: '🏛️ 관광지', color: '#e74c3c' },
        { key: '문화시설', label: '🎭 문화시설', color: '#9b59b6' },
        { key: '레포츠', label: '🏃 레포츠', color: '#3498db' },
        { key: '숙박', label: '🏨 숙박', color: '#34495e' },
        { key: '쇼핑', label: '🛍️ 쇼핑', color: '#e67e22' },
        { key: '음식점', label: '🍽️ 음식점', color: '#f1c40f' }
    ];
    
    // 테마 버튼 클릭 핸들러
    const handleThemeClick = (themeKey) => {
        console.log('🎯 테마 선택:', themeKey);
        if (onThemeChange) {
            onThemeChange(themeKey);
        }
    };

    // 버튼 스타일 함수 (데스크톱)
    const getButtonStyle = (isSelected, themeColor) => ({
        padding: '12px 20px',
        margin: '8px',
        border: isSelected ? `3px solid ${themeColor}` : '2px solid #e1e8ed',
        borderRadius: '30px',
        background: isSelected ? themeColor : 'white',
        color: isSelected ? 'white' : '#2c3e50',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: isSelected ? '700' : '500',
        transition: 'all 0.3s ease',
        display: 'inline-block',
        boxShadow: isSelected ? `0 6px 20px ${themeColor}50` : '0 2px 8px rgba(0,0,0,0.1)',
        transform: isSelected ? 'translateY(-2px)' : 'translateY(0)',
        userSelect: 'none',
        minWidth: '140px',
        textAlign: 'center'
    });

    // 모바일 버튼 스타일 함수
    const getMobileButtonStyle = (isSelected, themeColor) => ({
        width: 'calc(33.33% - 6px)',
        padding: '12px 6px',
        margin: '3px',
        border: isSelected ? `3px solid ${themeColor}` : '2px solid #e1e8ed',
        borderRadius: '20px',
        background: isSelected ? themeColor : 'white',
        color: isSelected ? 'white' : '#2c3e50',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: isSelected ? '700' : '500',
        transition: 'all 0.3s ease',
        display: 'inline-block',
        boxShadow: isSelected ? `0 4px 15px ${themeColor}50` : '0 2px 6px rgba(0,0,0,0.1)',
        transform: isSelected ? 'translateY(-1px)' : 'translateY(0)',
        userSelect: 'none',
        textAlign: 'center',
        boxSizing: 'border-box'
    });

    return (
        <div style={{
            width: '100%',
            backgroundColor: 'white',
            padding: isMobile ? '20px' : '25px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            marginBottom: '20px'
        }}>
            <h2 style={{
                textAlign: 'center',
                margin: '0 0 25px 0',
                color: '#2c3e50',
                fontSize: isMobile ? '20px' : '22px',
                fontWeight: '700'
            }}>
                🎯 테마 선택
            </h2>

            {/* 테마 선택 버튼들 */}
            <div style={{
                padding: isMobile ? '15px' : '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                border: '1px solid #e9ecef'
            }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: isMobile ? '0px' : '4px',
                    justifyContent: isMobile ? 'flex-start' : 'center'
                }}>
                    {themes.map((theme) => (
                        <button
                            key={theme.key}
                            style={isMobile ? 
                                getMobileButtonStyle(selectedTheme === theme.key, theme.color) :
                                getButtonStyle(selectedTheme === theme.key, theme.color)
                            }
                            onClick={() => handleThemeClick(theme.key)}
                            onMouseEnter={(e) => {
                                if (selectedTheme !== theme.key) {
                                    e.target.style.backgroundColor = `${theme.color}15`;
                                    e.target.style.borderColor = theme.color;
                                    e.target.style.color = theme.color;
                                    e.target.style.transform = isMobile ? 'translateY(-1px)' : 'translateY(-3px)';
                                    e.target.style.boxShadow = isMobile ? 
                                        `0 6px 20px ${theme.color}30` : 
                                        `0 8px 25px ${theme.color}30`;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedTheme !== theme.key) {
                                    e.target.style.backgroundColor = 'white';
                                    e.target.style.borderColor = '#e1e8ed';
                                    e.target.style.color = '#2c3e50';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = isMobile ?
                                        '0 2px 6px rgba(0,0,0,0.1)' :
                                        '0 2px 8px rgba(0,0,0,0.1)';
                                }
                            }}
                        >
                            {theme.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 현재 선택된 테마 표시 */}
            <div style={{
                padding: isMobile ? '12px' : '15px',
                backgroundColor: '#e8f4f8',
                borderRadius: '10px',
                textAlign: 'center',
                marginTop: '20px',
                border: '1px solid #b8e0d2'
            }}>
                <div style={{
                    fontSize: isMobile ? '13px' : '14px',
                    color: '#2c3e50',
                    fontWeight: '500'
                }}>
                    선택된 테마: 
                    <strong style={{ 
                        color: themes.find(t => t.key === selectedTheme)?.color || '#7f8c8d',
                        marginLeft: '8px',
                        fontSize: isMobile ? '15px' : '16px'
                    }}>
                        {/* ✅ 수정: 빈 문자열일 때 미선택 상태 표시 */}
                        {themes.find(t => t.key === selectedTheme)?.label || '테마 미선택'}
                    </strong>
                </div>
                
                {/* 테마 설명 */}
                <div style={{
                    fontSize: isMobile ? '11px' : '12px',
                    color: '#7f8c8d',
                    marginTop: '8px'
                }}>
                    {/* ✅ 수정: 빈 문자열 상태 처리 */}
                    {!selectedTheme ? (
                        '원하는 테마를 선택해주세요'
                    ) : selectedTheme === '관광지' ? (
                        '명소, 유적지, 자연경관 등의 관광 명소'
                    ) : selectedTheme === '문화시설' ? (
                        '박물관, 미술관, 공연장 등의 문화 공간'
                    ) : selectedTheme === '레포츠' ? (
                        '스포츠, 레저 활동 시설'
                    ) : selectedTheme === '숙박' ? (
                        '호텔, 펜션, 게스트하우스 등 숙박 시설'
                    ) : selectedTheme === '쇼핑' ? (
                        '쇼핑몰, 시장, 특산품 판매점'
                    ) : selectedTheme === '음식점' ? (
                        '맛집, 카페, 전통 음식점'
                    ) : (
                        '원하는 테마를 선택해주세요'
                    )}
                </div>
            </div>
        </div>
    );
};

export default ThemeSelector;