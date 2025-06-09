// import React, {useEffect, useState} from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { DatabaseAdd } from 'react-bootstrap-icons';
// import { useSearchParams } from 'react-router-dom';
// import axios from 'axios';
// import kakaoLoginLogo from '../../assets/kakao_login_medium_narrow.png';

// const SignUpBox = () => {
//     const [idChecked, setIdChecked] = useState(false); // 아이디 중복 확인
//     const [emailVerified, setEmailVerified] = useState(false); // 이메일 인증 여부 상태
//     const [emailCodeTimer, setEmailCodeTimer] = useState(0); // 타이머설정
//     const [emailFailCount, setEmailFailCount] = useState(0); // 이메일 인증 코드 횟수 제한

//     const [email, setEmail] = useState('');
//     const [name, setName] = useState('');
//     const [searchParams] = useSearchParams();

    
//     useEffect(() => {
//         // LocalStorage에서 이메일과 이름 가져오기
//         const savedEmail = localStorage.getItem('email');
//         const savedName = localStorage.getItem('name');
        
//         if (savedEmail) {
//             setEmail(savedEmail); // 자동으로 이메일 채우기
//         }
//         if (savedName) {
//             setName(savedName); // 자동으로 이름 채우기
//         }
//     }, []);

//     // 중복 loginId체크하는 코드
//     const handleIdChecked = async() => {
//         //중복 loginId있는지 확인
//         const loginId = document.getElementById('loginId').value.trim();
//         console.log(loginId);

//         // 우선 모든 메시지 정의하기
//         const idCheckLength = document.getElementById("idCheckLength") // ID 4자 이하
//         const idCheckDuplicated = document.getElementById("idCheckDuplicated") // ID 중복일 때 내미는
//         const idCheckOk = document.getElementById("idCheckOk") // ID 중복 아닐 때 내미는

//         //모든 메시지 초기화(그래야 메시지가 없어짐)
//         idCheckLength.classList.add("d-none");
//         idCheckDuplicated.classList.add("d-none");
//         idCheckOk.classList.add("d-none");
        
//         if (loginId.length < 4) {
//             idCheckLength.classList.remove("d-none");
//             setIdChecked(false);
//             return;
//         }

//         const formData = new URLSearchParams();
//         formData.append("loginId", loginId);

//         try {
//             const response = await fetch('/api/user/is-duplicated-id', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type' : 'application/x-www-form-urlencoded',
//                 },
//                 body: formData
//             });
//             console.log(response);
            
//             if(response.ok) {
//                 const data = await response.json();
//                 console.log(data);


//                 if (data.is_duplicated_id === true) {
//                     idCheckDuplicated.classList.remove("d-none");
//                     setIdChecked(false);
//                     return;
//                 } else {
//                     idCheckOk.classList.remove("d-none");
//                     setIdChecked(true);
//                     return;
//                 }
//             } else {
//                 console.error("응답 오류: ", response.status);
//             }

//         } catch (error) {
//             console.error("서버 통신 오류:", error);
//         }

//     };

//     //이메일 인증 요청 함수
//     const sendEmailVerification = async() => {
//         const email = document.getElementById('email').value.trim();
        
//         if (!email.includes("@")) {
//             alert("올바른 이메일 형식이 아닙니다.");
//             return;
//         }

//         const type = email.includes("gmail") ? "gmail" : "naver"; // 이메일 주소 기준 type 추출

//         const smtpInfo = {
//             email: email,
//             type: type
//         };

//         try {
//             const response = await fetch("/api/email/send-code", {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(smtpInfo)
//             });
//             if(response.ok) {
//                 alert("이메일로 인증번호를 보냈습니다.");
//                 document.getElementById("emailCodeBox").classList.remove("d-none"); // 인증번호 입력창보이기
//                 startEmailCodeTimer();
//             } else {
//                 alert("이메일 인증 요청에 실패했습니다.");
//             }
//         } catch (error) {
//             console.error("이메일 인증 요청 중 오류: ", error);
//         }
//     };


//     // 이메일 인증 확인 요청 함수
//     const handleEmailCodeCheck = async () => {
//         const code = document.getElementById('emailCode').value.trim();
//         const email = document.getElementById('email').value.trim();

