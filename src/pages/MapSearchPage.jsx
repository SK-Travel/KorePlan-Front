// pages/MapSearch.jsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigationType } from 'react-router-dom';
import axios from 'axios';
import Header from '../component/fragments/Header.jsx';
import {
    PageWrapper,
    BodyWrapper,
    Main,
    MainContent,
} from '../styles/EditPageStyle.js';
import SearchBar from '../component/Search/SearchBar.jsx';
import NaverMap from '../component/Search/NaverMap.jsx';
import SearchPanel from '../component/Search/SearchPanel.jsx';

const MapSearch = () => {
    const navigationType = useNavigationType(); // 현재 진입 방식 (POP이면 뒤로가기)

    // 기존 상태들
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [likedPlaces, setLikedPlaces] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isPanelOpen, setIsPanelOpen] = useState(true);
    const [currentLocation, setCurrentLocation] = useState(null);

    // 테마 검색용 상태들
    const [themeSearchResults, setThemeSearchResults] = useState([]);
    const [isThemeLoading, setIsThemeLoading] = useState(false);
    const [isThemeMode, setIsThemeMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMoreData, setHasMoreData] = useState(true);

    // 지도 인스턴스 ref 추가
    const mapInstanceRef = useRef(null);

    // 상태 저장 함수
    const saveMapSearchState = useCallback(() => {
        const mapSearchState = {
            searchQuery,
            selectedTheme,
            searchResults,
            selectedPlace,
            isPanelOpen,
            currentLocation,
            themeSearchResults,
            isThemeMode,
            currentPage,
            hasMoreData,
            // 지도 중심점과 줌 레벨도 저장
            mapCenter: mapInstanceRef.current ? {
                lat: mapInstanceRef.current.getCenter().lat(),
                lng: mapInstanceRef.current.getCenter().lng()
            } : null,
            mapZoom: mapInstanceRef.current ? mapInstanceRef.current.getZoom() : null,
            timestamp: Date.now()
        };

        sessionStorage.setItem("mapSearchState", JSON.stringify(mapSearchState));
        console.log('📱 지도 검색 상태 저장됨:', mapSearchState);
    }, [
        searchQuery, selectedTheme, searchResults, selectedPlace, isPanelOpen,
        currentLocation, themeSearchResults, isThemeMode, currentPage, hasMoreData
    ]);

    // 상태 복원 함수
    const restoreMapSearchState = useCallback(() => {
        const saved = sessionStorage.getItem("mapSearchState");
        if (saved) {
            try {
                const savedState = JSON.parse(saved);

                // 5분 이내의 데이터만 복원 (선택사항)
                const isRecent = Date.now() - savedState.timestamp < 5 * 60 * 1000;
                if (!isRecent) {
                    console.log('⏰ 저장된 상태가 너무 오래됨, 초기화');
                    sessionStorage.removeItem("mapSearchState");
                    return false;
                }

                console.log('🔄 지도 검색 상태 복원 중:', savedState);

                // 상태 복원
                setSearchQuery(savedState.searchQuery || '');
                setSelectedTheme(savedState.selectedTheme || null);
                setSearchResults(savedState.searchResults || []);
                setSelectedPlace(savedState.selectedPlace || null);
                setIsPanelOpen(savedState.isPanelOpen !== undefined ? savedState.isPanelOpen : true);
                setCurrentLocation(savedState.currentLocation || null);
                setThemeSearchResults(savedState.themeSearchResults || []);
                setIsThemeMode(savedState.isThemeMode || false);
                setCurrentPage(savedState.currentPage || 0);
                setHasMoreData(savedState.hasMoreData !== undefined ? savedState.hasMoreData : true);

                // 지도 상태도 복원 (지도가 로드된 후에)
                if (savedState.mapCenter && savedState.mapZoom) {
                    setTimeout(() => {
                        if (mapInstanceRef.current && window.naver) {
                            mapInstanceRef.current.setCenter(
                                new window.naver.maps.LatLng(savedState.mapCenter.lat, savedState.mapCenter.lng)
                            );
                            mapInstanceRef.current.setZoom(savedState.mapZoom);
                        }
                    }, 500); // 지도 로딩 대기
                }

                console.log('✅ 지도 검색 상태 복원 완료');
                return true;
            } catch (error) {
                console.error('❌ 상태 복원 실패:', error);
                sessionStorage.removeItem("mapSearchState");
                return false;
            }
        }
        return false;
    }, []);

    // 뒤로가기 감지 및 상태 복원/초기화
    useEffect(() => {
        if (navigationType === 'POP') {
            // 뒤로가기일 때만 상태 복원
            console.log('🔙 뒤로가기 감지됨 - 상태 복원 시도');
            const restored = restoreMapSearchState();
            if (!restored) {
                // 복원 실패 시 찜한 장소만 로드
                loadLikedPlaces();
            }
        } else {
            // 직접 진입 or 링크 클릭으로 온 경우에는 초기화
            console.log('🆕 새로운 진입 - 상태 초기화');
            sessionStorage.removeItem("mapSearchState");
            // 초기 로딩
            loadLikedPlaces();
        }
    }, [navigationType, restoreMapSearchState]);

    // 상태 변경 시 자동 저장 (상세페이지로 넘어가기 전에 저장)
    useEffect(() => {
        // 의미있는 상태가 있을 때만 저장
        if (searchQuery || selectedTheme || searchResults.length > 0 || themeSearchResults.length > 0) {
            const timeoutId = setTimeout(() => {
                saveMapSearchState();
            }, 1000); // 1초 디바운스

            return () => clearTimeout(timeoutId);
        }
    }, [saveMapSearchState, searchQuery, selectedTheme, searchResults, themeSearchResults, selectedPlace]);

    // 컴포넌트 언마운트 시에도 상태 저장
    useEffect(() => {
        return () => {
            // 언마운트 시에도 현재 상태 저장
            if (searchQuery || selectedTheme || searchResults.length > 0 || themeSearchResults.length > 0) {
                const mapSearchState = {
                    searchQuery,
                    selectedTheme,
                    searchResults,
                    selectedPlace,
                    isPanelOpen,
                    currentLocation,
                    themeSearchResults,
                    isThemeMode,
                    currentPage,
                    hasMoreData,
                    mapCenter: mapInstanceRef.current ? {
                        lat: mapInstanceRef.current.getCenter().lat(),
                        lng: mapInstanceRef.current.getCenter().lng()
                    } : null,
                    mapZoom: mapInstanceRef.current ? mapInstanceRef.current.getZoom() : null,
                    timestamp: Date.now()
                };
                sessionStorage.setItem("mapSearchState", JSON.stringify(mapSearchState));
                console.log('🔚 컴포넌트 언마운트 - 상태 저장됨');
            }
        };
    }, []);

    // 지도 중심점 가져오기 함수
    const getMapCenter = useCallback(() => {
        if (mapInstanceRef.current && window.naver) {
            const center = mapInstanceRef.current.getCenter();
            return {
                lat: center.lat(),
                lng: center.lng()
            };
        }
        return currentLocation || { lat: 37.5665, lng: 126.9780 };
    }, [currentLocation]);

    // 찜한 장소 목록 불러오기
    const loadLikedPlaces = useCallback(async () => {
        try {
            console.log('찜한 장소 불러오기 시작...');

            const response = await axios.get('/api/like/all-liked-places', {
                withCredentials: true
            });

            console.log('찜한 장소 API 응답:', response.data);

            if (response.data.code === 200) {
                const likedPlaces = response.data.allLikedPlaces.map(place => ({
                    id: place.id,
                    contentId: place.contentId,
                    title: place.title,
                    addr1: place.addr1,
                    addr2: place.addr2,
                    mapy: parseFloat(place.mapy),
                    mapx: parseFloat(place.mapx),
                    firstImage: place.firstimage,
                    firstImage2: place.firstimage2,
                    tel: place.tel,
                    theme: place.theme,
                    regionName: place.regionName,
                    regionCode: place.regionCode,
                    wardName: place.wardName,
                    wardCode: place.wardCode,
                    viewCount: place.viewCount,
                    likeCount: place.likeCount,
                    reviewCount: place.reviewCount,
                    rating: place.rating,
                    score: place.score,
                    isBookmarked: true
                }));

                setLikedPlaces(likedPlaces);

                console.log('✅ 찜한 장소 불러오기 성공:', likedPlaces.length + '개');
            } else if (response.data.code === 401) {
                console.warn('🔒 로그인이 필요합니다:', response.data.error_message);
                setLikedPlaces([]);
            }
        } catch (error) {
            console.error('❌ 찜한 장소 불러오기 실패:', error);
            setLikedPlaces([]);
        }
    }, []);

    // 검색 결과의 찜 상태 확인
    const updateSearchResultsWithLikeStatus = useCallback(async (searchResults) => {
        try {
            const dataIds = searchResults.map(place => place.id).filter(id => id != null);

            if (dataIds.length === 0) return searchResults;

            const response = await axios.post('/api/like/check-status', {
                dataIds: dataIds
            }, {
                withCredentials: true
            });

            if (response.data.code === 200) {
                const likeStatusMap = response.data.likeStatusMap;

                const updatedResults = searchResults.map(place => ({
                    ...place,
                    isBookmarked: likeStatusMap[place.id] || false
                }));

                return updatedResults;
            }
        } catch (error) {
            console.warn('찜 상태 확인 실패, 기본값 사용:', error);
        }

        return searchResults;
    }, []);

    // 키워드 검색
    const handleSearch = useCallback(async (query = searchQuery, page = 0, isLoadMore = false) => {
        if (!query.trim()) {
            setSearchResults([]);
            setIsThemeMode(false);
            return;
        }

        setLoading(true);

        // 새 검색인 경우에만 상태 초기화
        if (!isLoadMore) {
            setIsThemeMode(false);
            setSelectedTheme(null);
            setSearchResults([]);
            setCurrentPage(0);
            setHasMoreData(true);
        }

        try {
            console.log('키워드 검색 시작:', query, '페이지:', page);

            const response = await axios.get('/api/map-search/keyword', {
                params: {
                    keyword: query.trim(),
                    sort: 'SCORE',
                    page: page,
                    size: 10
                },
                timeout: 15000
            });

            console.log('키워드 검색 API 응답:', response.status, response.data);

            if (response.data.code === 200) {
                const searchResults = response.data.result || [];

                const convertedResults = searchResults.map(item => ({
                    id: item.id,
                    contentId: item.dataId || item.contentId,
                    title: item.title,
                    addr1: item.addr1 || '',
                    addr2: item.addr2 || '',
                    mapy: parseFloat(item.mapy) || 37.5665,
                    mapx: parseFloat(item.mapx) || 126.9780,
                    firstImage: item.firstImage || item.firstimage || '',
                    firstImage2: item.firstImage2 || item.firstimage2 || '',
                    theme: item.theme || item.contentTypeId || 12,
                    tel: item.tel || '',
                    regionName: item.regionName || '',
                    regionCode: item.regionCode,
                    wardName: item.wardName || '',
                    wardCode: item.wardCode,
                    viewCount: item.viewCount || 0,
                    likeCount: item.likeCount || 0,
                    reviewCount: item.reviewCount || 0,
                    rating: item.rating || 0,
                    score: item.score || 0,
                    isBookmarked: false,
                    dist: item.dist || 0
                }));

                const resultsWithLikeStatus = await updateSearchResultsWithLikeStatus(convertedResults);

                if (isLoadMore) {
                    console.log('키워드 검색 더보기 모드');
                    setSearchResults(prev => {
                        const existingIds = new Set(prev.map(item => item.id));
                        const uniqueNewResults = resultsWithLikeStatus.filter(item => !existingIds.has(item.id));
                        const newResults = [...prev, ...uniqueNewResults];
                        console.log(`전체 검색 결과: ${prev.length} + ${uniqueNewResults.length} = ${newResults.length} (중복 ${resultsWithLikeStatus.length - uniqueNewResults.length}개 제거)`);
                        return newResults;
                    });
                } else {
                    console.log('새 키워드 검색');
                    setSearchResults(resultsWithLikeStatus);
                    if (resultsWithLikeStatus.length > 0) {
                        setSelectedPlace(resultsWithLikeStatus[0]);
                    } else {
                        setSelectedPlace(null);
                    }
                }

                setCurrentPage(page);
                if (response.data.pagination) {
                    setHasMoreData(response.data.pagination.hasNext);
                    console.log('키워드 검색 페이징:', response.data.pagination);
                } else {
                    setHasMoreData(resultsWithLikeStatus.length >= 10);
                }

                console.log('키워드 검색 성공:', resultsWithLikeStatus.length + '개 결과');
            } else {
                console.error('키워드 검색 실패:', response.data.message);
                if (!isLoadMore) {
                    setSearchResults([]);
                }
            }
        } catch (error) {
            console.error('키워드 검색 API 호출 실패:', error);
            if (!isLoadMore) {
                setSearchResults([]);
            }
        } finally {
            setLoading(false);
        }
    }, [searchQuery, updateSearchResultsWithLikeStatus]);

    // 키워드 검색 더보기 처리
    const handleKeywordLoadMore = useCallback(() => {
        console.log('키워드 검색 더보기 버튼 클릭');
        console.log('현재 검색 상태:', {
            searchQuery: searchQuery.trim(),
            currentPage,
            hasMoreData,
            isLoading: loading,
            resultCount: searchResults.length
        });

        if (searchQuery.trim() && hasMoreData && !loading) {
            const nextPage = currentPage + 1;
            console.log(`키워드 검색 다음 페이지 요청: ${nextPage}`);
            handleSearch(searchQuery, nextPage, true);
        }
    }, [searchQuery, currentPage, hasMoreData, loading, searchResults.length, handleSearch]);

    // 테마별 주변 장소 검색 API 호출
    // MapSearch.jsx의 searchNearbyPlacesByTheme 함수 수정

    const searchNearbyPlacesByTheme = useCallback(async (theme, page = 0, isLoadMore = false, shouldToggle = true) => {
        try {
            console.log(`테마 ${theme} 검색 시작 - 페이지: ${page}, isLoadMore: ${isLoadMore}, shouldToggle: ${shouldToggle}`);

            if (selectedTheme === theme && page === 0 && !isLoadMore && shouldToggle) {
                setSelectedTheme(null);
                setThemeSearchResults([]);
                setIsThemeMode(false);
                setCurrentPage(0);
                setHasMoreData(true);
                return;
            }

            setIsThemeLoading(true);

            if (!isLoadMore) {
                setSelectedTheme(theme);
                setIsThemeMode(true);
                setCurrentPage(0);
                setThemeSearchResults([]);
                setHasMoreData(true);
            }

            const mapCenter = getMapCenter();
            const lat = mapCenter.lat;
            const lng = mapCenter.lng;

            console.log('검색 기준 좌표 (지도 중심점):', { lat, lng });

            const apiUrl = `/api/map-search/nearby?lat=${lat}&lng=${lng}&theme=${theme}&radius=5000&page=${page}&size=10`;
            console.log('API 호출 URL:', apiUrl);

            const response = await fetch(apiUrl);

            console.log('API 응답 상태:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API 에러 응답:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            console.log('API 응답 데이터:', data);
            console.log('페이징 정보:', data.pagination);

            if (data.code === 200) {
                const searchResults = data.result || [];

                // 축제인 경우와 일반 장소인 경우 데이터 변환 분기
                const convertedResults = searchResults.map(item => {
                    if (theme === 15) {
                        // 축제 데이터 변환 (FestivalResponseDto 구조)
                        return {
                            id: item.contentId, // FestivalResponseDto는 Long id가 없으므로 contentId 사용
                            contentId: item.contentId,
                            title: item.title,
                            addr1: item.addr1 || '',
                            addr2: item.addr2 || '',
                            mapy: parseFloat(item.mapy) || 37.5665,
                            mapx: parseFloat(item.mapx) || 126.9780,
                            firstImage: item.firstimage || '',
                            firstImage2: item.firstimage2 || '',
                            theme: 15, // 축제는 항상 15
                            tel: '정보없음', // 축제는 전화번호 필드가 없음
                            regionName: item.regionName || '',
                            regionCode: item.regionCode,
                            wardName: item.wardName || '',
                            wardCode: item.wardCode,
                            viewCount: item.viewCount || 0,
                            likeCount: 0, // 축제는 찜 기능 없음
                            reviewCount: 0, // 축제는 리뷰 기능 없음
                            rating: 0, // 축제는 평점 기능 없음
                            score: 0, // 축제는 점수 기능 없음
                            isBookmarked: false, // 축제는 찜 기능 없음
                            dist: 0,
                            // 축제 전용 필드들 (상세페이지용)
                            eventStartDate: item.eventStartDate,
                            eventEndDate: item.eventEndDate,
                            overview: item.overview,
                            status: item.status,
                            homepage: item.homepage,
                            c2Name: item.c2Name
                        };
                    } else {
                        // 일반 장소 데이터 변환 (기존 로직)
                        return {
                            id: item.id,
                            contentId: item.dataId || item.contentId,
                            title: item.title,
                            addr1: item.addr1 || '',
                            addr2: item.addr2 || '',
                            mapy: parseFloat(item.mapy) || 37.5665,
                            mapx: parseFloat(item.mapx) || 126.9780,
                            firstImage: item.firstImage || item.firstimage || '',
                            firstImage2: item.firstImage2 || item.firstimage2 || '',
                            theme: item.theme || item.contentTypeId || 12,
                            tel: item.tel || '',
                            regionName: item.regionName || '',
                            regionCode: item.regionCode,
                            wardName: item.wardName || '',
                            wardCode: item.wardCode,
                            viewCount: item.viewCount || 0,
                            likeCount: item.likeCount || 0,
                            reviewCount: item.reviewCount || 0,
                            rating: item.rating || 0,
                            score: item.score || 0,
                            isBookmarked: false,
                            dist: item.dist || 0
                        };
                    }
                });

                // 축제는 찜 상태 확인 불필요, 일반 장소만 확인
                let resultsWithLikeStatus;
                if (theme === 15) {
                    resultsWithLikeStatus = convertedResults; // 축제는 찜 상태 확인 생략
                } else {
                    resultsWithLikeStatus = await updateSearchResultsWithLikeStatus(convertedResults);
                }

                if (isLoadMore) {
                    console.log('테마 검색 더보기 모드');
                    setThemeSearchResults(prev => {
                        const existingIds = new Set(prev.map(item => item.id));
                        const uniqueNewResults = resultsWithLikeStatus.filter(item => !existingIds.has(item.id));
                        const newResults = [...prev, ...uniqueNewResults];
                        console.log(`전체 결과 개수: ${prev.length} + ${uniqueNewResults.length} = ${newResults.length} (중복 ${resultsWithLikeStatus.length - uniqueNewResults.length}개 제거)`);
                        return newResults;
                    });
                } else {
                    console.log('새 테마 검색');
                    setThemeSearchResults(resultsWithLikeStatus);
                    if (resultsWithLikeStatus.length > 0) {
                        setSelectedPlace(resultsWithLikeStatus[0]);
                    } else {
                        setSelectedPlace(null);
                    }
                }

                setCurrentPage(page);
                if (data.pagination) {
                    console.log('테마 검색 페이징:', data.pagination);
                    setHasMoreData(data.pagination.hasNext);
                } else {
                    console.log('페이징 정보 없음, fallback 로직 사용');
                    setHasMoreData(resultsWithLikeStatus.length >= 10);
                }

                console.log(`테마 검색 성공: ${resultsWithLikeStatus.length}개 결과 (페이지: ${page}), hasMore: ${data.pagination?.hasNext || resultsWithLikeStatus.length >= 10}`);

            } else {
                throw new Error(data.message || '테마 검색에 실패했습니다.');
            }
        } catch (error) {
            console.error('테마 검색 오류:', error);
            alert(`검색 실패: ${error.message}`);
            if (!isLoadMore) {
                setThemeSearchResults([]);
            }
        } finally {
            setIsThemeLoading(false);
        }
    }, [selectedTheme, updateSearchResultsWithLikeStatus, getMapCenter]);

    // 테마 검색 더보기 버튼 클릭
    const handleThemeLoadMore = useCallback(() => {
        console.log('더보기 버튼 클릭');
        console.log('현재 상태:', {
            selectedTheme,
            currentPage,
            hasMoreData,
            isThemeLoading,
            resultCount: themeSearchResults.length
        });

        if (selectedTheme && hasMoreData && !isThemeLoading) {
            const nextPage = currentPage + 1;
            console.log(`다음 페이지 요청: ${nextPage}`);
            searchNearbyPlacesByTheme(selectedTheme, nextPage, true, false);
        } else {
            console.log('더보기 조건 불만족:', {
                hasSelectedTheme: !!selectedTheme,
                hasMoreData,
                isNotLoading: !isThemeLoading
            });
        }
    }, [selectedTheme, currentPage, hasMoreData, isThemeLoading, themeSearchResults.length, searchNearbyPlacesByTheme]);

    // 현재 위치에서 테마 재검색 (패널에서 호출)
    const handleRefreshThemeSearch = useCallback(() => {
        console.log('패널에서 테마 재검색 요청:', selectedTheme);

        if (selectedTheme) {
            searchNearbyPlacesByTheme(selectedTheme, 0, false, false);
        }
    }, [selectedTheme, searchNearbyPlacesByTheme]);

    // 찜하기 처리
    const handleBookmark = async (dataId) => {
        try {
            console.log('찜하기 토글 시작:', dataId);

            const response = await axios.post(`/api/like/${dataId}`, {}, {
                withCredentials: true
            });

            console.log('찜하기 API 응답:', response.data);

            if (response.data.code === 200) {
                const isLiked = response.data.likeStatus;

                setSearchResults(prev =>
                    prev.map(place =>
                        place.id === dataId
                            ? { ...place, isBookmarked: isLiked }
                            : place
                    )
                );

                setThemeSearchResults(prev =>
                    prev.map(place =>
                        place.id === dataId
                            ? { ...place, isBookmarked: isLiked }
                            : place
                    )
                );

                await loadLikedPlaces();

                console.log(isLiked ? '✅ 찜하기 추가' : '➖ 찜하기 해제', dataId);
            } else if (response.data.code === 401) {
                console.warn('🔒 로그인이 필요합니다:', response.data.error_message);
                alert('로그인이 필요한 기능입니다.');
            }
        } catch (error) {
            console.error('❌ 찜하기 실패:', error);

            if (error.response?.status === 401) {
                alert('로그인이 필요한 기능입니다.');
            }
        }
    };

    // 장소 선택 처리 (리스트에서 클릭 시)
    const handlePlaceSelect = (place) => {
        console.log('리스트 아이템 클릭:', place.title, place.id);
        setSelectedPlace(place);
    };

    // 검색어 변경 처리
    const handleSearchQueryChange = (query) => {
        setSearchQuery(query);
    };

    // 검색어 초기화
    const handleSearchClear = () => {
        setSearchQuery('');
        setSearchResults([]);
        setIsThemeMode(false);
        setSelectedTheme(null);
        setCurrentPage(0);
        setHasMoreData(true);
        setSelectedPlace(null);
    };

    // 패널 토글
    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    // 현재 위치 업데이트
    const handleCurrentLocationUpdate = (location) => {
        setCurrentLocation(location);
    };

    return (
        <PageWrapper>
            <Header />
            <BodyWrapper>
                <Main>
                    <MainContent>
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            height: 'calc(100vh - 143px)',
                            overflow: 'hidden',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                        }}>
                            {/* 지도 컴포넌트 */}
                            <NaverMap
                                selectedPlace={selectedPlace}
                                searchResults={searchResults}
                                themeSearchResults={themeSearchResults}
                                likedPlaces={likedPlaces}
                                isThemeMode={isThemeMode}
                                selectedTheme={selectedTheme}
                                onPlaceSelect={handlePlaceSelect}
                                onCurrentLocationUpdate={handleCurrentLocationUpdate}
                                isPanelOpen={isPanelOpen}
                                loadLikedPlaces={loadLikedPlaces}
                                mapInstanceRef={mapInstanceRef}
                            />

                            {/* 검색바 컴포넌트 */}
                            <SearchBar
                                searchQuery={searchQuery}
                                onSearchQueryChange={handleSearchQueryChange}
                                onSearch={handleSearch}
                                onClear={handleSearchClear}
                                isPanelOpen={isPanelOpen}
                            />

                            {/* 검색 패널 컴포넌트 */}
                            <SearchPanel
                                isPanelOpen={isPanelOpen}
                                onTogglePanel={togglePanel}
                                selectedTheme={selectedTheme}
                                isThemeLoading={isThemeLoading}
                                onThemeSelect={(theme) => searchNearbyPlacesByTheme(theme, 0, false, true)}
                                searchQuery={searchQuery}
                                searchResults={searchResults}
                                themeSearchResults={themeSearchResults}
                                isThemeMode={isThemeMode}
                                selectedPlace={selectedPlace}
                                onPlaceSelect={handlePlaceSelect}
                                onBookmark={handleBookmark}
                                loading={loading}
                                hasMoreData={hasMoreData}
                                onKeywordLoadMore={handleKeywordLoadMore}
                                onThemeLoadMore={handleThemeLoadMore}
                                likedPlacesCount={likedPlaces.length}
                                currentLocation={currentLocation}
                                onRefreshThemeSearch={handleRefreshThemeSearch}
                            />
                        </div>
                    </MainContent>
                </Main>
            </BodyWrapper>
        </PageWrapper>
    );
};

export default MapSearch;