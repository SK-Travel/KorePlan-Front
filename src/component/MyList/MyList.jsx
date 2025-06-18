import React, { useState, useEffect } from 'react';

const MyList = () => {
    const [plans, setPlans] = useState([]);
    // 리스트 펼침/접힘 상태
    const [expandedPlans, setExpandedPlans] = useState({});
    // userId는 로컬스토리지나 context 등에서 가져오기
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('jwtToken');

    const [hasLogged, setHasLogged] = useState(false);

    // 전체 저장된 리스트 가져오기
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch('/api/my-plan/list', {
                    method: 'GET',
                    headers: {
                        "userId": userId
                    }
                });
                const data = await response.json();
                if(data.code === 200) {
                    setPlans(data.result);
                    console.log("data 결과값(JSON):", JSON.stringify(data.result, null, 2)); // 🔥 여기서 찍는다
                    
                } else {
                    alert("여행 리스트 조회 실패");
                }
                
            } catch (error) {
                console.log(error);
                alert("서버 요청 실패");
            }
        };
        fetchPlans();
        
    }, [userId]);

    // 삭제 로직
    const deletePlanById = async (planId) => {
        if (!window.confirm("이 일정을 정말 삭제하시겠습니까?")) return;
        try {
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
            alert("서버 요청 실패");
        }
    }


    // 개별 토글
    const togglePlan = (planId) => {
        setExpandedPlans(prev => ({
            ...prev,
            [planId]: !prev[planId]
        }));
    };

    return (
        <div style={{padding: '20px',borderRadius: '12px', border: '1px solid #ddd',boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',backgroundColor: 'white', marginBottom: '20px'}}>
            <h3>나의 여행 리스트</h3>

            {plans.length === 0 && <p>저장된 여행 일정이 없습니다.</p>}
        
            {plans.map((plan, planIdx) => (
                <div key={plan.id} className="d-flex">
                <h4 style={{padding:'12px 10px 0px 0px'}}>{planIdx + 1}</h4>

                <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4> {plan.title} - {plan.startDate && plan.endDate ? `${plan.startDate} ~ ${plan.endDate}` : '날짜 미정'} ({new Set(plan.sendDataDto.map(d => d.day)).size-1}박-{new Set(plan.sendDataDto.map(d => d.day)).size}일)</h4>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => togglePlan(plan.id)}
                                style={{
                                padding: '4px 15px',
                                backgroundColor: '#007BFF',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 6px rgba(0, 123, 255, 0.4)',
                                transition: 'background-color 0.3s, box-shadow 0.3s',
                                }}
                                onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = '#0056b3';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 86, 179, 0.6)';
                                }}
                                onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = '#007BFF';
                                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 123, 255, 0.4)';
                                }}
                            >
                                {expandedPlans[plan.id] ? '▲ 접기' : '▼ 펼치기'}
                            </button>
                            <button
                                onClick={() => deletePlanById(plan.id)}
                                style={{
                                    padding: '4px 10px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    marginLeft: '10px',
                                    boxShadow: '0 2px 6px rgba(220, 53, 69, 0.4)',
                                    transition: 'background-color 0.3s, box-shadow 0.3s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = '#a71d2a';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(167, 29, 42, 0.6)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = '#dc3545';
                                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(220, 53, 69, 0.4)';
                                }}
                            >
                                삭제
                            </button>
                        </div>
                    </div>

                    {expandedPlans[plan.id] && (
                        <div style={{ marginTop: '10px' }}>
                            {Array.from(new Set(plan.sendDataDto.map(loc => loc.day)))
                            .sort((a, b) => a - b)
                            .map(day => (
                                <div key={day} style={{ marginTop: '10px' }}>
                                    <strong>Day {day}</strong>
                                    <ul style={{ paddingLeft: '20px', marginTop: '5px' }}>
                                    {plan.sendDataDto
                                        .filter(loc => loc.day === day)
                                        .sort((a, b) => a.order - b.order)
                                        .map((loc, idx) => (
                                        <li key={idx}>
                                            {loc.order}번째 일정 - {loc.title}
                                        </li>
                                    ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            ))}
        </div>
    );
};

export default MyList;