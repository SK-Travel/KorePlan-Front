import React, { useState, useEffect } from 'react';
import { Trash2, Eye, Calendar, MapPin, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyList = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingIds, setDeletingIds] = useState(new Set());
    const navigate = useNavigate();
    
    // userId는 로컬스토리지나 context 등에서 가져오기
    const userId = localStorage.getItem('userId');

    // 전체 저장된 리스트 가져오기
    const fetchPlans = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('/api/my-plan/list', {
                method: 'GET',
                headers: {
                    "userId": userId
                }
            });
            const data = await response.json();
            if(data.code === 200) {
                setPlans(data.result);
                console.log("data 결과값(JSON):", JSON.stringify(data.result, null, 2));
            } else {
                setError("여행 리스트 조회 실패");
            }
        } catch (error) {
            console.log(error);
            setError("서버 요청 실패");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, [userId]);

    // 삭제 로직
    const deletePlanById = async (planId, e) => {
        e.stopPropagation();
        
        if (deletingIds.has(planId)) return;
        
        if (!window.confirm("이 일정을 정말 삭제하시겠습니까?")) return;
        
        try {
            setDeletingIds(prev => new Set([...prev, planId]));
            
            const response = await fetch(`/api/my-plan/delete/${planId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();

            if (result.code === 200) {
                alert("일정이 삭제되었습니다.");
                setPlans(prev => prev.filter(plan => plan.id !== planId));
                console.log(result.message);
            } 
        } catch (error) {
            console.error(error);
            setError("서버 요청 실패");
        } finally {
            setDeletingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(planId);
                return newSet;
            });
        }
    }

    // 보기 버튼 클릭 시 상세 페이지로 이동
    const handleViewPlan = (planId, e) => {
        e.stopPropagation();
        navigate(`/myplan/edit/${planId}`);
    };

    // 새 계획 생성 페이지로 이동
    const handleCreateNewPlan = () => {
        navigate('/myplan/edit');
    };

    // 로딩 상태
    if (loading) {
        return (
            <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '24px' }}>
                <div style={{
                    background: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '32px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <RefreshCw style={{
                            animation: 'spin 1s linear infinite',
                            width: '32px',
                            height: '32px',
                            color: '#3b82f6',
                            marginRight: '12px'
                        }} />
                        <span style={{
                            fontSize: '18px',
                            color: '#4b5563'
                        }}>여행 계획을 불러오고 있습니다...</span>
                    </div>
                </div>
            </div>
        );
    }

    // 에러 상태
    if (error) {
        return (
            <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '24px' }}>
                <div style={{
                    background: '#ffffff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '32px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ef4444'
                    }}>
                        <AlertCircle style={{ width: '32px', height: '32px', marginRight: '12px' }} />
                        <div>
                            <p style={{ fontSize: '18px', fontWeight: '600' }}>{error}</p>
                            <button 
                                onClick={fetchPlans}
                                style={{
                                    marginTop: '16px',
                                    paddingLeft: '16px',
                                    paddingRight: '16px',
                                    paddingTop: '8px',
                                    paddingBottom: '8px',
                                    background: '#3b82f6',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s ease'
                                }}
                                onMouseOver={(e) => e.target.style.background = '#2563eb'}
                                onMouseOut={(e) => e.target.style.background = '#3b82f6'}
                            >
                                다시 시도
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '24px' }}>
            <div style={{
                background: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                {/* 헤더 */}
                <div style={{
                    borderBottom: '1px solid #e5e7eb',
                    padding: '20px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            flex: 1
                        }}>
                            <Calendar style={{
                                width: '24px',
                                height: '24px',
                                color: '#3b82f6',
                                marginRight: '12px',
                                flexShrink: 0
                            }} />
                            <h1 style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#1f2937',
                                margin: 0,
                                lineHeight: '1.2'
                            }}>나의 여행 리스트</h1>
                        </div>
                        <span style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            marginLeft: '16px',
                            flexShrink: 0
                        }}>
                            총 {plans.length}개
                        </span>
                    </div>
                </div>

                {/* 여행 계획 목록 */}
                <div style={{ 
                    padding: '16px',
                    maxHeight: plans.length > 5 ? '500px' : 'auto',
                    overflowY: plans.length > 5 ? 'auto' : 'visible'
                }}>
                    {plans.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '48px',
                            color: '#6b7280'
                        }}>
                            <Calendar style={{
                                width: '48px',
                                height: '48px',
                                margin: '0 auto 16px',
                                color: '#d1d5db'
                            }} />
                            <p style={{ fontSize: '18px', marginBottom: '8px' }}>아직 여행 계획이 없습니다</p>
                            <p style={{ fontSize: '14px' }}>새로운 여행 계획을 만들어보세요!</p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gap: '12px'
                        }}>
                            {plans.map((plan, planIdx) => {
                                const isDeleting = deletingIds.has(plan.id);
                                const dayCount = new Set(plan.sendDataDto.map(d => d.day)).size;
                                
                                return (
                                    <div
                                        key={plan.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '16px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            transition: 'all 0.2s ease',
                                            cursor: 'default'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        {/* 순번 */}
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '16px',
                                            fontWeight: 'bold',
                                            marginRight: '16px',
                                            flexShrink: 0
                                        }}>
                                            {planIdx + 1}
                                        </div>

                                        {/* 여행 정보 */}
                                        <div style={{ 
                                            flex: 1,
                                            minWidth: 0,
                                            paddingRight: '12px'
                                        }}>
                                            <h3 style={{
                                                fontSize: '18px',
                                                fontWeight: '600',
                                                color: '#1f2937',
                                                margin: '0 0 8px 0',
                                                lineHeight: '1.3',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {plan.title}
                                            </h3>
                                            
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                marginBottom: '4px'
                                            }}>
                                                <Calendar style={{
                                                    width: '14px',
                                                    height: '14px',
                                                    color: '#6b7280',
                                                    marginRight: '6px',
                                                    flexShrink: 0
                                                }} />
                                                <span style={{
                                                    fontSize: '14px',
                                                    color: '#6b7280'
                                                }}>
                                                    {plan.startDate && plan.endDate 
                                                        ? `${plan.startDate} ~ ${plan.endDate}` 
                                                        : '날짜 미정'
                                                    }
                                                </span>
                                            </div>
                                            
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                                <MapPin style={{
                                                    width: '14px',
                                                    height: '14px',
                                                    color: '#6b7280',
                                                    marginRight: '6px',
                                                    flexShrink: 0
                                                }} />
                                                <span style={{
                                                    fontSize: '14px',
                                                    color: '#6b7280'
                                                }}>
                                                    {dayCount > 1 ? `${dayCount-1}박 ${dayCount}일` : '당일치기'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* 액션 버튼들 */}
                                        <div style={{
                                            display: 'flex',
                                            gap: '8px',
                                            flexShrink: 0
                                        }}>
                                            {/* 보기 버튼 */}
                                            <button
                                                onClick={(e) => handleViewPlan(plan.id, e)}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '8px 16px',
                                                    background: '#3b82f6',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.target.style.background = '#2563eb';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.target.style.background = '#3b82f6';
                                                }}
                                            >
                                                <Eye style={{ width: '16px', height: '16px', marginRight: '6px' }} />
                                                보기
                                            </button>

                                            {/* 삭제 버튼 */}
                                            <button
                                                onClick={(e) => deletePlanById(plan.id, e)}
                                                disabled={isDeleting}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '40px',
                                                    height: '40px',
                                                    background: 'transparent',
                                                    border: '1px solid rgba(148, 163, 184, 0.5)',
                                                    color: isDeleting ? '#9ca3af' : '#64748b',
                                                    borderRadius: '8px',
                                                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    flexShrink: 0
                                                }}
                                                onMouseOver={(e) => {
                                                    if (!isDeleting) {
                                                        e.target.style.background = '#fee2e2';
                                                        e.target.style.borderColor = '#fca5a5';
                                                        e.target.style.color = '#dc2626';
                                                    }
                                                }}
                                                onMouseOut={(e) => {
                                                    if (!isDeleting) {
                                                        e.target.style.background = 'transparent';
                                                        e.target.style.borderColor = 'rgba(148, 163, 184, 0.5)';
                                                        e.target.style.color = '#64748b';
                                                    }
                                                }}
                                            >
                                                {isDeleting ? (
                                                    <RefreshCw style={{
                                                        width: '16px',
                                                        height: '16px',
                                                        animation: 'spin 1s linear infinite'
                                                    }} />
                                                ) : (
                                                    <Trash2 style={{ width: '16px', height: '16px' }} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* 새 계획 생성 버튼 */}
                <div style={{
                    borderTop: '1px solid #e5e7eb',
                    padding: '20px'
                }}>
                    <button 
                        onClick={handleCreateNewPlan} 
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '12px 24px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#059669';
                            e.target.style.transform = 'translateY(-1px)';
                            e.target.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#10b981';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 2px 4px rgba(16, 185, 129, 0.2)';
                        }}
                    >
                        <Plus style={{ width: '20px', height: '20px', marginRight: '8px' }} />
                        나만의 여행 계획 생성하기
                    </button>
                </div>
            </div>

            {/* CSS 애니메이션 */}
            <style>{`
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                /* 스크롤바 스타일링 */
                div::-webkit-scrollbar {
                    width: 8px;
                }

                div::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }

                div::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 4px;
                }

                div::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }
            `}</style>
        </div>
    );
};

export default MyList;