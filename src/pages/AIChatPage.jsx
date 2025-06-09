import React, { useState } from 'react';
import { PageWrapper, BodyWrapper, Main, MainContent } from '../styles/MainPageStyle';
import Header from '../component/fragments/Header';
import TravelPlannerModal from '../component/AIChat/TravelPlannerModal';
import TravelMap from '../component/AIChat/TravelMap';
import RegionSelector from '../component/RegionList/RegionSelector';
import ThemeSelector from '../component/RegionList/ThemeSelector';

const AIChatPage = () => {
    const [planData, setPlanData] = useState([]); // GPT로부터 받은 여행 계획 데이터를 저장
        // 상태 관리
        const [selectedRegion, setSelectedRegion] = useState('전국');
        const [selectedTheme, setSelectedTheme] = useState('관광지');
    
        // 지역 변경 핸들러
        const handleRegionChange = (region) => {
            console.log('🗺️ 지역 변경:', region);
            setSelectedRegion(region);
        };
    
    
        // 테마 변경 핸들러
        const handleThemeChange = (theme) => {
            console.log('🎯 테마 변경:', theme);
            setSelectedTheme(theme);
        };

    return (
        <div>
            <PageWrapper>
                <Header />
                <Main>
                    <MainContent>
                        {/* 모달 컴포넌트 - 여행 조건 입력 */}
                        <RegionSelector
                            onRegionChange={handleRegionChange}
                        />
                        <ThemeSelector
                                onThemeChange={handleThemeChange}
                                selectedTheme={selectedTheme}
                        />
                        <TravelPlannerModal onPlanGenerated={setPlanData} />

                        {/* 지도 컴포넌트 - 여행 계획이 있을 경우에만 렌더링 */}
                        {planData.length > 0 && <TravelMap locations={planData} />}

                        {/* <Footer /> */}
                    </MainContent>
                </Main>
            </PageWrapper>
        </div>
    );
};

export default AIChatPage;