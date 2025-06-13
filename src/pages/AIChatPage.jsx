import React, { useState } from 'react';
import { PageWrapper, BodyWrapper, Main, MainContent } from '../styles/MainPageStyle';
import Header from '../component/fragments/Header';
import TravelPlannerModal from '../component/AIChat/TravelPlannerModal';
import TravelMap from '../component/AIChat/TravelMap';
import Footer from '../component/fragments/Footer.jsx';

const AIChatPage = () => {
    const [planData, setPlanData] = useState([]); // GPT로부터 받은 여행 계획 데이터를 저장
    const [isPlanning, setIsPlanning] = useState(true); // 모달 표시 여부 상태

    // 계획이 생성되면 지도 보여주기
    const handlePlanGenerated = (data) => {
        setPlanData(data);
        setIsPlanning(false); // 모달 닫기
    };

    // 다시 추천받기 버튼 클릭 시
    const handleReset = () => {
        setPlanData([]);      // 기존 계획 제거
        setIsPlanning(true);  // 모달 다시 열기
    };
    
    return (
        <div>
            <PageWrapper>
                <Header />
                <Main>
                    <MainContent>
                        {/* 여행 계획 입력 모달 */}
                        {isPlanning && <TravelPlannerModal onPlanGenerated={handlePlanGenerated} />}

                        {/* 여행 계획이 있을 경우 지도 렌더링 */}
                        {!isPlanning && planData.length > 0 && (
                            <>
                                <TravelMap locations={planData} />

                                {/* 일정 다시 추천받기 버튼 */}
                                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                                    <button onClick={handleReset} style= {{
                                        padding: '10px 20px',
                                        fontSize: '16px',
                                        backgroundColor: '#0077FF',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                    }}>
                                    📍 일정 다시 추천받기
                                    </button>
                                </div>                          
                            </>
                        )}
                    </MainContent>
                </Main>
                <Footer />
            </PageWrapper>
        </div>
    );
};

export default AIChatPage;