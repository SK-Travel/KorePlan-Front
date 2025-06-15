// import React from 'react';
// import Logo from "../../assets/LogoIcon.png"
// const SignInBox = () => {


//     // 로그인 비동기통신
//     const handleSubmit = async (e) => {
//         //form submit 막는 코드
//         e.preventDefault();
//         //alert("로그인");

//         // validation
//         const loginId = document.getElementById("loginId").value.trim();
//         const password = document.getElementById("password").value.trim();

//         if (!loginId) {
//             alert("아이디를 입력하세요.");
//             return;
//         }

//         if (!password) {
//             alert("비밀번호를 입력하세요.");
//             return;
//         }

//         const userData = {
//             loginId: loginId,
//             password: password
//         }

//         try {
//             const response = await fetch('/api/user/sign-in', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(userData)
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.code === 200) {
//                     alert(data.result);
//                     window.location.href='/mainPage';
//                 } else if (data.code === 400) { // 존재하지 않을 때(둘 중 하나라도 틀렸을 때)
//                     alert("로그인 실패: " + data.error_message);
//                 } else {
//                     alert("로그인 실패: " + data.error_message);
//                 }
//             }
//         } catch (error) {
//             console.log("로그인 실행 중 오류: " + error);
//         }
//     }
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
//         <div className="shadow-box">
//             <div className="sign-in-box justify-content-center align-items-center m-5">
//                     <div className="mb-4">
//                         <h1>로그인</h1>
//                     </div>
//                     {/* <!-- 엔터로 submit이 될 수 있게 form 태그를 만들어줌--> */}
//                     <form id="loginForm" method="post" onSubmit={handleSubmit} >
//                         {/* <!-- id --> */}
//                         <div className="input-group mb-3">
//                             <div className="input-group-prepend">
//                                 <span className="input-group-text">ID</span>
//                             </div>
//                             <input type="text" className="form-control col-8" id="loginId" name="loginId" placeholder="아이디를 입력하세요" />
//                         </div>

//                         {/* <!-- 비밀번호 --> */}
//                         <div className="input-group mb-3">
//                             <div className="input-group-prepend">
//                                 <span className="input-group-text">PW</span>
//                             </div>
//                             <input type="password" className="form-control col-8" id="password" name="password" placeholder="비밀번호를 입력하세요" />
//                         </div>
//                         {/* <!-- 로그인, 회원가입 버튼 --> */}
//                         <input type="submit" className="btn btn-block btn-warning col-9 mt-3" value="로그인" />
//                     </form>
//                     <a className="btn btn-block btn-info col-9 mt-3" href="/signUp">회원가입</a>
//                     <button type="button" className="btn btn-light mt-3" onClick={handleGoogleLogin} style={{ fontSize:'12px', width: '90%' }}>
//                         <i className="bi bi-google"></i> 구글 계정으로 로그인
//                     </button>
//                     {/* <img src={kakaoLoginLogo} alt="카카오 로그인" onClick={handleKakaoLogin}style={{ cursor: 'pointer', width: '200px' }} /> */}
//                     <button type="button" className="btn btn-success" onClick={handleNaverLogin} style={{ fontSize:'12px', width: '90%'  }}>네이버 계정으로 로그인</button>
//             </div>
// 	    </div>
//     );
// };

// export default SignInBox;

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, ArrowRight, Chrome, MessageCircle } from 'lucide-react';
//import Logo from "../../assets/KorePlan.png";
import Logo from "../../assets/LogoIcon.png";
import NaverIcon from '../../assets/NaverIcon.png'
const SignInBox = () => {
    const [formData, setFormData] = useState({
        loginId: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // 기존 로그인 로직 유지
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // validation
        const loginId = formData.loginId.trim();
        const password = formData.password.trim();

        if (!loginId) {
            alert("아이디를 입력하세요.");
            setIsLoading(false);
            return;
        }

        if (!password) {
            alert("비밀번호를 입력하세요.");
            setIsLoading(false);
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
                    window.location.href = '/mainPage';
                } else if (data.code === 400) {
                    alert("로그인 실패: " + data.error_message);
                } else {
                    alert("로그인 실패: " + data.error_message);
                }
            }
        } catch (error) {
            console.log("로그인 실행 중 오류: " + error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    // 기존 소셜 로그인 로직 유지
    const handleGoogleLogin = () => {
        window.location.href = "http://14.63.178.142:8080/oauth2/authorization/google";
    };

    const handleKakaoLogin = () => {
        window.location.href = "http://14.63.178.142:8080/oauth2/authorization/kakao";
    }

    const handleNaverLogin = () => {
        window.location.href = "http://14.63.178.142:8080/oauth2/authorization/naver";
    }

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
                maxWidth: '448px'
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

                {/* Login Card */}
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
                            }}>로그인</h2>
                            
                        </div>

                        <div style={{ marginBottom: '24px' }}>
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
                                        <User style={{
                                            width: '20px',
                                            height: '20px',
                                            color: focusedField === 'loginId' ? '#374151' : '#94a3b8',
                                            transition: 'color 0.2s ease'
                                        }} />
                                    </div>
                                    <input
                                        type="text"
                                        id="loginId"
                                        name="loginId"
                                        value={formData.loginId}
                                        onChange={handleInputChange}
                                        onKeyPress={handleKeyPress}
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
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        onKeyPress={handleKeyPress}
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
                                        onMouseEnter={(e) => e.target.style.color = '#64748b'}
                                        onMouseLeave={(e) => e.target.style.color = '#94a3b8'}
                                    >
                                        {showPassword ? <EyeOff style={{ width: '20px', height: '20px' }} /> : <Eye style={{ width: '20px', height: '20px' }} />}
                                    </button>
                                </div>
                            </div>

                            {/* Login Button */}
                            <button
                                onClick={handleSubmit}
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
                                    gap: '8px'
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
                                        <span>로그인 중...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>로그인</span>
                                        <ArrowRight style={{ width: '20px', height: '20px' }} />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Divider */}
                        <div style={{
                            position: 'relative',
                            margin: '32px 0',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '0',
                                right: '0',
                                height: '1px',
                                background: 'rgba(148, 163, 184, 0.3)'
                            }}></div>
                            <span style={{
                                padding: '0 16px',
                                background: 'white',
                                color: '#64748b',
                                fontSize: '14px'
                            }}>또는</span>
                        </div>

                        {/* Social Login Buttons */}
                        <div style={{ marginBottom: '32px' }}>
                            <button
                                onClick={handleGoogleLogin}
                                style={{
                                    width: '100%',
                                    background: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    color: '#374151',
                                    fontWeight: '500',
                                    paddingTop: '12px',
                                    paddingBottom: '12px',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    marginBottom: '12px'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = '#f1f5f9';
                                    e.target.style.borderColor = '#cbd5e1';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = '#f8fafc';
                                    e.target.style.borderColor = '#e2e8f0';
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span>Google로 시작하기</span>
                            </button>

                            <button
                                onClick={handleKakaoLogin}
                                style={{
                                    width: '100%',
                                    background: '#FEE500',
                                    border: 'none',
                                    color: '#000000',
                                    fontWeight: '500',
                                    paddingTop: '12px',
                                    paddingBottom: '12px',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    marginBottom: '12px'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.opacity = '0.9';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.opacity = '1';
                                }}
                            >
                                <img
                                    src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
                                    alt="Kakao Icon"
                                    style={{ width: '20px', height: '20px' }}
                                />
                                <span>카카오로 시작하기</span>
                            </button>

                            <button
                                onClick={handleNaverLogin}
                                style={{
                                    width: '100%',
                                    background: '#f0fdf4',
                                    border: '1px solid #bbf7d0',
                                    color: '#374151',
                                    fontWeight: '500',
                                    paddingTop: '12px',
                                    paddingBottom: '12px',
                                    borderRadius: '16px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.background = '#dcfce7';
                                    e.target.style.borderColor = '#86efac';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = '#f0fdf4';
                                    e.target.style.borderColor = '#bbf7d0';
                                }}
                            >
                                <img
                                    src={NaverIcon}
                                    alt="네이버 로고"
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        objectFit: 'contain'
                                    }}
                                />
                                <span>네이버로 시작하기</span>
                            </button>
                        </div>

                        {/* Sign Up Link */}
                        <div style={{ textAlign: 'center' }}>
                            <p style={{
                                color: '#64748b',
                                fontSize: '14px',
                                marginBottom: '16px'
                            }}>아직 계정이 없으신가요?</p>
                            <a
                                href="/signUp"
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
                                <span>회원가입</span>
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
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.5; }
                    }
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

export default SignInBox;