import React, { useState, useEffect } from 'react';
import { useNavigate, useNavigationType } from 'react-router-dom';
import { PageWrapper, BodyWrapper, Main, MainContent } from '../styles/MainPageStyle';
import Header from '../component/fragments/Header';
import TravelPlannerModal from '../component/AIChat/TravelPlannerModal';
import TravelMap from '../component/AIChat/TravelMap';
import Footer from '../component/fragments/Footer.jsx';

const AIChatPage = () => {
    const [planData, setPlanData] = useState(null); // GPT로부터 받은 여행 계획 데이터를 저장
    const [isPlanning, setIsPlanning] = useState(true); // 모달 표시 여부 상태
    const navigate = useNavigate();
    const navigationType = useNavigationType(); // 현재 진입 방식 (POP이면 뒤로가기)

    // 뒤로가기일 때만 sessionStorage 복원
    useEffect(() => {
        if (navigationType === 'POP') {
            const saved = sessionStorage.getItem("planData");
            if (saved) {
                setPlanData(JSON.parse(saved));
                setIsPlanning(false);
            }
        } else {
    // 직접 진입 or 링크 클릭으로 온 경우에는 초기화
            sessionStorage.removeItem("planData");
            setPlanData(null);
            setIsPlanning(true);
        }
    }, [navigationType]);


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

    // 모달 닫기 - 메인페이지로 이동
    const handleModalClose = () => {
        navigate('/mainPage'); // 메인페이지로 이동
    };
    
    return (
        <div>
            <PageWrapper>
                <Header />
                <Main>
                    <MainContent>
                        {/* 여행 계획 입력 모달 */}
                        {isPlanning && (
                            <TravelPlannerModal 
                                onPlanGenerated={handlePlanGenerated}
                                onClose={handleModalClose}
                            />
                        )}
                        
                        {/* 여행 계획이 있을 경우 지도 렌더링 */}
                        {!isPlanning && planData && planData.plan && planData.plan.length > 0 && (
                            <TravelMap
                                locations={planData.plan}
                                days={planData.days}
                                region={planData.region}
                                startDate={planData.startDate}
                                endDate={planData.endDate}
                                onReset={handleReset}  // onReset prop 추가
                            />
                        )}
                    </MainContent>
                </Main>
                <Footer />
            </PageWrapper>
        </div>
    );
};

export default AIChatPage;