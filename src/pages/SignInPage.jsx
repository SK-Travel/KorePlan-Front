import React from 'react';
import '../styles/KorePlan.css'
import Header from '../component/fragments/Header.jsx';
import Footer from '../component/fragments/Footer.jsx';
import SignInBox from '../component/SignIn/SignInBox.jsx';

const SignInPage = () => {
    return (
        <div>
            
            <div className="d-flex justify-content-center">
                <SignInBox />
            </div>

            
        </div>
    );
};

export default SignInPage;