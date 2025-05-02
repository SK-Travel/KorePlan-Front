import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignUpBox = () => {
    const [idChecked, setIdChecked] = useState(false); // 아이디 중복 확인
    
    const handleIdChecked = async() => {
        //중복 loginId있는지 확인
        const loginId = document.getElementById('loginId').value.trim();
        console.log(loginId);

        // 우선 모든 메시지 숨기기
        const idCheckLength = document.getElementById("idCheckLength") // ID 4자 이하
        const idCheckDuplicated = document.getElementById("idCheckDuplicated") // ID 중복일 때 내미는
        const idCheckOk = document.getElementById("idCheckOk") // ID 중복 아닐 때 내미는
        
        if (loginId.length < 4) {
            idCheckLength.classList.remove("d-none");
            setIdChecked(false);
        }

        const formData = new URLSearchParams();
        formData.append("loginId", loginId);

        try {
            const response = await fetch('/api/user/is-duplicated-id', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                },
                body: formData
            });
            console.log(response);
            
            if(response.ok) {
                const is_duplicated_id = await response.json();

                if (is_duplicated_id.true) {
                    idCheckDuplicated.classList.remove("d-none");
                    setIdChecked(false);
                } else {
                    idCheckOk.classList.remove("d-none");
                    setIdChecked(true);
                }
            } else {
                console.error("응답 오류: ", response.status);
            }

        } catch (error) {
            console.error("서버 통신 오류:", error);
        }

    }
    


    return (
        <>

            <div className="shadow-box">
                    <div className="sign-up-box">
                        <h1 className="m-4 text-center">회원가입</h1>
                            <form id="signUpForm" method="post" action="/user/sign-up">
                                <span className="sign-up-subject">ID</span>
                                <div className="d-flex ml-3 mt-3">
                                    <input type="text" id="loginId" name="loginId" className="form-control" placeholder="ID를 입력해주세요" />
                                </div>
                                <button type="button" id="loginIdCheckBtn" className="btn btn-success col-4" onClick={handleIdChecked}>중복확인</button>
                                
                                <div className="ml-3 mb-3">
                                    <div id="idCheckLength" className="small text-danger d-none">ID를 4자 이상 입력해주세요.</div>
                                    <div id="idCheckDuplicated" className="small text-danger d-none">이미 사용중인 ID입니다.</div>
                                    <div id="idCheckOk" className="small text-success d-none">사용 가능한 ID 입니다.</div>
                                </div>

                                <span className="sign-up-subject">비밀번호</span>
                                <div className="ml-3 mt-3">
                                    <input type="password" id="password" name="password" className="form-control col-6" placeholder="비밀번호를 입력하세요" />
                                </div>

                                <br />
                                <span className="sign-up-subject">비밀번호 확인</span>
                                <div className="ml-3 mt-3">
                                    <input type="password" id="confirmPassword" name="confirmPassword" className="form-control col-6" placeholder="비밀번호를 입력하세요" />
                                </div>
                                
                                <br />
                                <span className="sign-up-subject">이름</span>
                                <div className="ml-3 mt-3">
                                    <input type="text" id="name" name="name" className="form-control col-6" placeholder="이름을 입력하세요" />
                                </div>

                                <br />
                                <span className="sign-up-subject">이메일</span>
                                <div className="d-flex ml-3 mt-3">
                                    <input type="text" id="email" name="email" className="form-control" placeholder="이메일을 입력하세요" />
                                </div>
                                <button type="button" id="certifyEmail" name="certifyEmail" className="btn col-3 text-white" style={{backgroundColor:'#AE00FF'}}>인증</button>

                                <br />
                                <div className="d-none">
                                    <span className="sign-up-subject">이메일 인증번호</span>
                                    <div className="d-flex">
                                        <input type="text" id="email" name="email" className="form-control" placeholder="인증번호를 입력하세요" />
                                        <button type="button" id="confirmCertifyEmail" name="confirmCertifyEmail" className="btn col-2 text-white" style={{backgroundColor:'#0022FF'}}>확인</button>
                                    </div>

                                    <div className="ml-3 mb-3">
                                        <div id="idCheckLength" className="small text-danger d-none">ID를 4자 이상 입력해주세요.</div>
                                        <div id="idCheckDuplicated" className="small text-danger d-none">이미 사용중인 ID입니다.</div>
                                        <div id="idCheckOk" className="small text-success d-none">사용 가능한 ID 입니다.</div>
                                    </div>
                                </div>
                                
                                <span className="sign-up-subject">전화번호</span>
                                <div className="ml-3 mt-3">
                                    <input type="text" id="phoneNumber" name="phoneNumber" className="form-control col-6" placeholder="전화번호를 입력하세요" />
                                </div>
                                
                                <div className="d-flex justify-content-space m-3">
                                    <button type="submit" id="signUpBtn" className="btn text-white" style={{ backgroundColor:'#B78812'}}>회원가입</button>
                                </div>
                            </form>
                </div>
            </div>


        </>
    );
};

export default SignUpBox;