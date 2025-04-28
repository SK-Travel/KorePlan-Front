import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/KorePlan.css'
import Header from '../component/fragments/Header.jsx';
import Footer from '../component/fragments/Footer.jsx';
import {
    PageWrapper,
    BodyWrapper,
    LeftSide,
    Main,
    MainContent,
    Row,
    RightSide,
} from '../styles/MainPageStyle.js'

import SignUpBox from '../Component/SignUp/SignUpBox.jsx'

const SignUpPage = () => {
    return (
        <div>
            <Header />
            <div className="d-flex justify-content-center">
                <SignUpBox />
            </div>

            <Footer />
        </div>
    );
};

export default SignUpPage;