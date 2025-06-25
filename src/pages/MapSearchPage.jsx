import React from 'react';
import Header from '../component/fragments/Header.jsx';
import {
    PageWrapper,
    BodyWrapper,
    Main,
    MainContent,
} from '../styles/EditPageStyle.js';
import MapSearchMainContent from '../component/Search/MapSearchMainContent.jsx';
const MapSearch = () => {
    return (
        <PageWrapper>
            <Header />
            <BodyWrapper>
                <Main>
                    <MainContent>
                        <MapSearchMainContent/>
                    </MainContent>
                </Main>
            </BodyWrapper>
        </PageWrapper>
    );
};

export default MapSearch;