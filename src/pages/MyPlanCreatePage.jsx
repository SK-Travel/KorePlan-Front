import React, { useState, useRef, useCallback } from 'react';
import Header from '../component/fragments/Header.jsx';
import CreateMyList from '../component/MyList/CreateMyList.jsx';
import SpotSearchModal from '../component/MyList/SpotSearchModal.jsx';
import WishlistModal from '../component/MyList/WishlistModal.jsx';
import DateSettingModal from '../component/MyList/DateSettingModal.jsx';


/// CSS 컴포넌트 ///
import {
    PageWrapper,
    BodyWrapper,
    Main,
    MainContent,
} from '../styles/EditPageStyle.js';

const MyPlanCreatePage = () => {
    // 모달 상태 관리
    const [spotSearchModal, setSpotSearchModal] = useState({
        open: false,
        currentLocations: []
    });
    
    const [wishlistModal, setWishlistModal] = useState({
        open: false,
        currentLocations: []
    });
    
    const [dateModal, setDateModal] = useState({
        open: false,
        startDate: null,
        endDate: null
    });

    // Day 선택 모달 상태
    const [daySelectionModal, setDaySelectionModal] = useState({
        open: false,
        selectedLocation: null,
        availableDays: [],
        source: null // 'search' 또는 'wishlist'
    });

    // EditMyList 컴포넌트의 함수들을 참조하기 위한 ref
    const addLocationRef = useRef(null);
    const updateDatesRef = useRef(null);
    const getPlanDataRef = useRef(null);

    // 중복 검사 개선: contentId + day + 위치 좌표로 더 정확한 중복 검사
    const getExcludeIdentifiers = useCallback((currentLocations) => {
        return currentLocations.map(loc => ({
            contentId: loc.contentId,
            day: loc.day,
            mapx: loc.mapx,
            mapy: loc.mapy,
            title: loc.title?.trim()
        }));
    }, []);

    // 사용 가능한 Day 목록 가져오기
    const getAvailableDays = useCallback(() => {
        if (getPlanDataRef.current) {
            const planData = getPlanDataRef.current();
            if (planData.startDate && planData.endDate) {
                const diffDays = planData.endDate.diff(planData.startDate, 'day') + 1;
                return Array.from({ length: diffDays }, (_, i) => i + 1);
            }
        }
        return [1, 2, 3]; // 기본값
    }, []);

    // 장소 검색 모달 열기
    const handleOpenSpotSearch = useCallback((data) => {
        console.log('🔍 장소 검색 모달 열기:', data);
        setSpotSearchModal({
            open: true,
            currentLocations: data.currentLocations
        });
    }, []);

    // 장소 검색 모달 닫기
    const handleCloseSpotSearch = useCallback(() => {
        setSpotSearchModal(prev => ({ ...prev, open: false }));
    }, []);

    // 검색에서 Day 선택 후 장소 추가 (더 간단한 방식)
    const handleLocationSelectFromSearch = useCallback((location, selectedDay) => {
        console.log('🎯 검색에서 장소 선택:', location, '선택된 Day:', selectedDay);
        
        if (addLocationRef.current) {
            addLocationRef.current(location, selectedDay);
        } else {
            console.error('❌ addLocationRef.current가 없습니다');
        }
    }, []);

    // 찜 목록 모달 열기
    const handleOpenWishlist = useCallback((data) => {
        console.log('💖 찜 목록 모달 열기:', data);
        setWishlistModal({
            open: true,
            currentLocations: data.currentLocations
        });
    }, []);

    // 찜 목록 모달 닫기
    const handleCloseWishlist = useCallback(() => {
        setWishlistModal(prev => ({ ...prev, open: false }));
    }, []);

    // 찜 목록에서 Day 선택 후 장소 추가 (더 간단한 방식)
    const handleLocationSelectFromWishlist = useCallback((location, selectedDay) => {
        console.log('💖 찜에서 장소 선택:', location, '선택된 Day:', selectedDay);
        
        if (addLocationRef.current) {
            addLocationRef.current(location, selectedDay);
        } else {
            console.error('❌ addLocationRef.current가 없습니다');
        }
    }, []);

    // 날짜 설정 모달 열기
    const handleOpenDateModal = useCallback((data) => {
        console.log('📅 날짜 모달 열기:', data);
        setDateModal({
            open: true,
            startDate: data.startDate,
            endDate: data.endDate
        });
    }, []);

    // 날짜 설정 모달 닫기
    const handleCloseDateModal = useCallback(() => {
        setDateModal(prev => ({ ...prev, open: false }));
    }, []);

    // 날짜 변경 적용
    const handleDateChange = useCallback((startDate, endDate) => {
        console.log('📅 날짜 변경:', { startDate, endDate });
        
        if (updateDatesRef.current) {
            updateDatesRef.current(startDate, endDate);
            
            // 상태 업데이트 후 모달 닫기
            setTimeout(() => {
                handleCloseDateModal();
            }, 100);
        } else {
            console.error('❌ updateDatesRef.current가 없습니다');
            handleCloseDateModal();
        }
    }, [handleCloseDateModal]);

    return (
        <PageWrapper>
            <Header />
            <BodyWrapper>
                <Main>
                    <MainContent>
                        {/* 여행 계획 수정 메인 컴포넌트 */}
                        {/* <CreateMyList 
                            onOpenSpotSearch={handleOpenSpotSearch}
                            onOpenWishlistModal={handleOpenWishlist}
                            onOpenDateModal={handleOpenDateModal}
                            onAddLocation={addLocationRef}
                            onUpdateDates={updateDatesRef}
                            onGetPlanData={getPlanDataRef}
                        /> */}
                        
                        {/* 장소 검색 모달 */}
                        <SpotSearchModal
                            open={spotSearchModal.open}
                            onClose={handleCloseSpotSearch}
                            onAddLocation={handleLocationSelectFromSearch}
                            currentLocations={spotSearchModal.currentLocations}
                            excludeIdentifiers={getExcludeIdentifiers(spotSearchModal.currentLocations)}
                        />
                        
                        {/* 찜 목록 모달 */}
                        <WishlistModal
                            open={wishlistModal.open}
                            onClose={handleCloseWishlist}
                            onAddLocation={handleLocationSelectFromWishlist}
                            currentLocations={wishlistModal.currentLocations}
                            excludeIdentifiers={getExcludeIdentifiers(wishlistModal.currentLocations)}
                        />
                        
                        {/* 날짜 설정 모달 */}
                        <DateSettingModal
                            open={dateModal.open}
                            onClose={handleCloseDateModal}
                            onUpdateDates={handleDateChange} // onDateChange → onUpdateDates로 맞춤
                            initialStartDate={dateModal.startDate}
                            initialEndDate={dateModal.endDate}
                        />

                        {/* Day 선택 모달은 각 검색/찜 모달 내부에서 처리 */}
                    </MainContent>
                </Main>
            </BodyWrapper>
            
        </PageWrapper>
    );
};

export default MyPlanCreatePage;