import React from 'react';
import Header from '../component/fragments/Header';
import Footer from '../component/fragments/Footer';
import InfoModifiedBox from '../component/InfoModified/InfoModifiedBox';

const InfoModifiedPage = () => {
    return (
        <div>
            <Header />
            <div className="d-flex justify-content-center">
                <InfoModifiedBox />
            </div>
            <Footer />
        </div>
    );
};

export default InfoModifiedPage;