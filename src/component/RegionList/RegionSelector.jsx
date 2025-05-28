import React, { useEffect, useState } from 'react';

const RegionSelector = ({ onRegionChange, onWardChange, selectedRegion, selectedWard }) => {
    // 고정된 지역 목록 (하드코딩)
    const regions = [
        '전국', '서울특별시', '부산광역시', '대구광역시', '인천광역시', 
        '광주광역시', '대전광역시', '울산광역시', '세종특별자치시', 
        '경기도', '강원도', '충청북도', '충청남도', '전북특별자치도', 
        '전라남도', '경상북도', '경상남도', '제주특별자치도'
    ];

    const [wards, setWards] = useState([]);
    const [showWards, setShowWards] = useState(false);
    const [wardsLoading, setWardsLoading] = useState(false);

    // API 기본 URL
    const API_BASE_URL = 'http://localhost:8080/api/region-list';

    // 선택된 지역이 변경될 때 구/군 목록 로드
    useEffect(() => {
        if (selectedRegion && selectedRegion !== '전국') {
            loadWards(selectedRegion);
        } else {
            setWards([]);
            setShowWards(false);
        }
    }, [selectedRegion]);

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
                setShowWards(true);
                console.log(` ${regionName} 구/군 목록 로드:`, data.wards);
            } else {
                console.warn(` ${regionName}에 구/군 데이터가 없습니다.`);
                setWards([]);
                setShowWards(false);
            }
        } catch (error) {
            console.error(` ${regionName} 구/군 로드 실패:`, error.message);
            setWards([]);
            setShowWards(false);
        } finally {
            setWardsLoading(false);
        }
    };

    // 지역 버튼 클릭 핸들러
    const handleRegionClick = (regionName) => {
        console.log('🗺️ 지역 선택:', regionName);
        if (onRegionChange) {
            onRegionChange(regionName);
        }
    };

    // 구/군 버튼 클릭 핸들러
    const handleWardClick = (wardName) => {
        console.log('🏘️ 구/군 선택:', wardName);
        if (onWardChange) {
            onWardChange(wardName);
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

    // 섹션 스타일
    const sectionStyle = {
        marginBottom: '25px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid #e9ecef'
    };

    const titleStyle = {
        margin: '0 0 15px 0',
        fontSize: '18px',
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

    return (
        <div style={{
            width: '100%',
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <h2 style={{
                textAlign: 'center',
                margin: '0 0 30px 0',
                color: '#2c3e50',
                fontSize: '24px',
                fontWeight: '700'
            }}>
                🗺️ 지역 선택
            </h2>

            {/* 지역 선택 섹션 (하드코딩된 목록 사용) */}
            <div style={sectionStyle}>
                <h3 style={titleStyle}>
                    <span>📍</span>
                    시/도 선택
                    
                </h3>
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
            </div>

            {/* 구/군 선택 섹션 (API로 동적 로드) */}
            {selectedRegion && selectedRegion !== '전국' && (
                <div style={sectionStyle}>
                    <h3 style={titleStyle}>
                        <span>🏘️</span>
                        구/군 선택
                        <span style={{
                            fontSize: '12px',
                            color: '#7f8c8d',
                            fontWeight: '400',
                            marginLeft: '8px'
                        }}>
                            ({selectedRegion})
                        </span>
                        {wardsLoading && (
                            <span style={{
                                fontSize: '12px',
                                color: '#e67e22',
                                fontWeight: '400',
                                marginLeft: '8px',
                                backgroundColor: '#fef5e7',
                                padding: '2px 6px',
                                borderRadius: '10px'
                            }}>
                                로딩중...
                            </span>
                        )}
                    </h3>
                    
                    {wardsLoading ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '20px',
                            color: '#7f8c8d'
                        }}>
                            🔄 구/군 목록을 불러오는 중...
                        </div>
                    ) : showWards && wards.length > 0 ? (
                        <div style={buttonContainerStyle}>
                            {wards.map((ward) => (
                                <button
                                    key={ward}
                                    style={getButtonStyle(selectedWard === ward, '#27ae60')}
                                    onClick={() => handleWardClick(ward)}
                                    onMouseEnter={(e) => {
                                        if (selectedWard !== ward) {
                                            e.target.style.backgroundColor = '#d5f4e6';
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedWard !== ward) {
                                            e.target.style.backgroundColor = 'white';
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                        }
                                    }}
                                >
                                    {ward}
                                </button>
                            ))}
                        </div>
                    ) : (
                        !wardsLoading && (
                            <div style={{
                                textAlign: 'center',
                                padding: '20px',
                                color: '#95a5a6',
                                fontSize: '14px'
                            }}>
                                ⚠️ 해당 지역의 구/군 정보를 불러올 수 없습니다.
                                <br />
                                <span style={{ fontSize: '12px', marginTop: '5px', display: 'block' }}>
                                    (서버 연결을 확인해주세요)
                                </span>
                            </div>
                        )
                    )}
                </div>
            )}

            {/* 현재 선택 상태 표시 */}
            <div style={{
                padding: '15px',
                backgroundColor: '#e8f4f8',
                borderRadius: '10px',
                textAlign: 'center',
                marginTop: '20px',
                border: '1px solid #b8e0d2'
            }}>
                <div style={{
                    fontSize: '14px',
                    color: '#2c3e50',
                    fontWeight: '500'
                }}>
                    현재 선택: 
                    <strong style={{ color: '#3498db', marginLeft: '8px' }}>
                        {selectedRegion || '지역 미선택'}
                    </strong>
                    {selectedWard && selectedWard !== '전체' && (
                        <>
                            <span style={{ color: '#7f8c8d', margin: '0 4px' }}></span>
                            <strong style={{ color: '#27ae60' }}>
                                {selectedWard}
                            </strong>
                        </>
                    )}
                </div>
                
                {/* 상태 요약 */}
                <div style={{
                    fontSize: '12px',
                    color: '#7f8c8d',
                    marginTop: '8px'
                }}>
                    {selectedRegion === '전국' ? (
                        '전국 데이터를 표시합니다'
                    ) : selectedRegion && !selectedWard ? (
                        `${selectedRegion} 전체 데이터를 표시합니다`
                    ) : selectedRegion && selectedWard && selectedWard !== '전체' ? (
                        `${selectedRegion} ${selectedWard} 데이터를 표시합니다`
                    ) : selectedRegion && selectedWard === '전체' ? (
                        `${selectedRegion} 전체 데이터를 표시합니다`
                    ) : (
                        '지역을 선택해주세요'
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegionSelector;