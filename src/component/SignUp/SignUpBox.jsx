import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DatabaseAdd } from 'react-bootstrap-icons';

const SignUpBox = () => {
    const [idChecked, setIdChecked] = useState(false); // 아이디 중복 확인
    const [emailVerified, setEmailVerified] = useState(false); // 이메일 인증 여부 상태
    const [emailCodeTimer, setEmailCodeTimer] = useState(0); // 타이머설정
    const [emailFailCount, setEmailFailCount] = useState(0); // 이메일 인증 코드 횟수 제한
    

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

    };

    //이메일 인증 요청 함수
    const sendEmailVerification = async() => {
        const email = document.getElementById('email').value.trim();
        
        if (!email.includes("@")) {
            alert("올바른 이메일 형식이 아닙니다.");
            return;
        }

        const type = email.includes("gmail") ? "gmail" : "naver"; // 이메일 주소 기준 type 추출

        const smtpInfo = {
            email: email,
            type: type
        };

        try {
            const response = await fetch("/api/email/send-code", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(smtpInfo)
            });
            if(response.ok) {
                alert("이메일로 인증번호를 보냈습니다.");
                document.getElementById("emailCodeBox").classList.remove("d-none"); // 인증번호 입력창보이기
                startEmailCodeTimer();
            } else {
                alert("이메일 인증 요청에 실패했습니다.");
            }
        } catch (error) {
            console.error("이메일 인증 요청 중 오류: ", error);
        }
    };


    // 이메일 인증 확인 요청 함수
    const handleEmailCodeCheck = async () => {
        const code = document.getElementById('emailCode').value.trim();
        const email = document.getElementById('email').value.trim();

        // 이메일 인증박스(EmailCodeBox)에 있는 것들.
        const codeBoxDiv = document.getElementById("emailCodeBox");
        const errorDiv = document.getElementById('emailCodeError');
        const correctDiv = document.getElementById('emailCodeCorrect');
        const timerDiv = document.getElementById("emailCodeTimer");
        const failCountDiv = document.getElementById("emailFailCount");

        // 인증코드 타이머 제한
        if (emailCodeTimer <= 0) {
            alert("인증코드가 만료됐습니다. 다시 요청하세요.");
            return;
        }
        // 인증코드 횟수 제한
        if (emailFailCount >= 5) {
            alert("인증 실패 횟수가 초과되었습니다. 다시 요청하세요.");
            codeBoxDiv.classList.add("d-none");
            return;
        }

        try {
            const response = await fetch('/api/email/verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    code : code
                })
            });
            
            if (response.ok) {
                // 성공 처리
                correctDiv.classList.remove('d-none'); // 인증완료로 나오게 하기
                errorDiv.classList.add("d-none");
                setEmailVerified(true);
                setEmailFailCount(0);

                //안 숨기고 있다가 인증성공 하면 d-none(타이머, 실패횟수)
                timerDiv.classList.add("d-none");
                failCountDiv.classList.add("d-none");

            } else {
                // 실패 처리
                correctDiv.classList.add("d-none");
                errorDiv.classList.remove("d-none");

                setEmailVerified(false);
                setEmailFailCount(prev => prev + 1);
            }   
        } catch (error) {
            // 안 넘어간 거 아예
            console.log("인증코드 확인 중 오류: ", error);
            correctDiv.classList.add("d-none");
            errorDiv.classList.remove("d-none");

            setEmailVerified(false);
            setEmailFailCount(prev => prev + 1);
        }
    };
    
    const startEmailCodeTimer = () => {
        let time = 300;
        setEmailCodeTimer(time);

        const timerId = setInterval(() => {
            time -= 1;
            setEmailCodeTimer(time);

            if (time <= 0) {
                clearInterval(timerId);
                alert("인증번호가 만료됐습니다. 다시 인증해주세요");
                setEmailCodeTimer(false); // 타이머 초기화
                setEmailFailCount(0); // 실패 횟수도 초기화
                document.getElementById('emailCodeBox').classList.add("d-none"); // 인증 코드 박스 숨기기: 초기화
            }
        }, 1000);
    };


    // submit관련 코드
    const handleSubmit = (e) => {
        //form코드 submit막는 코드
        e.preventDefault();

        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const name = document.getElementById("name").value.trim();
        const phoneNumber = document.getElementById("phoneNumber").value.trim();

        // ID체크
        if (!idChecked) {
            alert("ID중복을 확인해주세요.");
            return;
        };

        // 비밀번호, 비밀번호 확인했는지 체크
        if (!password || !confirmPassword) {
            alert("비밀번호를 입력하세요.");
            return;
        }
        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        // 이름 체크
        if (!name) {
            alert("이름을 입력해주세요");
            return;
        }

        //이메일 인증 체크
        if (!emailVerified) {
            alert("이메일 인증을 해주세요.");
            return;
        }

        // 전화번호 체크
        if (!phoneNumber) {
            alert("전화번호를 입력해주세요.");
            return;
        }
        
        // 모두 통과하면 백엔드로 실제 폼 제출
        document.getElementById("signUpForm").submit();
    };

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
                                <button type="button" id="certifyEmail" name="certifyEmail" className="btn col-3 text-white" style={{backgroundColor:'#AE00FF'}} onClick={sendEmailVerification}>인증</button>

                                <br />
                                <div id="emailCodeBox" className="d-none">
                                    <span className="sign-up-subject">이메일 인증번호</span>
                                    <div className="d-flex">
                                        <input type="text" id="emailCode" name="emailCode" className="form-control" placeholder="인증번호를 입력하세요" />
                                        <button type="button" id="checkEmailCodeBtn" name="checkEmailCodeBtn" className="btn col-2 text-white" style={{backgroundColor:'#0022FF'}} onClick={handleEmailCodeCheck} disabled={emailFailCount >= 5}>확인</button>
                                    </div>

                                    <div className="ml-3 mb-3">
                                        <div id="emailCodeError" className="small text-danger d-none">일치하지 않습니다.</div>
                                        <div id="emailCodeCorrect" className="small text-success d-none">인증완료</div>
                                    </div>
                                    <div id="emailCodeTimer" className="ml-3 small text-muted">
                                        {emailCodeTimer > 0 
                                            ? `⏱ 남은 시간: ${Math.floor(emailCodeTimer / 60)}:${(emailCodeTimer % 60).toString().padStart(2, '0')}`
                                            : "⏱ 인증번호 만료됨"}
                                    </div>
                                    <div id="emailFailCount" className="ml-3 small text-muted">
                                        ❌ 인증 실패: {emailFailCount} / 5
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