import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignUpBox = () => {
    const [idChecked, setIdChecked] = useState(false); // 아이디 중복 확인
    const [emailVerified, setEmailVerified] = useState(false); // 이메일 인증 확인
    

    // 중복 loginId체크하는 코드
    const handleIdChecked = async() => {
        //중복 loginId있는지 확인
        const loginId = document.getElementById('loginId').value.trim();
        console.log(loginId);

        // 우선 모든 메시지 정의하기
        const idCheckLength = document.getElementById("idCheckLength") // ID 4자 이하
        const idCheckDuplicated = document.getElementById("idCheckDuplicated") // ID 중복일 때 내미는
        const idCheckOk = document.getElementById("idCheckOk") // ID 중복 아닐 때 내미는

        //모든 메시지 초기화(그래야 메시지가 없어짐)
        idCheckLength.classList.add("d-none");
        idCheckDuplicated.classList.add("d-none");
        idCheckOk.classList.add("d-none");
        
        if (loginId.length < 4) {
            idCheckLength.classList.remove("d-none");
            setIdChecked(false);
            return;
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
                const data = await response.json();
                console.log(data);


                if (data.is_duplicated_id === true) {
                    idCheckDuplicated.classList.remove("d-none");
                    setIdChecked(false);
                    return;
                } else {
                    idCheckOk.classList.remove("d-none");
                    setIdChecked(true);
                    return;
                }
            } else {
                console.error("응답 오류: ", response.status);
            }

        } catch (error) {
            console.error("서버 통신 오류:", error);
        }

    }
    
    //이메일 인증하는 코드


    //form코드 submit막는 코드
    const handleSubmit = (e) => {
        e.preventDefault();

        // ID체크
        if(!idChecked) {
            alert("ID중복을 확인해주세요.");
            return;
        }

        //이메일 인증 체크

        
        // 모두 통과하면 백엔드로 실제 폼 제출
        document.getElementById("signUpForm").submit();
    }

    return (
        <>

            <div className="shadow-box">
                    <div className="sign-up-box">
                        <h1 className="m-4 text-center">회원가입</h1>
                            <form id="signUpForm" method="post" action="/user/sign-up" onSubmit={handleSubmit}>
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