import React from 'react';

const SignInBox = () => {
    

    // 로그인 비동기통신
    const handleSubmit = async (e) => {
        //form submit 막는 코드
        e.preventDefault();
        //alert("로그인");

        // validation
        const loginId = document.getElementById("loginId").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!loginId) {
            alert("아이디를 입력하세요.");
            return;
        }

        if (!password) {
            alert("비밀번호를 입력하세요.");
            return;
        }

        const userData = {
            loginId: loginId,
            password: password
        }

        try {
            const response = await fetch('/api/user/sign-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const data = await response.json();
                if (data.code === 200) {
                    alert(data.result);
                    window.location.href='/mainPage';
                } else if (data.code === 400) { // 존재하지 않을 때(둘 중 하나라도 틀렸을 때)
                    alert("로그인 실패: " + data.error_message);
                } else {
                    alert("로그인 실패: " + data.error_message);
                }
            }
        } catch (error) {
            console.log("로그인 실행 중 오류: " + error);
        }
    }
    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };
    const handleKakaoLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/kakao"
    }
    const handleNaverLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/naver"
    }

    return (
        <div className="shadow-box">
            <div className="sign-in-box justify-content-center align-items-center m-5">
                    <div className="mb-4">
                        <h1>로그인</h1>
                    </div>
                    {/* <!-- 엔터로 submit이 될 수 있게 form 태그를 만들어줌--> */}
                    <form id="loginForm" method="post" onSubmit={handleSubmit} >
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
                    </form>
                    <a className="btn btn-block btn-info col-9 mt-3" href="/signUp">회원가입</a>
                    <button type="button" className="btn btn-light mt-3" onClick={handleGoogleLogin} style={{ fontSize:'12px', width: '90%' }}>
                        <i className="bi bi-google"></i> 구글 계정으로 로그인
                    </button>
                    {/* <img src={kakaoLoginLogo} alt="카카오 로그인" onClick={handleKakaoLogin}style={{ cursor: 'pointer', width: '200px' }} /> */}
                    <button type="button" className="btn btn-success" onClick={handleNaverLogin} style={{ fontSize:'12px', width: '90%'  }}>네이버 계정으로 로그인</button>
            </div>
	    </div>
    );
};

export default SignInBox;