import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Intro = () => {
    return (
        <div>
            <Button><Link to={'/signin'}>로그인하기</Link></Button>
        </div>
    );
};

export default Intro;