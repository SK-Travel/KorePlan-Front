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

import SignUpBox from '../component/SignUp/SignUpBox.jsx'

const SignUpPage = () => {
    return (
        
            
            <div className="d-flex justify-content-center">
                <SignUpBox />
            </div>

            
        
    );
};

export default SignUpPage;