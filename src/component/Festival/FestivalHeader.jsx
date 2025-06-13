import React, { useState, useEffect } from 'react';

const FestivalHeader = ({ onFilterChange }) => {
    const [selectedRegion, setSelectedRegion] = useState('전국');
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [appliedSearchKeyword, setAppliedSearchKeyword] = useState(''); // 실제 적용된 검색어
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeModalTab, setActiveModalTab] = useState('time');
    
    // 모바일 체크용 state
    const [isMobile, setIsMobile] = useState(false);

    // 지역 목록
    const regions = [
        '전국', '서울특별시', '부산광역시', '대구광역시', '인천광역시', 
        '광주광역시', '대전광역시', '울산광역시', '세종특별자치시',
        '경기도', '강원특별자치도', '충청북도', '충청남도', '전북특별자치도', 
        '전라남도', '경상북도', '경상남도', '제주특별자치도'
    ];

    // 카테고리 목록
    const categories = ['전체', '축제', '공연', '행사'];

    // 시기 옵션 (간단하게 월만 선택)
    const timeOptions = [
        { type: 'all', status: '', month: '', label: '전체' },
        { type: 'status', status: '진행중', month: '', label: '진행중' },
        { type: 'status', status: '진행예정', month: '', label: '진행예정' },
        { type: 'month', status: '', month: '1월', label: '1월' },
        { type: 'month', status: '', month: '2월', label: '2월' },
        { type: 'month', status: '', month: '3월', label: '3월' },
        { type: 'month', status: '', month: '4월', label: '4월' },
        { type: 'month', status: '', month: '5월', label: '5월' },
        { type: 'month', status: '', month: '6월', label: '6월' },
        { type: 'month', status: '', month: '7월', label: '7월' },
        { type: 'month', status: '', month: '8월', label: '8월' },
        { type: 'month', status: '', month: '9월', label: '9월' },
        { type: 'month', status: '', month: '10월', label: '10월' },
        { type: 'month', status: '', month: '11월', label: '11월' },
        { type: 'month', status: '', month: '12월', label: '12월' },
    ];

    // 화면 크기 체크
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 초기 로드시에만 전체 목록 표시
    useEffect(() => {
        onFilterChange({
            selectedRegion: '전국',
            selectedCategory: '전체', 
            selectedStatus: '',
            selectedMonth: '',
            searchKeyword: ''
        });
    }, []);

    // 검색 실행 함수
    const executeSearch = () => {
        setAppliedSearchKeyword(searchKeyword);
        onFilterChange({
            selectedRegion: '전국',
            selectedCategory: '전체',
            selectedStatus: '',
            selectedMonth: '',
            searchKeyword: searchKeyword.trim()
        });
    };

    // 엔터키 검색
    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            executeSearch();
        }
    };

    // 필터 적용 (하단 조회 버튼)
    const applyFilters = () => {
        setAppliedSearchKeyword(''); // 필터 적용시에는 검색어 초기화
        onFilterChange({
            selectedRegion,
            selectedCategory,
            selectedStatus,
            selectedMonth,
            searchKeyword: ''
        });
    };

    // 모달 열기
    const openModal = (tab) => {
        setActiveModalTab(tab);
        setIsModalOpen(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // 시기 선택 (간단하게 바로 선택)
    const handleTimeSelect = (option) => {
        setSelectedStatus(option.status);
        setSelectedMonth(option.month);
        closeModal();
    };

    // 지역 선택
    const handleRegionSelect = (region) => {
        setSelectedRegion(region);
        closeModal();
    };

    // 카테고리 선택
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        closeModal();
    };

    // 필터 초기화
    const resetFilters = () => {
        setSelectedRegion('전국');
        setSelectedCategory('전체');
        setSelectedStatus('');
        setSelectedMonth('');
        setSearchKeyword('');
        setAppliedSearchKeyword('');
        // 필터 초기화시 전체 축제 로드
        onFilterChange({
            selectedRegion: '전국',
            selectedCategory: '전체',
            selectedStatus: '',
            selectedMonth: '',
            searchKeyword: ''
        });
    };

    // 현재 선택된 시기 표시
    const getCurrentTimeLabel = () => {
        if (selectedStatus) return selectedStatus;
        if (selectedMonth) return selectedMonth;
        return '시기';
    };

    // 현재 선택된 지역 표시
    const getCurrentRegionLabel = () => {
        return selectedRegion === '전국' ? '지역' : selectedRegion;
    };

    // 현재 선택된 카테고리 표시
    const getCurrentCategoryLabel = () => {
        return selectedCategory === '전체' ? '카테고리' : selectedCategory;
    };

    return (
        <>
            <div style={{
                backgroundColor: 'white',
                padding: '30px 0',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
                {/* 검색바 */}
                <div style={{
                    marginBottom: '30px',
                    padding: '0 30px'
                }}>
                    <div style={{
                        position: 'relative',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        <input
                            type="text"
                            placeholder="축제명으로 검색해보세요..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyPress={handleSearchKeyPress}
                            style={{
                                width: '100%',
                                padding: '16px 50px 16px 20px',
                                fontSize: '16px',
                                border: '2px solid #e9ecef',
                                borderRadius: '25px',
                                outline: 'none',
                                transition: 'border-color 0.3s ease',
                                backgroundColor: '#f8f9fa',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#8b5cf6';
                                e.target.style.backgroundColor = 'white';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#e9ecef';
                                e.target.style.backgroundColor = '#f8f9fa';
                            }}
                        />
                        <button
                            onClick={executeSearch}
                            style={{
                                position: 'absolute',
                                right: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                fontSize: '20px',
                                color: '#8b5cf6',
                                cursor: 'pointer',
                                padding: '5px',
                                borderRadius: '50%',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
                                e.target.style.transform = 'translateY(-50%) scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.transform = 'translateY(-50%) scale(1)';
                            }}
                            title="검색하기"
                        >
                            🔍
                        </button>
                    </div>
                </div>

                {/* 필터 버튼들 - 모바일 반응형 */}
                <div style={{
                    display: 'flex',
                    gap: isMobile ? '12px' : '15px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: isMobile ? 'column' : 'row',
                    flexWrap: isMobile ? 'nowrap' : 'wrap',
                    padding: '0 30px'
                }}>
                    {/* 시기 필터 */}
                    <button
                        onClick={() => openModal('time')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            backgroundColor: 'white',
                            border: '2px solid #e9ecef',
                            borderRadius: '25px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            minWidth: '120px',
                            width: isMobile ? '280px' : 'auto',
                            justifyContent: 'space-between'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.borderColor = '#8b5cf6';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.borderColor = '#e9ecef';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            📅
                            <span>{getCurrentTimeLabel()}</span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#666' }}>▼</span>
                    </button>

                    {/* 지역 필터 */}
                    <button
                        onClick={() => openModal('region')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            backgroundColor: 'white',
                            border: '2px solid #e9ecef',
                            borderRadius: '25px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            minWidth: '120px',
                            width: isMobile ? '280px' : 'auto',
                            justifyContent: 'space-between'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.borderColor = '#8b5cf6';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.borderColor = '#e9ecef';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            📍
                            <span>{getCurrentRegionLabel()}</span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#666' }}>▼</span>
                    </button>

                    {/* 카테고리 필터 */}
                    <button
                        onClick={() => openModal('category')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            backgroundColor: 'white',
                            border: '2px solid #e9ecef',
                            borderRadius: '25px',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            minWidth: '120px',
                            width: isMobile ? '280px' : 'auto',
                            justifyContent: 'space-between'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.borderColor = '#8b5cf6';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.borderColor = '#e9ecef';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            🎭
                            <span>{getCurrentCategoryLabel()}</span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#666' }}>▼</span>
                    </button>

                    {/* 하단 버튼들 그룹 (모바일에서는 가로로 배치) */}
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                        width: isMobile ? '280px' : 'auto',
                        justifyContent: isMobile ? 'space-between' : 'center'
                    }}>
                        {/* 필터 초기화 버튼 */}
                        <button
                            onClick={resetFilters}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: isMobile ? '130px' : '40px',
                                height: '40px',
                                backgroundColor: '#f8f9fa',
                                border: '2px solid #e9ecef',
                                borderRadius: isMobile ? '25px' : '50%',
                                fontSize: isMobile ? '14px' : '16px',
                                fontWeight: isMobile ? '500' : 'normal',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#e9ecef';
                                e.target.style.transform = isMobile ? 'translateY(-2px)' : 'rotate(180deg)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa';
                                e.target.style.transform = isMobile ? 'translateY(0)' : 'rotate(0deg)';
                            }}
                            title="필터 초기화"
                        >
                            {isMobile ? '새로고침' : '🔄'}
                        </button>

                        {/* 조회 버튼 */}
                        <button
                            onClick={applyFilters}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '12px 25px',
                                backgroundColor: '#8b5cf6',
                                border: 'none',
                                borderRadius: '25px',
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                width: isMobile ? '130px' : 'auto'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#7c3aed';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#8b5cf6';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            조회하기
                        </button>
                    </div>
                </div>
            </div>

            {/* 모달 */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        padding: '30px',
                        maxWidth: '500px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                    }}>
                        {/* 모달 헤더 */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '25px',
                            paddingBottom: '15px',
                            borderBottom: '2px solid #f1f3f4'
                        }}>
                            <h2 style={{
                                margin: 0,
                                fontSize: '20px',
                                fontWeight: '600',
                                color: '#2c3e50'
                            }}>
                                {activeModalTab === 'time' && '📅 시기 선택'}
                                {activeModalTab === 'region' && '📍 지역 선택'}
                                {activeModalTab === 'category' && '🎭 카테고리 선택'}
                            </h2>
                            <button
                                onClick={closeModal}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#666',
                                    padding: '5px'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* 모달 내용 */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                            gap: '12px'
                        }}>
                            {/* 시기 선택 */}
                            {activeModalTab === 'time' && timeOptions.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleTimeSelect(option)}
                                    style={{
                                        padding: '12px',
                                        backgroundColor: (
                                            (option.status === selectedStatus && option.month === selectedMonth) ||
                                            (option.status === '' && option.month === '' && selectedStatus === '' && selectedMonth === '')
                                        ) ? '#8b5cf6' : 'white',
                                        color: (
                                            (option.status === selectedStatus && option.month === selectedMonth) ||
                                            (option.status === '' && option.month === '' && selectedStatus === '' && selectedMonth === '')
                                        ) ? 'white' : '#2c3e50',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (e.target.style.backgroundColor !== 'rgb(139, 92, 246)') {
                                            e.target.style.backgroundColor = '#f8f9fa';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (e.target.style.color !== 'white') {
                                            e.target.style.backgroundColor = 'white';
                                        }
                                    }}
                                >
                                    {option.label}
                                </button>
                            ))}

                            {/* 지역 선택 */}
                            {activeModalTab === 'region' && regions.map((region, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleRegionSelect(region)}
                                    style={{
                                        padding: '12px',
                                        backgroundColor: selectedRegion === region ? '#8b5cf6' : 'white',
                                        color: selectedRegion === region ? 'white' : '#2c3e50',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (e.target.style.backgroundColor !== 'rgb(139, 92, 246)') {
                                            e.target.style.backgroundColor = '#f8f9fa';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (e.target.style.color !== 'white') {
                                            e.target.style.backgroundColor = 'white';
                                        }
                                    }}
                                >
                                    {region}
                                </button>
                            ))}

                            {/* 카테고리 선택 */}
                            {activeModalTab === 'category' && categories.map((category, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleCategorySelect(category)}
                                    style={{
                                        padding: '12px',
                                        backgroundColor: selectedCategory === category ? '#8b5cf6' : 'white',
                                        color: selectedCategory === category ? 'white' : '#2c3e50',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (e.target.style.backgroundColor !== 'rgb(139, 92, 246)') {
                                            e.target.style.backgroundColor = '#f8f9fa';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (e.target.style.color !== 'white') {
                                            e.target.style.backgroundColor = 'white';
                                        }
                                    }}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FestivalHeader;