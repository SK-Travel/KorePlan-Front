import React, { useState } from 'react';
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
    const [selectedRegion, setSelectedRegion] = useState('전국');
    const [selectedWard, setSelectedWard] = useState([]); 
    const [selectedTheme, setSelectedTheme] = useState('관광지');

    // 지역 변경 핸들러
    const handleRegionChange = (region) => {
        console.log('🗺️ 지역 변경:', region);
        setSelectedRegion(region);
        setSelectedWard([]); //
    };

    // 구/군 변경 핸들러
    const handleWardChange = (ward) => {
        console.log('🏘️ 구/군 변경:', ward);
        setSelectedWard(ward); 
    };

    // 테마 변경 핸들러
    const handleThemeChange = (theme) => {
        console.log('🎯 테마 변경:', theme);
        setSelectedTheme(theme);
    };

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
                                selectedWards={selectedWard} // ✅ 복수형으로 변경
                            />

                            <ThemeSelector
                                onThemeChange={handleThemeChange}
                                selectedTheme={selectedTheme}
                            />
                        </div>

                        <DataCardList
                            selectedRegion={selectedRegion}
                            selectedWard={selectedWard} // 이 부분은 DataCardList 컴포넌트에 따라 달라질 수 있음
                            selectedTheme={selectedTheme}
                        />
                        <ScrollToTop/>
                    </MainContent>
                </Main>
            </BodyWrapper>
        </PageWrapper>
    );
};

export default RegionSearchPage;