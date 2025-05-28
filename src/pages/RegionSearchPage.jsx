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

const RegionSearchPage = () => {
    // 상태 관리
    const [selectedRegion, setSelectedRegion] = useState('전국');
    const [selectedWard, setSelectedWard] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('관광지');

    // 지역 변경 핸들러
    const handleRegionChange = (region) => {
        console.log('🗺️ 지역 변경:', region);
        setSelectedRegion(region);
        setSelectedWard(''); // 지역이 바뀌면 구/군 초기화
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
                        {/* 페이지 제목 컴포넌트 사용 */}
                        <PageTitle 
                        //나중에 아이콘 찾아서 추가하기.
                            //icon=""
                            title="지역별 여행 정보 검색"
                            subtitle="원하는 지역과 테마를 선택하여 맞춤형 여행 정보를 찾아보세요"
                        />

                        {/* 필터 영역 */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            marginBottom: '30px'
                        }}>
                            {/* 지역 선택 */}
                            <RegionSelector
                                onRegionChange={handleRegionChange}
                                onWardChange={handleWardChange}
                                selectedRegion={selectedRegion}
                                selectedWard={selectedWard}
                            />

                            {/* 테마 선택 */}
                            <ThemeSelector
                                onThemeChange={handleThemeChange}
                                selectedTheme={selectedTheme}
                            />
                        </div>

                        {/* 데이터 카드 리스트 (검색 조건과 결과 요약 포함) */}
                        <DataCardList
                            selectedRegion={selectedRegion}
                            selectedWard={selectedWard}
                            selectedTheme={selectedTheme}
                        />
                    </MainContent>
                </Main>
            </BodyWrapper>

            {/* <Footer /> */}
        </PageWrapper>
    );
};

export default RegionSearchPage;