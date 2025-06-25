import React, { useState, useRef, useCallback } from 'react';
import Header from '../component/fragments/Header.jsx';
import EditMyList from '../component/MyList/EditMyList.jsx';

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

const MyPlanEditPage = () => {
    // 모달 상태 관리
    const [spotSearchModal, setSpotSearchModal] = useState({
        open: false,
        currentLocations: [],
        selectedDay: 1  // 👈 현재 선택된 Day 추가
    });
    
    const [wishlistModal, setWishlistModal] = useState({
        open: false,
        currentLocations: [],
        selectedDay: 1  // 👈 현재 선택된 Day 추가
    });
    
    const [dateModal, setDateModal] = useState({
        open: false,
        startDate: null,
        endDate: null
    });

    // 사용 가능한 날짜 상태 관리 추가
    const [availableDays, setAvailableDays] = useState([]);

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

    // 장소 검색 모달 열기
    const handleOpenSpotSearch = useCallback((data) => {
        console.log('🔍 장소 검색 모달 열기:', data);
        setSpotSearchModal({
            open: true,
            currentLocations: data.currentLocations,
            selectedDay: data.selectedDay  // 👈 현재 선택된 Day 저장
        });
    }, []);

    // 장소 검색 모달 닫기
    const handleCloseSpotSearch = useCallback(() => {
        setSpotSearchModal(prev => ({ ...prev, open: false }));
    }, []);

    // 검색에서 장소 선택 시 현재 선택된 Day에 바로 추가
    const handleLocationSelectFromSearch = useCallback((location) => {
        console.log('🎯 검색에서 장소 선택:', location, '현재 선택된 Day:', spotSearchModal.selectedDay);
        
        if (addLocationRef.current) {
            addLocationRef.current(location, spotSearchModal.selectedDay);
            alert(`Day ${spotSearchModal.selectedDay}에 ${location.title}이(가) 추가되었습니다!`);
        } else {
            console.error('❌ addLocationRef.current가 없습니다');
        }
    }, [spotSearchModal.selectedDay]);

    // 찜 목록 모달 열기
    const handleOpenWishlist = useCallback((data) => {
        console.log('💖 찜 목록 모달 열기:', data);
        setWishlistModal({
            open: true,
            currentLocations: data.currentLocations,
            selectedDay: data.selectedDay  // 👈 현재 선택된 Day 저장
        });
    }, []);

    // 찜 목록 모달 닫기
    const handleCloseWishlist = useCallback(() => {
        setWishlistModal(prev => ({ ...prev, open: false }));
    }, []);

    // 찜 목록에서 장소 선택 시 현재 선택된 Day에 바로 추가
    const handleLocationSelectFromWishlist = useCallback((location) => {
        console.log('💖 찜에서 장소 선택:', location, '현재 선택된 Day:', wishlistModal.selectedDay);
        
        if (addLocationRef.current) {
            addLocationRef.current(location, wishlistModal.selectedDay);
            alert(`Day ${wishlistModal.selectedDay}에 ${location.title}이(가) 추가되었습니다!`);
        } else {
            console.error('❌ addLocationRef.current가 없습니다');
        }
    }, [wishlistModal.selectedDay]);

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
        
        // 즉시 availableDays 계산 및 업데이트
        const diffDays = endDate.diff(startDate, 'day') + 1;
        const newAvailableDays = Array.from({ length: diffDays }, (_, i) => i + 1);
        console.log('📅 새로운 availableDays:', newAvailableDays);
        setAvailableDays(newAvailableDays);
        
        if (updateDatesRef.current) {
            updateDatesRef.current(startDate, endDate);
            
            // 모달 닫기
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
                        <EditMyList 
                            onOpenSpotSearch={handleOpenSpotSearch}
                            onOpenWishlistModal={handleOpenWishlist}
                            onOpenDateModal={handleOpenDateModal}
                            onAddLocation={addLocationRef}
                            onUpdateDates={updateDatesRef}
                            onGetPlanData={getPlanDataRef}
                            totalDays={availableDays.length}
                        />
                        
                        {/* 장소 검색 모달 */}
                        <SpotSearchModal
                            open={spotSearchModal.open}
                            onClose={handleCloseSpotSearch}
                            onAddLocation={handleLocationSelectFromSearch}  // 👈 Day 파라미터 제거
                            currentLocations={spotSearchModal.currentLocations}
                            excludeIdentifiers={getExcludeIdentifiers(spotSearchModal.currentLocations)}
                            selectedDay={spotSearchModal.selectedDay}  // 👈 현재 선택된 Day 전달
                        />
                        
                        {/* 찜 목록 모달 */}
                        <WishlistModal
                            open={wishlistModal.open}
                            onClose={handleCloseWishlist}
                            onAddLocation={handleLocationSelectFromWishlist}  // 👈 Day 파라미터 제거
                            currentLocations={wishlistModal.currentLocations}
                            excludeIdentifiers={getExcludeIdentifiers(wishlistModal.currentLocations)}
                            selectedDay={wishlistModal.selectedDay}  // 👈 현재 선택된 Day 전달
                        />
                        
                        {/* 날짜 설정 모달 */}
                        <DateSettingModal
                            open={dateModal.open}
                            onClose={handleCloseDateModal}
                            onUpdateDates={handleDateChange}
                            initialStartDate={dateModal.startDate}
                            initialEndDate={dateModal.endDate}
                        />
                    </MainContent>
                </Main>
            </BodyWrapper>
        </PageWrapper>
    );
};

export default MyPlanEditPage;