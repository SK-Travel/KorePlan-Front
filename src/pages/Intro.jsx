import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo from '../assets/sam.png';

const Intro = () => {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#ffffff',
            position: 'relative',
            overflow: 'hidden'
        }}>
            
            <Container fluid style={{ height: '100vh', position: 'relative', zIndex: 1 }}>
                <Row style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Col md={8} lg={6} xl={4} style={{ textAlign: 'center' }}>
                        {/* 로고 섹션 */}
                        <div style={{
                            marginBottom: '2rem',
                            animation: 'fadeInUp 1s ease-out'
                        }}>
                            <div style={{
                                marginBottom: '1rem',
                                display: 'inline-block',
                                animation: 'bounce 2s infinite'
                            }}>
                                <img 
                                    src={Logo} 
                                    alt="KorePlan Logo" 
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        objectFit: 'contain',
                                        borderRadius: '50%',
                                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                                    }}
                                />
                            </div>

                            <p style={{
                                fontSize: '1.2rem',
                                color: 'rgba(255, 255, 255, 0.9)',
                                marginBottom: 0,
                                fontWeight: '300'
                            }}>스마트한 계획 관리 솔루션</p>
                        </div>

                        {/* 설명 섹션 */}
                        <div style={{
                            marginBottom: '3rem',
                            animation: 'fadeInUp 1s ease-out 0.3s both'
                        }}>
                            <h3 style={{
                                fontSize: '1.5rem',
                                color: '#2c3e50',
                                marginBottom: '1rem',
                                fontWeight: '600'
                            }}>맞춤형 여행계획과 실시간 정보</h3>
                            <p style={{
                                fontSize: '1rem',
                                color: '#5a6c7d',
                                lineHeight: '1.6',
                                marginBottom: 0
                            }}>
                                지역별·테마별 여행지부터 진행중인 축제까지,
                                <br />
                                AI가 추천하는 완벽한 국내여행을 경험하세요.
                            </p>
                        </div>

                        {/* 버튼 섹션 */}
                        <div style={{
                            animation: 'fadeInUp 1s ease-out 0.6s both'
                        }}>
                            <Button 
                                as={Link} 
                                to="/signin" 
                                variant="primary" 
                                size="lg" 
                                style={{
                                    background: 'linear-gradient(45deg, #3498db, #2980b9)',
                                    border: 'none',
                                    borderRadius: '50px',
                                    padding: '15px 40px',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    textDecoration: 'none',
                                    boxShadow: '0 8px 25px rgba(52, 152, 219, 0.3)',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 12px 35px rgba(52, 152, 219, 0.4)';
                                    e.target.style.background = 'linear-gradient(45deg, #2980b9, #21618c)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 8px 25px rgba(52, 152, 219, 0.3)';
                                    e.target.style.background = 'linear-gradient(45deg, #3498db, #2980b9)';
                                }}
                            >
                                KorePlan 여행 시작하기
                            </Button>
                            
                            <div style={{ marginTop: '1rem' }}>
                                <small style={{ color: '#95a5a6' }}>
                                    처음 방문하시나요? 
                                    <Link 
                                        to="/signup" 
                                        style={{
                                            color: '#3498db',
                                            textDecoration: 'none',
                                            fontWeight: '500',
                                            marginLeft: '0.25rem',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.color = '#2980b9';
                                            e.target.style.textDecoration = 'underline';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.color = '#3498db';
                                            e.target.style.textDecoration = 'none';
                                        }}
                                    >
                                        회원가입
                                    </Link>
                                </small>
                            </div>
                        </div>

                        {/* 특징 아이콘들 */}
                        <div style={{
                            marginTop: '3rem',
                            animation: 'fadeInUp 1s ease-out 0.9s both'
                        }}>
                            <Row style={{ textAlign: 'center' }}>
                                <Col xs={4}>
                                    <div style={{
                                        background: '#f8f9fa',
                                        borderRadius: '50%',
                                        width: '60px',
                                        height: '60px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 10px',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        border: '2px solid #e9ecef'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = '#e3f2fd';
                                        e.target.style.transform = 'translateY(-3px)';
                                        e.target.style.borderColor = '#3498db';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = '#f8f9fa';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.borderColor = '#e9ecef';
                                    }}>
                                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#3498db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <small style={{
                                        color: '#5a6c7d',
                                        fontSize: '0.9rem',
                                        fontWeight: '500'
                                    }}>지역별 추천</small>
                                </Col>
                                <Col xs={4}>
                                    <div style={{
                                        background: '#f8f9fa',
                                        borderRadius: '50%',
                                        width: '60px',
                                        height: '60px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 10px',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        border: '2px solid #e9ecef'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = '#e3f2fd';
                                        e.target.style.transform = 'translateY(-3px)';
                                        e.target.style.borderColor = '#3498db';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = '#f8f9fa';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.borderColor = '#e9ecef';
                                    }}>
                                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="#3498db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <small style={{
                                        color: '#5a6c7d',
                                        fontSize: '0.9rem',
                                        fontWeight: '500'
                                    }}>축제 정보</small>
                                </Col>
                                <Col xs={4}>
                                    <div style={{
                                        background: '#f8f9fa',
                                        borderRadius: '50%',
                                        width: '60px',
                                        height: '60px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 10px',
                                        transition: 'all 0.3s ease',
                                        cursor: 'pointer',
                                        border: '2px solid #e9ecef'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = '#e3f2fd';
                                        e.target.style.transform = 'translateY(-3px)';
                                        e.target.style.borderColor = '#3498db';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = '#f8f9fa';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.borderColor = '#e9ecef';
                                    }}>
                                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="#3498db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                    <small style={{
                                        color: '#5a6c7d',
                                        fontSize: '0.9rem',
                                        fontWeight: '500'
                                    }}>AI 맞춤 계획</small>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* 인라인 CSS */}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {
                        transform: translateY(0);
                    }
                    40% {
                        transform: translateY(-10px);
                    }
                    60% {
                        transform: translateY(-5px);
                    }
                }

                @media (max-width: 768px) {
                    .intro-container h1 {
                        font-size: 2.5rem !important;
                    }
                    
                    .intro-container .app-subtitle {
                        font-size: 1rem !important;
                    }
                    
                    .intro-container .feature-title {
                        font-size: 1.3rem !important;
                    }
                    
                    .intro-container .feature-description {
                        font-size: 0.95rem !important;
                        padding: 0 1rem;
                    }
                    
                    .intro-container .main-button {
                        padding: 12px 30px !important;
                        font-size: 1rem !important;
                    }
                }

                @media (max-width: 480px) {
                    .intro-container h1 {
                        font-size: 2rem !important;
                    }
                    
                    .intro-container img {
                        width: 60px !important;
                        height: 60px !important;
                    }
                    
                    .intro-container .feature-icon {
                        width: 50px !important;
                        height: 50px !important;
                    }
                    
                    .intro-container .feature-icon svg {
                        width: 24px !important;
                        height: 24px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Intro;