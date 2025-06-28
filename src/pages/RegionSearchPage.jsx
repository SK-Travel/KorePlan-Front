import React, { useState, useEffect, useCallback } from 'react';
import { useNavigationType } from 'react-router-dom';
import Header from '../component/fragments/Header.jsx';
import PageTitle from '../component/common/PageTitle.jsx';
import {
    PageWrapper,
    BodyWrapper,
    Main,
    MainContent,
} from '../styles/MainPageStyle.js'
import RegionSelector from '../component/RegionList/RegionSelector.jsx';
import ThemeSelector from '../component/RegionList/ThemeSelector.jsx';
import DataCardList from '../component/RegionList/DataCardList.jsx';
import ScrollToTop from '../component/Button/ScrollToTop.jsx';

const RegionSearchPage = () => {
    // 상태 관리
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedWard, setSelectedWard] = useState([]);
    const [selectedTheme, setSelectedTheme] = useState('');
    const [shouldLoadData, setShouldLoadData] = useState(false);
    
    // ✅ DataCardList 상태 관리 (부모에서 관리하여 SessionStorage에 저장)
    const [dataListState, setDataListState] = useState({
        dataList: [],
        totalCount: 0,
        currentPage: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false,
        selectedSort: 'SCORE',
        message: ''
    });

    // ✅ 브라우저 네비게이션 감지
    const navigationType = useNavigationType();

    // ✅ SessionStorage 키
    const SESSION_KEY = 'regionSearchPageData';

    // ✅ 현재 상태를 sessionStorage에 저장하는 함수
    const saveToSessionStorage = () => {
        const searchData = {
            selectedRegion,
            selectedWard,
            selectedTheme,
            shouldLoadData,
            dataListState, // ✅ 데이터 상태도 함께 저장
            timestamp: Date.now()
        };
        
        try {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(searchData));
            console.log('🔄 상태 저장됨:', {
                selections: { selectedRegion, selectedWard, selectedTheme },
                dataInfo: { 
                    count: searchData.dataListState.dataList.length, 
                    page: searchData.dataListState.currentPage,
                    total: searchData.dataListState.totalCount 
                }
            });
        } catch (error) {
            console.error('❌ SessionStorage 저장 실패:', error);
        }
    };

    // ✅ sessionStorage에서 상태를 복원하는 함수
    const restoreFromSessionStorage = () => {
        try {
            const saved = sessionStorage.getItem(SESSION_KEY);
            if (saved) {
                const searchData = JSON.parse(saved);
                
                // 저장된 시간이 30분 이내인지 확인
                const thirtyMinutes = 30 * 60 * 1000;
                const isRecent = Date.now() - searchData.timestamp < thirtyMinutes;
                
                if (isRecent) {
                    console.log('🔄 상태 복원됨:', {
                        selections: {
                            region: searchData.selectedRegion,
                            ward: searchData.selectedWard,
                            theme: searchData.selectedTheme
                        },
                        dataInfo: {
                            count: searchData.dataListState?.dataList?.length || 0,
                            page: searchData.dataListState?.currentPage || 0,
                            total: searchData.dataListState?.totalCount || 0
                        }
                    });
                    
                    setSelectedRegion(searchData.selectedRegion || '');
                    setSelectedWard(searchData.selectedWard || []);
                    setSelectedTheme(searchData.selectedTheme || '');
                    setShouldLoadData(searchData.shouldLoadData || false);
                    
                    // ✅ 데이터 상태도 복원
                    if (searchData.dataListState) {
                        setDataListState({
                            dataList: searchData.dataListState.dataList || [],
                            totalCount: searchData.dataListState.totalCount || 0,
                            currentPage: searchData.dataListState.currentPage || 0,
                            totalPages: searchData.dataListState.totalPages || 0,
                            hasNext: searchData.dataListState.hasNext || false,
                            hasPrevious: searchData.dataListState.hasPrevious || false,
                            selectedSort: searchData.dataListState.selectedSort || 'SCORE',
                            message: searchData.dataListState.message || ''
                        });
                    }
                    
                    return true; // 복원 성공
                } else {
                    console.log('⏰ 저장된 데이터가 너무 오래됨, 초기화');
                    sessionStorage.removeItem(SESSION_KEY);
                }
            }
        } catch (error) {
            console.error('❌ SessionStorage 복원 실패:', error);
            sessionStorage.removeItem(SESSION_KEY);
        }
        return false; // 복원 실패
    };

    // ✅ 브라우저 뒤로가기 감지 및 상태 복원
    useEffect(() => {
        if (navigationType === 'POP') {
            // 뒤로가기로 진입한 경우 상태 복원
            console.log('🔙 뒤로가기로 진입, 상태 복원 시도');
            const restored = restoreFromSessionStorage();
            
            if (!restored) {
                // 복원 실패 시 초기 상태로
                console.log('🔄 복원 실패, 초기 상태로 설정');
                initializeToDefault();
            }
        } else {
            // 직접 진입 또는 링크 클릭으로 온 경우 초기화
            console.log('🔗 직접 진입 또는 링크 클릭, 초기화');
            sessionStorage.removeItem(SESSION_KEY);
            initializeToDefault();
        }
    }, [navigationType]);

    // ✅ 초기 상태로 설정하는 함수
    const initializeToDefault = () => {
        setSelectedRegion('');
        setSelectedWard([]);
        setSelectedTheme('');
        setShouldLoadData(false);
        setDataListState({
            dataList: [],
            totalCount: 0,
            currentPage: 0,
            totalPages: 0,
            hasNext: false,
            hasPrevious: false,
            selectedSort: 'SCORE',
            message: ''
        });
    };

    // ✅ 상태가 변경될 때마다 sessionStorage에 저장
    useEffect(() => {
        // 초기 렌더링이 아니고, 유효한 선택이 있을 때만 저장
        if (selectedRegion || selectedTheme || dataListState.dataList.length > 0) {
            saveToSessionStorage();
        }
    }, [selectedRegion, selectedWard, selectedTheme, shouldLoadData, dataListState]);

    // ✅ DataCardList에서 상태 업데이트를 받는 콜백 (useCallback으로 메모이제이션)
    const handleDataListStateChange = useCallback((newState) => {
        console.log('📊 DataList 상태 업데이트:', {
            count: newState.dataList?.length || 0,
            page: newState.currentPage,
            total: newState.totalCount
        });
        setDataListState(newState);
    }, []); // 빈 의존성 배열로 함수 고정

    // ✅ 상세 페이지로 이동할 때 상태 저장
    const handleNavigateToDetail = () => {
        console.log('📱 상세 페이지로 이동, 상태 저장');
        saveToSessionStorage();
    };

    // 지역 변경 핸들러
    const handleRegionChange = (region) => {
        console.log('🗺️ 지역 변경:', region);
        setSelectedRegion(region);
        setSelectedWard([]); // 지역 변경 시 구/군 초기화
        setShouldLoadData(false); // 조회 상태 초기화
    };

    // 구/군 변경 핸들러
    const handleWardChange = (ward) => {
        console.log('🏘️ 구/군 변경:', ward);
        setSelectedWard(ward);
        setShouldLoadData(false); // 조회 상태 초기화
    };

    // 테마 변경 핸들러
    const handleThemeChange = (theme) => {
        console.log('🎯 테마 변경:', theme);
        setSelectedTheme(theme);
        setShouldLoadData(false); // 조회 상태 초기화
    };

    // 조회 버튼 핸들러
    const handleSearch = () => {
        // 필수 조건 검증
        if (!selectedRegion) {
            alert('지역을 선택해주세요.');
            return;
        }
        if (!selectedTheme) {
            alert('테마를 선택해주세요.');
            return;
        }
        
        console.log('🔍 조회 시작:', { selectedRegion, selectedWard, selectedTheme });
        setShouldLoadData(true);
    };

    // 조회 조건 검증 함수
    const isSearchReady = () => {
        return selectedRegion && selectedTheme;
    };

    // ✅ 페이지 언로드 시 상태 저장 (브라우저 새로고침, 탭 닫기 등)
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (selectedRegion || selectedTheme) {
                saveToSessionStorage();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [selectedRegion, selectedWard, selectedTheme, shouldLoadData]);

    return (
        <PageWrapper>
            <Header />
            
            <BodyWrapper>
                <Main>
                    <MainContent>
                        <PageTitle
                            title="지역별 여행 정보 검색"
                            subtitle="원하는 지역과 테마를 선택하여 맞춤형 여행 정보를 찾아보세요"
                        />

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            marginBottom: '30px'
                        }}>
                            <RegionSelector
                                onRegionChange={handleRegionChange}
                                onWardChange={handleWardChange}
                                selectedRegion={selectedRegion}
                                selectedWards={selectedWard}
                            />

                            <ThemeSelector
                                onThemeChange={handleThemeChange}
                                selectedTheme={selectedTheme}
                            />

                            {/* 조회 버튼 섹션 */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '25px',
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                gap: '20px'
                            }}>
                                {/* 현재 선택 조건 표시 */}
                                <div style={{
                                    fontSize: '14px',
                                    color: '#7f8c8d',
                                    textAlign: 'center'
                                }}>
                                    {isSearchReady() ? (
                                        <div>
                                            <div style={{ marginBottom: '5px' }}>
                                                📍 <strong style={{ color: '#3498db' }}>{selectedRegion}</strong>
                                                {selectedWard.length > 0 && (
                                                    <span> → <strong style={{ color: '#27ae60' }}>
                                                        {selectedWard.length === 1 ? selectedWard[0] : `${selectedWard[0]} 외 ${selectedWard.length - 1}개`}
                                                    </strong></span>
                                                )}
                                            </div>
                                            <div>
                                                🎯 <strong style={{ color: '#e74c3c' }}>{selectedTheme}</strong> 정보를 조회할 준비가 되었습니다
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ color: '#95a5a6' }}>
                                            {!selectedRegion && !selectedTheme ? '지역과 테마를 선택해주세요' :
                                             !selectedRegion ? '지역을 선택해주세요' :
                                             !selectedTheme ? '테마를 선택해주세요' : ''}
                                        </div>
                                    )}
                                </div>

                                {/* 조회 버튼 */}
                                <button
                                    onClick={handleSearch}
                                    disabled={!isSearchReady()}
                                    style={{
                                        padding: '15px 30px',
                                        fontSize: '16px',
                                        fontWeight: '700',
                                        borderRadius: '25px',
                                        border: 'none',
                                        backgroundColor: isSearchReady() ? '#3498db' : '#bdc3c7',
                                        color: 'white',
                                        cursor: isSearchReady() ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.3s ease',
                                        boxShadow: isSearchReady() ? '0 6px 20px rgba(52, 152, 219, 0.4)' : 'none',
                                        transform: isSearchReady() ? 'translateY(0)' : 'none',
                                        minWidth: '140px'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (isSearchReady()) {
                                            e.target.style.backgroundColor = '#2980b9';
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 8px 25px rgba(52, 152, 219, 0.5)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (isSearchReady()) {
                                            e.target.style.backgroundColor = '#3498db';
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.4)';
                                        }
                                    }}
                                >
                                    🔍 조회하기
                                </button>
                            </div>
                        </div>

                        {/* shouldLoadData가 true일 때만 DataCardList 렌더링 */}
                        {shouldLoadData ? (
                            <DataCardList
                                selectedRegion={selectedRegion}
                                selectedWard={selectedWard}
                                selectedTheme={selectedTheme}
                                shouldLoadData={shouldLoadData}
                                onNavigateToDetail={handleNavigateToDetail}
                                // ✅ 상태 복원을 위한 props 추가
                                initialDataListState={dataListState}
                                onStateChange={handleDataListStateChange}
                            />
                        ) : (
                            /* 초기 안내 화면 */
                            <div style={{
                                backgroundColor: 'white',
                                padding: '60px 20px',
                                borderRadius: '16px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '64px', marginBottom: '20px' }}>🗺️</div>
                                <h3 style={{
                                    fontSize: '24px',
                                    color: '#2c3e50',
                                    marginBottom: '15px',
                                    fontWeight: '600'
                                }}>
                                    여행 정보를 검색해보세요
                                </h3>
                                <p style={{
                                    fontSize: '16px',
                                    color: '#7f8c8d',
                                    lineHeight: '1.6',
                                    maxWidth: '500px',
                                    margin: '0 auto'
                                }}>
                                    위에서 지역과 테마를 선택한 후<br/>
                                    <strong style={{ color: '#3498db' }}>조회하기 버튼</strong>을 눌러주세요
                                </p>
                                
                                {/* ✅ 복원된 상태가 있다면 안내 메시지 표시 */}
                                {(selectedRegion || selectedTheme) && (
                                    <div style={{
                                        marginTop: '20px',
                                        padding: '15px',
                                        backgroundColor: '#e8f4f8',
                                        borderRadius: '10px',
                                        border: '1px solid #b8e0d2',
                                        display: 'inline-block'
                                    }}>
                                        <div style={{ fontSize: '14px', color: '#2c3e50', marginBottom: '5px' }}>
                                            🔄 이전 선택 상태가 복원되었습니다
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                                            {selectedRegion && `지역: ${selectedRegion}`}
                                            {selectedRegion && selectedTheme && ' | '}
                                            {selectedTheme && `테마: ${selectedTheme}`}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <ScrollToTop />
                    </MainContent>
                </Main>
            </BodyWrapper>
        </PageWrapper>
    );
};

export default RegionSearchPage;