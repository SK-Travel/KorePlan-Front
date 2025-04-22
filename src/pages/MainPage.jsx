import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../fragments/Footer';
import Header from '../fragments/Header';
import MyList from '../fragments/MyList'
import MainComponent from '../component/Main/MainComponent';

const MainPage = () => {
    return (
        <>
            <Header />
            <div className="d-flex">
                <MyList style={{ flex: 2 }}/>
                <MainComponent style={{ flex: 8}}/>
            </div>
            <Footer />
        </>
    );
};

export default MainPage;