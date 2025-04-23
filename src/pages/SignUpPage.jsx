import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../component/fragments/Header.jsx';
import Footer from '../component/fragments/Footer.jsx';
import SignUp from '../component/SignUp/SignUpBox.jsx';

const SignUpPage = () => {
    return (
        <div>
            <Header />
            <div className='container d-flex justify-content-center'>
                <SignUp />
            </div>
            <Footer />
        </div>
    );
};

export default SignUpPage;