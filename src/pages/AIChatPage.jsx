import React, { useState } from 'react';
import { PageWrapper, BodyWrapper, Main, MainContent } from '../styles/MainPageStyle';
import Header from '../component/fragments/Header';
import TravelPlannerModal from '../component/AIChat/TravelPlannerModal';
import TravelMap from '../component/AIChat/TravelMap';
import Footer from '../component/fragments/Footer.jsx';

const AIChatPage = () => {
    const [planData, setPlanData] = useState([]); // GPT로부터 받은 여행 계획 데이터를 저장

    return (
        <div>
            <PageWrapper>
                <Header />
                <Main>
                    <MainContent>
                        {/* 모달 컴포넌트 - 여행 조건 입력 */}
                        <TravelPlannerModal onPlanGenerated={setPlanData} />

                        {/* 지도 컴포넌트 - 여행 계획이 있을 경우에만 렌더링 */}
                        {planData.length > 0 && <TravelMap locations={planData} />}

                        {/* <Footer /> */}
                    </MainContent>
                </Main>
                <Footer />
            </PageWrapper>
        </div>
    );
};

export default AIChatPage;