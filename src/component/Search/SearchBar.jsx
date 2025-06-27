// component/Search/SearchBar.jsx
import React, { useState, useEffect } from 'react';

const SearchBar = ({
    searchQuery,
    onSearchQueryChange,
    onSearch,
    onClear,
    isPanelOpen
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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    // 데스크탑 스타일
    const desktopStyle = {
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: isPanelOpen ? '420px' : '20px',
        zIndex: 998,
        transition: 'right 0.3s ease'
    };

    // 모바일 스타일
    const mobileStyle = {
        position: 'absolute',
        top: '20px',
        left: '20px',
        right: '20px',
        zIndex: 998,
        // 패널이 열렸을 때는 하단 여백 추가 (패널과 겹치지 않게)
        bottom: isPanelOpen ? '75vh' : 'auto'
    };

    return (
        <div style={isMobile ? mobileStyle : desktopStyle}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: isMobile ? '10px 14px' : '12px 16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.3)'
            }}>
                <span style={{ 
                    color: '#6c757d', 
                    marginRight: isMobile ? '10px' : '12px', 
                    fontSize: isMobile ? '16px' : '18px' 
                }}>
                    🔍
                </span>
                <input
                    type="text"
                    placeholder="장소, 주소 검색"
                    value={searchQuery}
                    onChange={(e) => onSearchQueryChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{
                        flex: 1,
                        border: 'none',
                        backgroundColor: 'transparent',
                        outline: 'none',
                        fontSize: isMobile ? '15px' : '16px',
                        fontWeight: '500'
                    }}
                />
                {searchQuery && (
                    <button
                        onClick={onClear}
                        style={{
                            border: 'none',
                            backgroundColor: 'transparent',
                            color: '#6c757d',
                            cursor: 'pointer',
                            padding: '4px',
                            fontSize: isMobile ? '14px' : '16px'
                        }}
                    >
                        ✕
                    </button>
                )}
                <button
                    onClick={onSearch}
                    style={{
                        marginLeft: '8px',
                        padding: isMobile ? '6px 12px' : '8px 16px',
                        backgroundColor: '#4ECDC4',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: isMobile ? '13px' : '14px',
                        fontWeight: '500'
                    }}
                >
                    검색
                </button>
            </div>
        </div>
    );
};

export default SearchBar;