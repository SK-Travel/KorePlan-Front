import React from 'react';
//CSS
import { 
    PageWrapper, 
    BodyWrapper,
    LeftSide,
    RightSide,
    Main,
    MainContent,
    } from '../styles/FestivalStyle';
//------------------------------------------
import Festival from '../component/Festival/Festival';
import Header from '../component/fragments/Header';

const AllFestival = () => {
    //const thisMonth;
    //const nextMonth;
    return (
        <div>
            <PageWrapper>
                <Header />

                <BodyWrapper>
                    <LeftSide/>
                    <Main>
                        <MainContent>
                            <Festival/>
                            <Festival/>
                        </MainContent>
                    </Main>
                    <RightSide/>
                </BodyWrapper>

            </PageWrapper>
        </div>
    );
};

export default AllFestival;