//         // 이메일 인증박스(EmailCodeBox)에 있는 것들.
//         const codeBoxDiv = document.getElementById("emailCodeBox");
//         const errorDiv = document.getElementById('emailCodeError');
//         const correctDiv = document.getElementById('emailCodeCorrect');
//         const timerDiv = document.getElementById("emailCodeTimer");
//         const failCountDiv = document.getElementById("emailFailCount");

//         // 인증코드 타이머 제한
//         if (emailCodeTimer <= 0) {
//             alert("인증코드가 만료됐습니다. 다시 요청하세요.");
//             return;
//         }
//         // 인증코드 횟수 제한
//         if (emailFailCount >= 5) {
//             alert("인증 실패 횟수가 초과되었습니다. 다시 요청하세요.");
//             codeBoxDiv.classList.add("d-none");
//             return;
//         }

//         try {
//             const response = await fetch('/api/email/verify-code', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     email: email,
//                     code : code
//                 })
//             });
            
//             if (response.ok) {
//                 // 성공 처리
//                 correctDiv.classList.remove('d-none'); // 인증완료로 나오게 하기
//                 errorDiv.classList.add("d-none");
//                 setEmailVerified(true);
//                 setEmailFailCount(0);

//                 //안 숨기고 있다가 인증성공 하면 d-none(타이머, 실패횟수)
//                 timerDiv.classList.add("d-none");
//                 failCountDiv.classList.add("d-none");

//             } else {
//                 // 실패 처리
//                 correctDiv.classList.add("d-none");
//                 errorDiv.classList.remove("d-none");

//                 setEmailVerified(false);
//                 setEmailFailCount(prev => prev + 1);
//             }   
//         } catch (error) {
//             // 안 넘어간 거 아예
//             console.log("인증코드 확인 중 오류: ", error);
//             correctDiv.classList.add("d-none");
//             errorDiv.classList.remove("d-none");

//             setEmailVerified(false);
//             setEmailFailCount(prev => prev + 1);
//         }
//     };
    
//     const startEmailCodeTimer = () => {
//         let time = 300;
//         setEmailCodeTimer(time);

//         const timerId = setInterval(() => {
//             time -= 1;
//             setEmailCodeTimer(time);

//             if (time <= 0) {
//                 clearInterval(timerId);
//                 alert("인증번호가 만료됐습니다. 다시 인증해주세요");
//                 setEmailCodeTimer(false); // 타이머 초기화
//                 setEmailFailCount(0); // 실패 횟수도 초기화
//                 document.getElementById('emailCodeBox').classList.add("d-none"); // 인증 코드 박스 숨기기: 초기화
//             }
//         }, 1000);
//     };


//     // 회원가입 관련 코드(일반일 때)
//     const handleSubmit = async (e) => {
//         //form코드 submit막는 코드
//         e.preventDefault();
//         //alert("회원가입");

//         // validation
//         const loginId = document.getElementById("loginId").value.trim();
//         const password = document.getElementById("password").value.trim();
//         const confirmPassword = document.getElementById("confirmPassword").value.trim();
//         const name = document.getElementById("name").value.trim();
//         const email = document.getElementById("email").value.trim();
//         const phoneNumber = document.getElementById("phoneNumber").value.trim();


//         // ID체크
//         if (!idChecked) {
//             alert("ID중복을 확인해주세요.");
//             return;
//         };

//         // 비밀번호, 비밀번호 확인했는지 체크
//         if (!password || !confirmPassword) {
//             alert("비밀번호를 입력하세요.");
//             return;
//         }
//         if (password !== confirmPassword) {
//             alert("비밀번호가 일치하지 않습니다.");
//             return;
//         }

//         // 이름 체크
//         if (!name) {
//             alert("이름을 입력해주세요");
//             return;
//         }

//         //이메일 인증 체크
//         if (!emailVerified) {
//             alert("이메일 인증을 해주세요.");
//             return;
//         }

//         // 전화번호 체크
//         if (!phoneNumber) {
//             alert("전화번호를 입력해주세요.");
//             return;
//         }

//         const userData = {
//             loginId: loginId,
//             password: password,
//             name: name,
//             email: email,
//             phoneNumber: phoneNumber
//         }

