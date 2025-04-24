import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/KorePlan.css'
import Header from '../component/fragments/Header.jsx';
import Footer from '../component/fragments/Footer.jsx';
import MyList from '../component/fragments/MyList.jsx';
import SearchBar from '../component/Main/SearchBar';
import RecommendChooseBar from '../component/Main/RecommendChooseBar.jsx';
import RecommendBar from '../component/Main/RecommendBar.jsx';
import Calendar from '../component/Main/Calendar.jsx';


const MainPage = () => {
    return (
        <>
            <Header />
            <div className="d-flex">
                <MyList style={{ flex: 2 }}/>

                <div className="container form-control" style={{ flex: 8, backgroundColor:'#f0faff'}}>
                    <div style={ {width:'900px', backgroundColor:'#ffffff'}}>
                        <SearchBar />
                        <RecommendChooseBar />

                    </div>

                    <RecommendBar />
                    <Calendar />
                </div>
            </div>

            <Footer />
        </>
    );
};

export default MainPage;