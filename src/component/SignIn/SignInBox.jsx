import React from 'react';

const SignInBox = () => {
    return (
        <div className="shadow-box">
            <div className="sign-in-box justify-content-center align-items-center m-5">
                    <div className="mb-4">
                        <h1>로그인</h1>
                    </div>
                    {/* <!-- 엔터로 submit이 될 수 있게 form 태그를 만들어줌--> */}
                    <form id="loginForm" action="/user/sign-in" method="post">
                        {/* <!-- id --> */}
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">ID</span>
                            </div>
                            <input type="text" className="form-control col-8" id="loginId" name="loginId" placeholder="아이디를 입력하세요" />
                        </div>
                        
                        {/* <!-- 비밀번호 --> */}
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text">PW</span>
                            </div>
                            <input type="password" className="form-control col-8" id="password" name="password" placeholder="비밀번호를 입력하세요" />
                        </div>
                        {/* <!-- 로그인, 회원가입 버튼 --> */}
                        <input type="submit" className="btn btn-block btn-warning col-9 mt-3" value="로그인" />
                        <a className="btn btn-block btn-info col-9 mt-3" href="/signUp">회원가입</a>
        
                    </form>
            </div>
	    </div>
    );
};

export default SignInBox;