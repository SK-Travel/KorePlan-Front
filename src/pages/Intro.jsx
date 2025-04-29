import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

//로그인 하지 않고 서비스 불가 -> 인트로에서 로그인 / 회원가입 할 수 있도록 만들고 
//로그인시 메인 페이지로 이동 / 회원가입시 다시 인트로로 이동해서 로그인 -> 메인페이지
const Intro = () => {
    return (
        <div>
            <Button><Link to={'/signin'}>로그인하기</Link></Button>
        </div>
    );
};

export default Intro;