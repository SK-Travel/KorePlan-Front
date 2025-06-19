import React, { useState, useEffect } from 'react';
import { PageWrapper, BodyWrapper, Main, MainContent } from '../styles/MainPageStyle';
import Header from '../component/fragments/Header';
import TravelPlannerModal from '../component/AIChat/TravelPlannerModal';
import TravelMap from '../component/AIChat/TravelMap';
import Footer from '../component/fragments/Footer.jsx';

const AIChatPage = () => {
    const [planData, setPlanData] = useState(null); // GPT로부터 받은 여행 계획 데이터를 저장
    const [isPlanning, setIsPlanning] = useState(true); // 모달 표시 여부 상태

    useEffect(() => {
        if (!planData) return; // planData가 없으면 바로 리턴
        console.log("PlanData.plan:!!!", planData.plan);
        console.log("days:!!!", planData.days);
        console.log("order:!!!", planData.region);
    
        return () => {
            
        }
    }, [planData]);


    // ✅ 뒤로가기 시 복원용: sessionStorage에서 로드
    useEffect(() => {
        const saved = sessionStorage.getItem("planData");
        if (saved) {
            setPlanData(JSON.parse(saved));
            setIsPlanning(false);
        }
    }, []);

    // 계획이 생성되면 지도 보여주기
    const handlePlanGenerated = (data) => {
        setPlanData(data);
        sessionStorage.setItem("planData", JSON.stringify(data)); // 저장
        setIsPlanning(false); // 모달 닫기
    };

    // 다시 추천받기 버튼 클릭 시
    const handleReset = () => {
        setPlanData(null);  //  기존 계획 제거
        sessionStorage.removeItem("planData"); // 삭제
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
                        {/* !isPlanning && planData && planData.plan && planData.plan.length > 0 */}
                        {!isPlanning && planData && planData.plan && planData.plan.length > 0 && (
                            <>
                                <TravelMap locations={planData.plan} days={planData.days} region={planData.region} 
                                startDate={planData.startDate} endDate={planData.endDate}/>

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