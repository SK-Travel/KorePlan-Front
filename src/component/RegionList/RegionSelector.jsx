import React, { useEffect, useState } from 'react';

const RegionSelector = ({ onRegionChange, onWardChange, selectedRegion, selectedWards = [] }) => {
    // 고정된 지역 목록 (하드코딩)
    const regions = [
        '전국', '서울특별시', '부산광역시', '대구광역시', '인천광역시',
        '광주광역시', '대전광역시', '울산광역시', '세종특별자치시',
        '경기도', '강원특별자치도', '충청북도', '충청남도', '전북특별자치도',
        '전라남도', '경상북도', '경상남도', '제주특별자치도'
    ];

    const [wards, setWards] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [wardsLoading, setWardsLoading] = useState(false);
    const [tempSelectedWards, setTempSelectedWards] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);

    // 모바일 감지
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // API 기본 URL
    const API_BASE_URL = '/api/region-list';

    // 구/군 목록만 API로 로드 
    const loadWards = async (regionName) => {
        try {
            setWardsLoading(true);
            const response = await fetch(`${API_BASE_URL}/regions/${regionName}/wards`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.wards && data.wards.length > 0) {
                setWards(data.wards);
                console.log(`${regionName} 구/군 목록 로드:`, data.wards);
            } else {
                console.warn(`${regionName}에 구/군 데이터가 없습니다.`);
                setWards([]);
            }
        } catch (error) {
            console.error(`${regionName} 구/군 로드 실패:`, error.message);
            setWards([]);
        } finally {
            setWardsLoading(false);
        }
    };

    // 지역 버튼 클릭 핸들러
    const handleRegionClick = async (regionName) => {
        console.log('🗺️ 지역 선택:', regionName);

        if (onRegionChange) {
            onRegionChange(regionName);
        }

        // 모바일에서 드롭다운 닫기
        if (isMobile) {
            setIsRegionDropdownOpen(false);
        }

        // 전국이 아닌 경우 모달 열기
        if (regionName !== '전국') {
            // 지역이 변경되면 구/군 선택 초기화
            if (onWardChange) {
                onWardChange([]);
            }
            setTempSelectedWards([]); // 임시 선택도 초기화
            await loadWards(regionName);
            setShowModal(true);
        } else {
            // 전국 선택 시 구/군 선택 초기화
            if (onWardChange) {
                onWardChange([]);
            }
        }
    };

    // 모달에서 구/군 선택/해제
    const handleModalWardToggle = (wardName) => {
        setTempSelectedWards(prev => {
            if (prev.includes(wardName)) {
                return prev.filter(ward => ward !== wardName);
            } else {
                return [...prev, wardName];
            }
        });
    };

    // 모달에서 전체 선택
    const handleSelectAllInModal = () => {
        if (tempSelectedWards.length === wards.length) {
            // 모든 구/군이 선택된 상태면 전체 해제
            setTempSelectedWards([]);
        } else {
            // 전체 선택
            setTempSelectedWards([...wards]);
        }
    };

    // 모달에서 확인 버튼
    const handleModalConfirm = () => {
        if (onWardChange) {
            onWardChange(tempSelectedWards);
        }
        setShowModal(false);
    };

    // 모달에서 취소 버튼
    const handleModalCancel = () => {
        setTempSelectedWards([...selectedWards]); // 원래 상태로 복원
        setShowModal(false);
    };
    // 구/군 다시 선택 버튼 클릭 핸들러 (새로 추가)
    const handleReselectWards = async () => {
        if (selectedRegion && selectedRegion !== '전국') {
            setTempSelectedWards([...selectedWards]); // 현재 선택된 구/군으로 초기화
            await loadWards(selectedRegion);
            setShowModal(true);
        }
    };

    // 버튼 스타일 함수
    const getButtonStyle = (isSelected, baseColor = '#3498db') => ({
        padding: '10px 18px',
        margin: '6px',
        border: isSelected ? `2px solid ${baseColor}` : '2px solid #e1e8ed',
        borderRadius: '25px',
        background: isSelected ? baseColor : 'white',
        color: isSelected ? 'white' : '#2c3e50',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: isSelected ? '600' : '500',
        transition: 'all 0.3s ease',
        display: 'inline-block',
        boxShadow: isSelected ? `0 4px 12px ${baseColor}40` : '0 2px 4px rgba(0,0,0,0.1)',
        transform: isSelected ? 'translateY(-1px)' : 'translateY(0)',
        userSelect: 'none'
    });
    // 구/군 다시 선택 버튼 스타일 (새로 추가)
    const getReselectButtonStyle = () => ({
        padding: isMobile ? '6px 12px' : '8px 16px',
        border: '2px solid #f39c12',
        borderRadius: '20px',
        background: '#f39c12',
        color: 'white',
        cursor: 'pointer',
        fontSize: isMobile ? '11px' : '12px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        boxShadow: '0 2px 6px rgba(243, 156, 18, 0.3)',
        marginLeft: isMobile ? '6px' : '8px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
    });
    // 모달 버튼 스타일
    const getModalButtonStyle = (isSelected, baseColor = '#27ae60') => ({
        padding: '8px 16px',
        margin: '4px',
        border: isSelected ? `2px solid ${baseColor}` : '2px solid #e1e8ed',
        borderRadius: '20px',
        background: isSelected ? baseColor : 'white',
        color: isSelected ? 'white' : '#2c3e50',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: isSelected ? '600' : '500',
        transition: 'all 0.3s ease',
        boxShadow: isSelected ? `0 3px 8px ${baseColor}40` : '0 2px 4px rgba(0,0,0,0.1)',
        transform: isSelected ? 'translateY(-1px)' : 'translateY(0)',
        userSelect: 'none'
    });


    const titleStyle = {
        margin: '0 0 15px 0',
        fontSize: isMobile ? '16px' : '18px',
        fontWeight: '600',
        color: '#2c3e50',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    };

    const buttonContainerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        justifyContent: 'center'
    };

    // 드롭다운 스타일
    const regionDropdownStyle = {
        position: 'relative',
        width: '100%'
    };

    const regionDropdownButtonStyle = {
        width: '100%',
        padding: '12px 16px',
        border: '2px solid #e1e8ed',
        borderRadius: '12px',
        background: 'white',
        cursor: 'pointer',
        fontSize: '14px',
        textAlign: 'left',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'all 0.2s ease',
        borderColor: isRegionDropdownOpen ? '#3498db' : '#e1e8ed'
    };

    const regionDropdownListStyle = {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        background: 'white',
        border: '2px solid #e1e8ed',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        zIndex: 100,
        maxHeight: '250px',
        overflowY: 'auto',
        marginTop: '4px'
    };

    const regionDropdownItemStyle = {
        padding: '12px 16px',
        cursor: 'pointer',
        fontSize: '14px',
        borderBottom: '1px solid #f1f1f1',
        transition: 'background-color 0.2s ease'
    };

    // 모달 스타일
    const modalOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        boxSizing: 'border-box'
    };

    const modalContentStyle = {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        position: 'relative'
    };

    const modalHeaderStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '2px solid #f1f1f1'
    };

    const modalButtonContainerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '20px',
        maxHeight: '300px',
        overflowY: 'auto',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
    };

    const modalFooterStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        marginTop: '20px',
        paddingTop: '15px',
        borderTop: '2px solid #f1f1f1'
    };
    const sectionStyle = {
        marginBottom: '25px',
        padding: isMobile ? '15px' : '20px',
        backgroundColor: '#e8f4f8', 
        borderRadius: '12px',
        border: '1px solid #b8e0d2' 
    };

    return (
        <div style={{
            width: '100%',
            maxWidth: isMobile ? '100%' : '1200px',
            backgroundColor: 'white',
            padding: isMobile ? '15px' : '25px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            margin: '0 auto'
        }}>

            <h2 style={{
                textAlign: 'center',
                margin: '0 0 30px 0',
                color: '#2c3e50',
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: '700'
            }}>
                🗺️ 지역 선택
            </h2>

            {/* 지역 선택 섹션 */}
            <div style={sectionStyle}>
                <h3 style={titleStyle}>
                    <span>📍</span>
                    시/도 선택
                    <span style={{
                        fontSize: '12px',
                        color: '#7f8c8d',
                        fontWeight: '400',
                        marginLeft: '8px'
                    }}>
                        {isMobile ? '(터치해서 선택)' : '(지역을 클릭하면 구/군 선택 창이 열립니다)'}
                    </span>
                </h3>

                {/* 모바일: 드롭다운 방식 */}
                {isMobile ? (
                    <div style={regionDropdownStyle}>
                        <button
                            style={regionDropdownButtonStyle}
                            onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                        >
                            <span style={{
                                color: selectedRegion ? '#2c3e50' : '#7f8c8d',
                                fontWeight: selectedRegion ? '600' : '400'
                            }}>
                                {/* ✅ 수정: 빈 문자열일 때 안내 문구 표시 */}
                                {selectedRegion || '시/도를 선택하세요'}
                            </span>
                            <span style={{
                                transform: isRegionDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease',
                                color: '#7f8c8d'
                            }}>
                                ▼
                            </span>
                        </button>

                        {isRegionDropdownOpen && (
                            <div style={regionDropdownListStyle}>
                                {regions.map((region, index) => (
                                    <div
                                        key={region}
                                        style={{
                                            ...regionDropdownItemStyle,
                                            backgroundColor: selectedRegion === region ? '#e8f4f8' : 'white',
                                            color: selectedRegion === region ? '#3498db' : '#2c3e50',
                                            fontWeight: selectedRegion === region ? '600' : '400',
                                            borderBottom: index === regions.length - 1 ? 'none' : '1px solid #f1f1f1'
                                        }}
                                        onClick={() => handleRegionClick(region)}
                                        onTouchStart={(e) => {
                                            e.target.style.backgroundColor = selectedRegion === region ? '#d4edda' : '#f8f9fa';
                                        }}
                                        onTouchEnd={(e) => {
                                            setTimeout(() => {
                                                e.target.style.backgroundColor = selectedRegion === region ? '#e8f4f8' : 'white';
                                            }, 150);
                                        }}
                                    >
                                        {region} {selectedRegion === region && '✓'}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    /* 데스크톱: 기존 버튼 방식 */
                    <div style={buttonContainerStyle}>
                        {regions.map((region) => (
                            <button
                                key={region}
                                style={getButtonStyle(selectedRegion === region, '#3498db')}
                                onClick={() => handleRegionClick(region)}
                                onMouseEnter={(e) => {
                                    if (selectedRegion !== region) {
                                        e.target.style.backgroundColor = '#ecf0f1';
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedRegion !== region) {
                                        e.target.style.backgroundColor = 'white';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                    }
                                }}
                            >
                                {region}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 드롭다운 외부 클릭 시 닫기 */}
            {isMobile && isRegionDropdownOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 50
                    }}
                    onClick={() => setIsRegionDropdownOpen(false)}
                />
            )}

            {/* 현재 선택 상태 표시 */}
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
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: '8px'
                }}>
                    <span>현재 선택:</span>
                    <strong style={{ color: '#3498db' }}>
                        {/* ✅ 수정: 빈 문자열일 때 미선택 상태 표시 */}
                        {selectedRegion || '지역 미선택'}
                    </strong>
                    {selectedWards.length > 0 && (
                        <>
                            <span style={{ color: '#7f8c8d' }}>→</span>
                            <strong style={{ color: '#27ae60' }}>
                                {selectedWards.length === 1 ?
                                    selectedWards[0] :
                                    `${selectedWards.slice(0, 2).join(', ')}${selectedWards.length > 2 ? ` 외 ${selectedWards.length - 2}개` : ''}`
                                }
                            </strong>
                            {/* 구/군 다시 선택 버튼 추가 */}
                            <button
                                style={getReselectButtonStyle()}
                                onClick={handleReselectWards}
                            >
                                🔄 다시 선택
                            </button>
                        </>
                    )}
                    {/* 전국이 아닌 시/도가 선택되었지만 구/군이 선택되지 않은 경우에도 버튼 표시 */}
                    {selectedRegion && selectedRegion !== '전국' && selectedWards.length === 0 && (
                        <button
                            style={getReselectButtonStyle()}
                            onClick={handleReselectWards}
                        >
                            📍 구/군 선택
                        </button>
                    )}
                </div>

                <div style={{
                    fontSize: isMobile ? '11px' : '12px',
                    color: '#7f8c8d',
                    marginTop: '8px'
                }}>
                    {/* ✅ 수정: 빈 문자열 상태 처리 */}
                    {!selectedRegion ? (
                        '지역을 선택해주세요'
                    ) : selectedRegion === '전국' ? (
                        '전국 데이터를 표시합니다'
                    ) : selectedRegion && selectedWards.length === 0 ? (
                        `${selectedRegion} 전체 데이터를 표시합니다`
                    ) : selectedRegion && selectedWards.length > 0 ? (
                        `${selectedRegion} ${selectedWards.length}개 구/군 데이터를 표시합니다`
                    ) : (
                        '지역을 선택해주세요'
                    )}
                </div>

                
            </div>
            {/* 구/군 선택 모달 */}
            {showModal && (
                <div style={modalOverlayStyle} onClick={handleModalCancel}>
                    <div style={{
                        ...modalContentStyle,
                        maxWidth: isMobile ? '90vw' : '600px',
                        padding: isMobile ? '16px' : '24px'
                    }} onClick={(e) => e.stopPropagation()}>
                        {/* 모달 헤더 */}
                        <div style={modalHeaderStyle}>
                            <div>
                                <h3 style={{
                                    margin: 0,
                                    fontSize: isMobile ? '18px' : '20px',
                                    fontWeight: '600',
                                    color: '#2c3e50'
                                }}>
                                    🏘️ {selectedRegion} 구/군 선택
                                </h3>
                                <p style={{
                                    margin: '5px 0 0 0',
                                    fontSize: isMobile ? '11px' : '12px',
                                    color: '#7f8c8d'
                                }}>
                                    원하는 구/군을 선택하세요 (다중 선택 가능)
                                </p>
                            </div>
                            <button
                                onClick={handleModalCancel}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: isMobile ? '20px' : '24px',
                                    cursor: 'pointer',
                                    color: '#95a5a6',
                                    padding: '0',
                                    width: isMobile ? '24px' : '30px',
                                    height: isMobile ? '24px' : '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* 로딩 상태 */}
                        {wardsLoading ? (
                            <div style={{
                                textAlign: 'center',
                                padding: isMobile ? '30px' : '40px',
                                color: '#7f8c8d'
                            }}>
                                🔄 구/군 목록을 불러오는 중...
                            </div>
                        ) : (
                            <>
                                {/* 전체 선택 버튼 */}
                                <div style={{ marginBottom: '15px' }}>
                                    <button
                                        onClick={handleSelectAllInModal}
                                        style={{
                                            ...getModalButtonStyle(tempSelectedWards.length === wards.length, '#e74c3c'),
                                            fontSize: isMobile ? '13px' : '14px',
                                            padding: isMobile ? '8px 16px' : '10px 20px'
                                        }}
                                    >
                                        {tempSelectedWards.length === wards.length ? '전체 해제' : '전체 선택'}
                                    </button>
                                    <span style={{
                                        marginLeft: isMobile ? '8px' : '10px',
                                        fontSize: isMobile ? '11px' : '12px',
                                        color: '#7f8c8d'
                                    }}>
                                        ({tempSelectedWards.length}/{wards.length}개 선택됨)
                                    </span>
                                </div>

                                {/* 구/군 버튼들 */}
                                <div style={{
                                    ...modalButtonContainerStyle,
                                    maxHeight: isMobile ? '200px' : '300px',
                                    padding: isMobile ? '8px' : '10px'
                                }}>
                                    {wards.map((ward) => (
                                        <button
                                            key={ward}
                                            style={getModalButtonStyle(tempSelectedWards.includes(ward), '#27ae60')}
                                            onClick={() => handleModalWardToggle(ward)}
                                            onMouseEnter={(e) => {
                                                if (!tempSelectedWards.includes(ward)) {
                                                    e.target.style.backgroundColor = '#d5f4e6';
                                                    e.target.style.transform = 'translateY(-2px)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!tempSelectedWards.includes(ward)) {
                                                    e.target.style.backgroundColor = 'white';
                                                    e.target.style.transform = 'translateY(0)';
                                                }
                                            }}
                                        >
                                            {ward}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* 모달 푸터 */}
                        <div style={modalFooterStyle}>
                            <div style={{
                                fontSize: isMobile ? '11px' : '12px',
                                color: '#7f8c8d'
                            }}>
                                {tempSelectedWards.length > 0 ?
                                    `${tempSelectedWards.length}개 구/군이 선택되었습니다` :
                                    '선택된 구/군이 없습니다 (전체 지역이 대상)'
                                }
                            </div>
                            <div style={{ display: 'flex', gap: isMobile ? '6px' : '8px' }}>
                                <button
                                    onClick={handleModalCancel}
                                    style={{
                                        padding: isMobile ? '6px 12px' : '8px 16px',
                                        border: '2px solid #95a5a6',
                                        borderRadius: '8px',
                                        background: 'white',
                                        color: '#95a5a6',
                                        cursor: 'pointer',
                                        fontSize: isMobile ? '12px' : '14px',
                                        fontWeight: '500'
                                    }}
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleModalConfirm}
                                    style={{
                                        padding: isMobile ? '6px 12px' : '8px 16px',
                                        border: '2px solid #3498db',
                                        borderRadius: '8px',
                                        background: '#3498db',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: isMobile ? '12px' : '14px',
                                        fontWeight: '600'
                                    }}
                                >
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default RegionSelector;