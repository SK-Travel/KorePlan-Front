import React, { useState, useCallback } from 'react';
//CSS
import { 
    PageWrapper, 
    BodyWrapper,
    Main,
    MainContent,
} from '../styles/MainPageStyle'
//------------------------------------------
import Header from '../component/fragments/Header';
import FestivalHeader from '../component/Festival/FestivalHeader';
import FestivalCardList from '../component/Festival/FestivalCardList';
import ScrollToTop from '../component/Button/ScrollToTop';
import Footer from '../component/fragments/Footer';
const AllFestival = () => {
    // 필터 상태 관리
    const [filterState, setFilterState] = useState({
        selectedRegion: '전국',
        selectedCategory: '전체',
        selectedStatus: '',
        selectedMonth: '',
        searchKeyword: ''
    });

    // FestivalHeader에서 필터 변경시 호출되는 함수
    const handleFilterChange = useCallback((newFilterState) => {
        console.log('🔄 필터 변경:', newFilterState);
        setFilterState(newFilterState);
    }, []);

    return (
        <div>
            <PageWrapper>
                <Header />

                <BodyWrapper>
                    <Main>
                        <MainContent>
                            {/* 필터링 헤더 */}
                            <FestivalHeader 
                                onFilterChange={handleFilterChange}
                            />
                            
                            {/* 축제 카드 리스트 */}
                            <FestivalCardList
                                selectedRegion={filterState.selectedRegion}
                                selectedCategory={filterState.selectedCategory}
                                selectedStatus={filterState.selectedStatus}
                                selectedMonth={filterState.selectedMonth}
                                searchKeyword={filterState.searchKeyword}
                            />
                            <ScrollToTop/>
                        </MainContent>
                    </Main>
                </BodyWrapper>
                <Footer/>
            </PageWrapper>
        </div>
    );
};

export default AllFestival;