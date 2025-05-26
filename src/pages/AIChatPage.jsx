import React, { useState } from 'react';
import { PageWrapper } from '../styles/MainPageStyle';
import Header from '../component/fragments/Header';
import AIChatBox from '../component/AIChat/AIChatBox';
import MapWithMarkers from '../component/AIChat/MapWithMarkers';

const AIChatPage = () => {
    // 로직
    //AIChatBox에서 사용자 질문 및 AI 답변 -> 응답에서 장소명: 위도, 경도 위치 정보 추출 -> 추출된 위치 MapWithMarkes에 전달 -> Naver Map에 찍기

    const [places, setPlaces] = useState([]); // AI 추천 장소 리스트 (위도, 경도 포함)

    return (
        <div>
            <PageWrapper>
                <Header />
                <AIChatBox onExtractLocations={setPlaces}/> {/*위치 데이터를 넘겨받기 */}
                <div style={{ marginTop: '30px'}}>
                    <MapWithMarkers places={places} />
                </div>
                {/* <Footer /> */}
            </PageWrapper>
        </div>
    );
};

export default AIChatPage;