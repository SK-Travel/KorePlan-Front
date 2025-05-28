import React from 'react';
import { PageWrapper } from '../styles/MainPageStyle';
import Header from '../component/fragments/Header';
import MyList from '../component/MyList/MyList';
import Like from '../component/MyList/Like';

const MyListPage = () => {
    return (
        <PageWrapper>
            <Header />
            <div className="container d-flex">
                <MyList />
                <Like />
            </div>

            {/* <Footer /> */}
        </PageWrapper>
    );
};

export default MyListPage;