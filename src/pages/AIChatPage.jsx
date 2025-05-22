import React from 'react';
import { PageWrapper } from '../styles/MainPageStyle';
import Header from '../component/fragments/Header';
import AIChatBox from '../component/AIChat/AIChatBox';

const AIChatPage = () => {
    return (
        <div>
            <PageWrapper>
                <Header />
                <AIChatBox />
                {/* <Footer /> */}
            </PageWrapper>
        </div>
    );
};

export default AIChatPage;