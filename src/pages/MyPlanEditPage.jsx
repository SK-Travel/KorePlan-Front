import React, { useState, useRef } from 'react';
import Header from '../component/fragments/Header.jsx';
import Footer from '../component/fragments/Footer.jsx';
import ScrollToTop from '../component/Button/ScrollToTop.jsx';
import EditMyList from '../component/MyList/EditMyList.jsx';
// import SpotSearchModal from '../component/SpotSearchModal.jsx';
// import WishlistModal from '../component/WishlistModal.jsx';
// import DateSettingModal from '../component/DateSettingModal.jsx';

/// CSS 컴포넌트 ///
import {
    PageWrapper,
    BodyWrapper,
    Main,
    MainContent,
} from '../styles/MainPageStyle.js'

const MyPlanEditPage = () => {
    // 모달 상태 관리
    const [spotSearchModal, setSpotSearchModal] = useState({
        open: false,
        selectedDay: 1,
        currentLocations: []
    });
    
    const [wishlistModal, setWishlistModal] = useState({
        open: false,
        selectedDay: 1,
        currentLocations: []
    });
    
    const [dateModal, setDateModal] = useState({
        open: false,
        startDate: null,
        endDate: null
    });

    // EditMyList 컴포넌트의 함수들을 참조하기 위한 ref
    const addLocationRef = useRef(null);
    const updateDatesRef = useRef(null);

    // 장소 검색 모달 열기
    const handleOpenSpotSearch = (data) => {
        setSpotSearchModal({
            open: true,
            selectedDay: data.selectedDay,
            currentLocations: data.currentLocations
        });
    };

    // 장소 검색 모달 닫기
    const handleCloseSpotSearch = () => {
        setSpotSearchModal(prev => ({ ...prev, open: false }));
    };

    // 장소 검색에서 장소 선택
    const handleLocationSelectFromSearch = (location) => {
        if (addLocationRef.current) {
            addLocationRef.current(location, spotSearchModal.selectedDay);
        }
        handleCloseSpotSearch();
    };

    // 찜 목록 모달 열기
    const handleOpenWishlist = (data) => {
        setWishlistModal({
            open: true,
            selectedDay: data.selectedDay,
            currentLocations: data.currentLocations
        });
    };

    // 찜 목록 모달 닫기
    const handleCloseWishlist = () => {
        setWishlistModal(prev => ({ ...prev, open: false }));
    };

    // 찜 목록에서 장소 선택
    const handleLocationSelectFromWishlist = (location) => {
        if (addLocationRef.current) {
            addLocationRef.current(location, wishlistModal.selectedDay);
        }
        handleCloseWishlist();
    };

    // 날짜 설정 모달 열기
    const handleOpenDateModal = (data) => {
        setDateModal({
            open: true,
            startDate: data.startDate,
            endDate: data.endDate
        });
    };

    // 날짜 설정 모달 닫기
    const handleCloseDateModal = () => {
        setDateModal(prev => ({ ...prev, open: false }));
    };

    // 날짜 변경 적용
    const handleDateChange = (startDate, endDate) => {
        if (updateDatesRef.current) {
            updateDatesRef.current(startDate, endDate);
        }
        handleCloseDateModal();
    };

    return (
        <PageWrapper>
            <Header />
            <BodyWrapper>
                <Main>
                    <MainContent>
                        {/* 여행 계획 수정 메인 컴포넌트 */}
                        <EditMyList 
                            onOpenSpotSearch={handleOpenSpotSearch}
                            onOpenWishlistModal={handleOpenWishlist}
                            onOpenDateModal={handleOpenDateModal}
                            onAddLocation={addLocationRef}
                            onUpdateDates={updateDatesRef}
                        />
                        
                        {/* 장소 검색 모달 */}
                        {/* <SpotSearchModal
                            open={spotSearchModal.open}
                            onClose={handleCloseSpotSearch}
                            onLocationSelect={handleLocationSelectFromSearch}
                            selectedDay={spotSearchModal.selectedDay}
                            currentLocations={spotSearchModal.currentLocations}
                            excludeContentIds={spotSearchModal.currentLocations.map(loc => loc.contentId)}
                        /> */}
                        
                        {/* 찜 목록 모달 */}
                        {/* <WishlistModal
                            open={wishlistModal.open}
                            onClose={handleCloseWishlist}
                            onLocationSelect={handleLocationSelectFromWishlist}
                            selectedDay={wishlistModal.selectedDay}
                            currentLocations={wishlistModal.currentLocations}
                            excludeContentIds={wishlistModal.currentLocations.map(loc => loc.contentId)}
                        /> */}
                        
                        {/* 날짜 설정 모달 */}
                        {/* <DateSettingModal
                            open={dateModal.open}
                            onClose={handleCloseDateModal}
                            onDateChange={handleDateChange}
                            initialStartDate={dateModal.startDate}
                            initialEndDate={dateModal.endDate}
                        /> */}
                    </MainContent>
                </Main>
            </BodyWrapper>
            <Footer />
            <ScrollToTop />
        </PageWrapper>
    );
};

export default MyPlanEditPage;