//         // await 요청
//         try {
//             const response = await fetch('/api/user/sign-up', {
//                 method: "POST",
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(userData)
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.code === 200) {
//                     alert("회원가입 성공! 로그인 페이지로 이동합니다.");
//                     window.location.href = "/signIn"; // signIn으로 이동
//                 } else {
//                     alert("회원가입 실패: " + data.error_message);
//                 }
//             }
//         } catch (error) {
//             console.log("회원가입 중 실행 오류: ", error);
//         }
//     };


//     const handleGoogleLogin = () => {
//         window.location.href = "http://localhost:8080/oauth2/authorization/google";
//     };
//     const handleKakaoLogin = () => {
//         window.location.href = "http://localhost:8080/oauth2/authorization/kakao"
//     }
//     const handleNaverLogin = () => {
//         window.location.href = "http://localhost:8080/oauth2/authorization/naver"
//     }

//     return (
//         <>

//             <div className="shadow-box">
//                     <div className="sign-up-box">
//                         <h1 className="m-4 text-center">회원가입</h1>
//                             <button type="button" className="btn btn-light mt-3" onClick={handleGoogleLogin} style={{ fontSize:'16px', width: '70%'  }}>
//                                 <i className="bi bi-google"></i> 구글 계정으로 회원가입
//                             </button>
//                             {/* <img src={kakaoLoginLogo} alt="카카오 로그인" onClick={handleKakaoLogin}style={{ cursor: 'pointer', width: '200px' }} /> */}
//                             <button type="button" className="btn btn-success" onClick={handleNaverLogin} style={{ fontSize:'16px', width: '70%'  }}>네이버 계정으로 회원가입</button>
//                             <form id="signUpForm" method="post" onSubmit={handleSubmit}>
//                                 <span className="sign-up-subject">ID</span>
//                                 <div className="d-flex ml-3 mt-3">
//                                     <input type="text" id="loginId" name="loginId" className="form-control" placeholder="ID를 입력해주세요" />
//                                 </div>
//                                 <button type="button" id="loginIdCheckBtn" className="btn btn-success col-4" onClick={handleIdChecked}>중복확인</button>
                                
//                                 <div className="ml-3 mb-3">
//                                     <div id="idCheckLength" className="small text-danger d-none">ID를 4자 이상 입력해주세요.</div>
//                                     <div id="idCheckDuplicated" className="small text-danger d-none">이미 사용중인 ID입니다.</div>
//                                     <div id="idCheckOk" className="small text-success d-none">사용 가능한 ID 입니다.</div>
//                                 </div>

//                                 <span className="sign-up-subject">비밀번호</span>
//                                 <div className="ml-3 mt-3">
//                                     <input type="password" id="password" name="password" className="form-control col-6" placeholder="비밀번호를 입력하세요" />
//                                 </div>

//                                 <br />
//                                 <span className="sign-up-subject">비밀번호 확인</span>
//                                 <div className="ml-3 mt-3">
//                                     <input type="password" id="confirmPassword" name="confirmPassword" className="form-control col-6" placeholder="비밀번호를 입력하세요" />
//                                 </div>
                                
//                                 <br />
//                                 <span className="sign-up-subject">이름</span>
//                                 <div className="ml-3 mt-3">
//                                     <input type="text" id="name" name="name" className="form-control col-6" placeholder="이름을 입력하세요" />
//                                 </div>

//                                 <br />
//                                 <span className="sign-up-subject">이메일</span>
//                                 <div className="d-flex ml-3 mt-3">
//                                     <input type="text" id="email" name="email" className="form-control" placeholder="이메일을 입력하세요" />
//                                 </div>
//                                 <button type="button" id="certifyEmail" name="certifyEmail" className="btn col-3 text-white" style={{backgroundColor:'#AE00FF'}} onClick={sendEmailVerification}>인증</button>

//                                 <br />
//                                 <div id="emailCodeBox" className="d-none">
//                                     <span className="sign-up-subject">이메일 인증번호</span>
//                                     <div className="d-flex">
//                                         <input type="text" id="emailCode" name="emailCode" className="form-control" placeholder="인증번호를 입력하세요" />
//                                         <button type="button" id="checkEmailCodeBtn" name="checkEmailCodeBtn" className="btn col-2 text-white" style={{backgroundColor:'#0022FF'}} onClick={handleEmailCodeCheck} disabled={emailFailCount >= 5}>확인</button>
//                                     </div>

//                                     <div className="ml-3 mb-3">
//                                         <div id="emailCodeError" className="small text-danger d-none">일치하지 않습니다.</div>
//                                         <div id="emailCodeCorrect" className="small text-success d-none">인증완료</div>
//                                     </div>
//                                     <div id="emailCodeTimer" className="ml-3 small text-muted">
//                                         {emailCodeTimer > 0 
//                                             ? `⏱ 남은 시간: ${Math.floor(emailCodeTimer / 60)}:${(emailCodeTimer % 60).toString().padStart(2, '0')}`
//                                             : "⏱ 인증번호 만료됨"}
//                                     </div>
//                                     <div id="emailFailCount" className="ml-3 small text-muted">
//                                         ❌ 인증 실패: {emailFailCount} / 5
//                                     </div>
//                                 </div>
                                
//                                 <span className="sign-up-subject">전화번호</span>
//                                 <div className="ml-3 mt-3">
//                                     <input type="text" id="phoneNumber" name="phoneNumber" className="form-control col-6" placeholder="전화번호를 입력하세요" />
//                                 </div>
                                
//                                 <div className="d-flex justify-content-space m-3">
//                                     <button type="submit" id="signUpBtn" className="btn text-white" style={{ backgroundColor:'#B78812'}}>회원가입</button>
//                                 </div>
//                             </form>
//                 </div>
//             </div>


//         </>
//     );
// };

// export default SignUpBox;

import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, User, Lock, Mail, Phone, UserCheck, ArrowRight, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import Logo from "../../assets/LogoIcon.png";

const SignUpBox = () => {
    const [idChecked, setIdChecked] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [emailCodeTimer, setEmailCodeTimer] = useState(0);
    const [emailFailCount, setEmailFailCount] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const [mounted, setMounted] = useState(false);

    const [formData, setFormData] = useState({
        loginId: '',
        password: '',
        confirmPassword: '',
        name: '',
        email: '',
        phoneNumber: '',
        emailCode: ''
    });

    useEffect(() => {
        setMounted(true);
        // LocalStorage에서 이메일과 이름 가져오기
        const savedEmail = localStorage.getItem('email');
        const savedName = localStorage.getItem('name');
        
        if (savedEmail) {
            setFormData(prev => ({ ...prev, email: savedEmail }));
        }
        if (savedName) {
            setFormData(prev => ({ ...prev, name: savedName }));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 중복 loginId체크하는 코드
    const handleIdChecked = async() => {
        const loginId = formData.loginId.trim();
        
        if (loginId.length < 4) {
            alert("ID를 4자 이상 입력해주세요.");
            setIdChecked(false);
            return;
        }

        const formDataToSend = new URLSearchParams();
        formDataToSend.append("loginId", loginId);

        try {
            const response = await fetch('/api/user/is-duplicated-id', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                },
                body: formDataToSend
            });
            
            if(response.ok) {
                const data = await response.json();

                if (data.is_duplicated_id === true) {
                    alert("이미 사용중인 ID입니다.");
                    setIdChecked(false);
                    return;
                } else {
                    alert("사용 가능한 ID입니다.");
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
        const email = formData.email.trim();
        
        if (!email.includes("@")) {
            alert("올바른 이메일 형식이 아닙니다.");
            return;
        }

        const type = email.includes("gmail") ? "gmail" : "naver";

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
        const code = formData.emailCode.trim();
        const email = formData.email.trim();

        // 인증코드 타이머 제한
        if (emailCodeTimer <= 0) {
            alert("인증코드가 만료됐습니다. 다시 요청하세요.");
            return;
        }
        // 인증코드 횟수 제한
        if (emailFailCount >= 5) {
            alert("인증 실패 횟수가 초과되었습니다. 다시 요청하세요.");
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
                alert("이메일 인증이 완료되었습니다.");
                setEmailVerified(true);
                setEmailFailCount(0);
            } else {
                alert("인증코드가 일치하지 않습니다.");
                setEmailVerified(false);
                setEmailFailCount(prev => prev + 1);
            }   
        } catch (error) {
            console.log("인증코드 확인 중 오류: ", error);
            alert("인증코드가 일치하지 않습니다.");
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
                setEmailCodeTimer(0);
                setEmailFailCount(0);
            }
        }, 1000);
    };

    // 회원가입 관련 코드
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // validation
        const loginId = formData.loginId.trim();
        const password = formData.password.trim();
        const confirmPassword = formData.confirmPassword.trim();
        const name = formData.name.trim();
        const email = formData.email.trim();
        const phoneNumber = formData.phoneNumber.trim();

        // ID체크
        if (!idChecked) {
            alert("ID중복을 확인해주세요.");
            setIsLoading(false);
            return;
        }

        // 비밀번호, 비밀번호 확인했는지 체크
        if (!password || !confirmPassword) {
            alert("비밀번호를 입력하세요.");
            setIsLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            setIsLoading(false);
            return;
        }

        // 이름 체크
        if (!name) {
            alert("이름을 입력해주세요");
            setIsLoading(false);
            return;
        }

        //이메일 인증 체크
        if (!emailVerified) {
            alert("이메일 인증을 해주세요.");
            setIsLoading(false);
            return;
        }

        // 전화번호 체크
        if (!phoneNumber) {
            alert("전화번호를 입력해주세요.");
            setIsLoading(false);
            return;
        }

        const userData = {
            loginId: loginId,
            password: password,
            name: name,
            email: email,
            phoneNumber: phoneNumber
        }

        try {
            const response = await fetch('/api/user/sign-up', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const data = await response.json();
                if (data.code === 200) {
                    alert("회원가입 성공! 로그인 페이지로 이동합니다.");
                    window.location.href = "/signIn";
                } else {
                    alert("회원가입 실패: " + data.error_message);
                }
            }
        } catch (error) {
            console.log("회원가입 중 실행 오류: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div style={{
            minHeight: '100vh',
            background: 'white',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Main Content */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '512px'
            }}>
                {/* Logo/Brand Section */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '32px'
                }}>
                    <img
                        src={Logo}
                        alt="KorePlan Logo"
                        style={{
                            width: '64px',
                            height: '64px',
                            objectFit: 'contain',
                            marginBottom: '16px',
                            transform: 'scale(1)',
                            transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    />
                    <h1 style={{
                        fontSize: '30px',
                        fontWeight: 'bold',
                        color: '#334155',
                        marginBottom: '8px',
                        margin: '0 0 8px 0'
                    }}>
                        KorePlan
                    </h1>
                    <p style={{
                        color: '#64748b',
                        fontSize: '14px',
                        margin: '0'
                    }}>
                        한국 여행의 모든 것을 계획하세요
                    </p>
                </div>

                {/* Signup Card */}
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '32px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Card Glow Effect */}
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        background: 'linear-gradient(to right, rgba(248, 250, 252, 0.5), rgba(241, 245, 249, 0.3))',
                        borderRadius: '24px',
                        filter: 'blur(20px)',
                        opacity: '0.7'
                    }}></div>

                    <div style={{ position: 'relative', zIndex: 10 }}>
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '32px'
                        }}>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#1e293b',
                                marginBottom: '8px'
                            }}>회원가입</h2>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* ID Input */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151',
                                    marginBottom: '8px'
                                }}>
                                    아이디
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div style={{ position: 'relative', flex: '1' }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '0',
                                            left: '0',
                                            bottom: '0',
                                            paddingLeft: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            pointerEvents: 'none'
                                        }}>
                                            <User style={{
                                                width: '20px',
                                                height: '20px',
                                                color: focusedField === 'loginId' ? '#374151' : '#94a3b8',
                                                transition: 'color 0.2s ease'
                                            }} />
                                        </div>
                                        <input
                                            type="text"
                                            name="loginId"
                                            value={formData.loginId}
                                            onChange={handleInputChange}
                                            onFocus={() => setFocusedField('loginId')}
                                            onBlur={() => setFocusedField('')}
                                            placeholder="아이디를 입력하세요"
                                            style={{
                                                width: '100%',
                                                paddingLeft: '48px',
                                                paddingRight: '16px',
                                                paddingTop: '16px',
                                                paddingBottom: '16px',
                                                background: '#f1f5f9',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '16px',
                                                color: '#1e293b',
                                                fontSize: '14px',
                                                outline: 'none',
                                                transition: 'all 0.2s ease',
                                                ...(focusedField === 'loginId' && {
                                                    borderColor: '#64748b',
                                                    boxShadow: '0 0 0 2px rgba(100, 116, 139, 0.2)'
                                                })
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleIdChecked}
                                        style={{
                                            background: idChecked ? '#10b981' : 'linear-gradient(to right, #374151, #4b5563)',
                                            color: 'white',
                                            fontWeight: '500',
                                            padding: '16px 20px',
                                            borderRadius: '16px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {idChecked ? '확인완료' : '중복확인'}
                                    </button>
                                </div>
                            </div>

                            {/* Password Input */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151',
                                    marginBottom: '8px'
                                }}>
                                    비밀번호
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        bottom: '0',
                                        paddingLeft: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        pointerEvents: 'none'
                                    }}>
                                        <Lock style={{
                                            width: '20px',
                                            height: '20px',
                                            color: focusedField === 'password' ? '#374151' : '#94a3b8',
                                            transition: 'color 0.2s ease'
                                        }} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField('')}
                                        placeholder="비밀번호를 입력하세요"
                                        style={{
                                            width: '100%',
                                            paddingLeft: '48px',
                                            paddingRight: '48px',
                                            paddingTop: '16px',
                                            paddingBottom: '16px',
                                            background: '#f1f5f9',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '16px',
                                            color: '#1e293b',
                                            fontSize: '14px',
                                            outline: 'none',
                                            transition: 'all 0.2s ease',
                                            ...(focusedField === 'password' && {
                                                borderColor: '#64748b',
                                                boxShadow: '0 0 0 2px rgba(100, 116, 139, 0.2)'
                                            })
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            top: '0',
                                            right: '0',
                                            bottom: '0',
                                            paddingRight: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: '#94a3b8',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'color 0.2s ease'
                                        }}
                                    >
                                        {showPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Input */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151',
                                    marginBottom: '8px'
                                }}>
                                    비밀번호 확인
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        bottom: '0',
                                        paddingLeft: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        pointerEvents: 'none'
                                    }}>
                                        <Lock style={{
                                            width: '20px',
                                            height: '20px',
                                            color: focusedField === 'confirmPassword' ? '#374151' : '#94a3b8',
                                            transition: 'color 0.2s ease'
                                        }} />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        onFocus={() => setFocusedField('confirmPassword')}
                                        onBlur={() => setFocusedField('')}
                                        placeholder="비밀번호를 다시 입력하세요"
                                        style={{
                                            width: '100%',
                                            paddingLeft: '48px',
                                            paddingRight: '48px',
                                            paddingTop: '16px',
                                            paddingBottom: '16px',
                                            background: '#f1f5f9',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '16px',
                                            color: '#1e293b',
                                            fontSize: '14px',
                                            outline: 'none',
                                            transition: 'all 0.2s ease',
                                            ...(focusedField === 'confirmPassword' && {
                                                borderColor: '#64748b',
                                                boxShadow: '0 0 0 2px rgba(100, 116, 139, 0.2)'
                                            })
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={{
                                            position: 'absolute',
                                            top: '0',
                                            right: '0',
                                            bottom: '0',
                                            paddingRight: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: '#94a3b8',
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'color 0.2s ease'
                                        }}
                                    >
                                        {showConfirmPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
                                    </button>
                                </div>
                            </div>

                            {/* Name Input */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151',
                                    marginBottom: '8px'
                                }}>
                                    이름
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        bottom: '0',
                                        paddingLeft: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        pointerEvents: 'none'
                                    }}>
                                        <UserCheck style={{
                                            width: '20px',
                                            height: '20px',
                                            color: focusedField === 'name' ? '#374151' : '#94a3b8',
                                            transition: 'color 0.2s ease'
                                        }} />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField('')}
                                        placeholder="이름을 입력하세요"
                                        style={{
                                            width: '100%',
                                            paddingLeft: '48px',
                                            paddingRight: '16px',
                                            paddingTop: '16px',
                                            paddingBottom: '16px',
                                            background: '#f1f5f9',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '16px',
                                            color: '#1e293b',
                                            fontSize: '14px',
                                            outline: 'none',
                                            transition: 'all 0.2s ease',
                                            ...(focusedField === 'name' && {
                                                borderColor: '#64748b',
                                                boxShadow: '0 0 0 2px rgba(100, 116, 139, 0.2)'
                                            })
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151',
                                    marginBottom: '8px'
                                }}>
                                    이메일
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <div style={{ position: 'relative', flex: '1' }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: '0',
                                            left: '0',
                                            bottom: '0',
                                            paddingLeft: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            pointerEvents: 'none'
                                        }}>
                                            <Mail style={{
                                                width: '20px',
                                                height: '20px',
                                                color: focusedField === 'email' ? '#374151' : '#94a3b8',
                                                transition: 'color 0.2s ease'
                                            }} />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField('')}
                                            placeholder="이메일을 입력하세요"
                                            style={{
                                                width: '100%',
                                                paddingLeft: '48px',
                                                paddingRight: '16px',
                                                paddingTop: '16px',
                                                paddingBottom: '16px',
                                                background: '#f1f5f9',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '16px',
                                                color: '#1e293b',
                                                fontSize: '14px',
                                                outline: 'none',
                                                transition: 'all 0.2s ease',
                                                ...(focusedField === 'email' && {
                                                    borderColor: '#64748b',
                                                    boxShadow: '0 0 0 2px rgba(100, 116, 139, 0.2)'
                                                })
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={sendEmailVerification}
                                        style={{
                                            background: 'linear-gradient(to right, #7c3aed, #8b5cf6)',
                                            color: 'white',
                                            fontWeight: '500',
                                            padding: '16px 20px',
                                            borderRadius: '16px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        인증
                                    </button>
                                </div>
                            </div>

                            {/* Email Verification Code */}
                            {emailCodeTimer > 0 && (
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: '#374151',
                                        marginBottom: '8px'
                                    }}>
                                        이메일 인증번호
                                    </label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <div style={{ position: 'relative', flex: '1' }}>
                                            <div style={{
                                                position: 'absolute',
                                                top: '0',
                                                left: '0',
                                                bottom: '0',
                                                paddingLeft: '16px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                pointerEvents: 'none'
                                            }}>
                                                <AlertCircle style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    color: focusedField === 'emailCode' ? '#374151' : '#94a3b8',
                                                    transition: 'color 0.2s ease'
                                                }} />
                                            </div>
                                            <input
                                                type="text"
                                                name="emailCode"
                                                value={formData.emailCode}
                                                onChange={handleInputChange}
                                                onFocus={() => setFocusedField('emailCode')}
                                                onBlur={() => setFocusedField('')}
                                                placeholder="인증번호를 입력하세요"
                                                disabled={emailFailCount >= 5}
                                                style={{
                                                    width: '100%',
                                                    paddingLeft: '48px',
                                                    paddingRight: '16px',
                                                    paddingTop: '16px',
                                                    paddingBottom: '16px',
                                                    background: '#f1f5f9',
                                                    border: '1px solid #e2e8f0',
                                                    borderRadius: '16px',
                                                    color: '#1e293b',
                                                    fontSize: '14px',
                                                    outline: 'none',
                                                    transition: 'all 0.2s ease',
                                                    ...(focusedField === 'emailCode' && {
                                                        borderColor: '#64748b',
                                                        boxShadow: '0 0 0 2px rgba(100, 116, 139, 0.2)'
                                                    })
                                                }}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleEmailCodeCheck}
                                            disabled={emailFailCount >= 5}
                                            style={{
                                                background: emailVerified ? '#10b981' : 'linear-gradient(to right, #3b82f6, #2563eb)',
                                                color: 'white',
                                                fontWeight: '500',
                                                padding: '16px 20px',
                                                borderRadius: '16px',
                                                border: 'none',
                                                cursor: emailFailCount >= 5 ? 'not-allowed' : 'pointer',
                                                transition: 'all 0.2s ease',
                                                whiteSpace: 'nowrap',
                                                opacity: emailFailCount >= 5 ? 0.5 : 1
                                            }}
                                        >
                                            {emailVerified ? '완료' : '확인'}
                                        </button>
                                    </div>
                                    
                                    {/* Timer and Status */}
                                    <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                        <div style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock style={{ width: '16px', height: '16px' }} />
                                            {emailCodeTimer > 0 
                                                ? `남은 시간: ${Math.floor(emailCodeTimer / 60)}:${(emailCodeTimer % 60).toString().padStart(2, '0')}`
                                                : "인증번호 만료됨"}
                                        </div>
                                        <div style={{ color: emailFailCount >= 3 ? '#ef4444' : '#64748b' }}>
                                            실패: {emailFailCount} / 5
                                        </div>
                                    </div>

                                    {emailVerified && (
                                        <div style={{ 
                                            marginTop: '8px', 
                                            color: '#10b981', 
                                            fontSize: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            <CheckCircle style={{ width: '16px', height: '16px' }} />
                                            이메일 인증이 완료되었습니다
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Phone Number Input */}
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: '#374151',
                                    marginBottom: '8px'
                                }}>
                                    전화번호
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: '0',
                                        left: '0',
                                        bottom: '0',
                                        paddingLeft: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        pointerEvents: 'none'
                                    }}>
                                        <Phone style={{
                                            width: '20px',
                                            height: '20px',
                                            color: focusedField === 'phoneNumber' ? '#374151' : '#94a3b8',
                                            transition: 'color 0.2s ease'
                                        }} />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        onFocus={() => setFocusedField('phoneNumber')}
                                        onBlur={() => setFocusedField('')}
                                        placeholder="전화번호를 입력하세요"
                                        style={{
                                            width: '100%',
                                            paddingLeft: '48px',
                                            paddingRight: '16px',
                                            paddingTop: '16px',
                                            paddingBottom: '16px',
                                            background: '#f1f5f9',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '16px',
                                            color: '#1e293b',
                                            fontSize: '14px',
                                            outline: 'none',
                                            transition: 'all 0.2s ease',
                                            ...(focusedField === 'phoneNumber' && {
                                                borderColor: '#64748b',
                                                boxShadow: '0 0 0 2px rgba(100, 116, 139, 0.2)'
                                            })
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    background: isLoading ? 'linear-gradient(to right, #374151, #374151)' : 'linear-gradient(to right, #374151, #4b5563)',
                                    color: 'white',
                                    fontWeight: '600',
                                    paddingTop: '16px',
                                    paddingBottom: '16px',
                                    borderRadius: '16px',
                                    border: 'none',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s ease',
                                    transform: 'scale(1)',
                                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    marginBottom: '24px'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isLoading) {
                                        e.target.style.background = 'linear-gradient(to right, #4b5563, #6b7280)';
                                        e.target.style.transform = 'scale(1.02)';
                                        e.target.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isLoading) {
                                        e.target.style.background = 'linear-gradient(to right, #374151, #4b5563)';
                                        e.target.style.transform = 'scale(1)';
                                        e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
                                    }
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <div style={{
                                            width: '20px',
                                            height: '20px',
                                            border: '2px solid rgba(255, 255, 255, 0.3)',
                                            borderTop: '2px solid white',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }}></div>
                                        <span>회원가입 중...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>회원가입</span>
                                        <ArrowRight style={{ width: '20px', height: '20px' }} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Login Link */}
                        <div style={{ textAlign: 'center' }}>
                            <p style={{
                                color: '#64748b',
                                fontSize: '14px',
                                marginBottom: '16px'
                            }}>이미 계정이 있으신가요?</p>
                            <a
                                href="/signIn"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingLeft: '24px',
                                    paddingRight: '24px',
                                    paddingTop: '12px',
                                    paddingBottom: '12px',
                                    background: 'transparent',
                                    border: '1px solid rgba(148, 163, 184, 0.5)',
                                    color: '#64748b',
                                    fontWeight: '500',
                                    borderRadius: '16px',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease',
                                    gap: '8px'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = 'rgba(148, 163, 184, 0.1)';
                                    e.target.style.borderColor = '#94a3b8';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = 'transparent';
                                    e.target.style.borderColor = 'rgba(148, 163, 184, 0.5)';
                                }}
                            >
                                <span>로그인</span>
                                <ArrowRight style={{ width: '16px', height: '16px' }} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '32px',
                    color: '#94a3b8',
                    fontSize: '12px'
                }}>
                    <p>© 2025 KorePlan.</p>
                </div>
            </div>

            {/* Custom Styles */}
            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    input::placeholder {
                        color: #94a3b8;
                    }
                `}
            </style>
        </div>
    );
};

export default SignUpBox;