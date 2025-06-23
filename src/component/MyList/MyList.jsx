import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';

const MyList = () => {
    const [plans, setPlans] = useState([]);
    // 리스트 펼침/접힘 상태
    const [expandedPlans, setExpandedPlans] = useState({});
    // userId는 로컬스토리지나 context 등에서 가져오기
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('jwtToken');

    // modal 쓰기 -> 나만의 여행 짤 때(제목과, 몇박 며칠인지만 생성)
    const [showModal, setShowModal] = useState(false);
    const [planTitle, setPlanTitle] = useState('');
    const [days, setDays] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hoverDate, setHoverDate] = useState(null);
    const [placeCountsPerDay, setPlaceCountsPerDay] = useState([]); // index: day-1, value: 몇 개 장소

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


    // 나만의 여행지 리스트 생성하기
    const addMyOwnPlan = async () => {
        // alert("생성");
        
        // validation
        if (!planTitle.trim()) {
            alert("여행 제목을 입력해주세요.");
            return;
        }
        if (!days) {
            alert("여행 기간을 선택해주세요.");
            return;
        }
        if (!startDate || !endDate) {
            alert("출발일을 선택해주세요.");
            return;
        }


        // ===== [추가] placeCountsPerDay 입력 검증 및 travelLists 생성
        if (placeCountsPerDay.length !== days || placeCountsPerDay.some(c => c <= 0)) {
            alert("각 날짜마다 1개 이상의 장소 수를 입력해주세요.");
            return;
        }
        const travelLists = [];
        placeCountsPerDay.forEach((count, dayIdx) => {
            for (let i = 1; i <= count; i++) {
                travelLists.push({ day: dayIdx + 1, order: i});
            }
        });

        try {
            const userId = localStorage.getItem('userId');
            const addMyOwnPlan = {
                userId: Number(userId),
                title: planTitle,
                startDate,
                endDate,
                days,
                travelLists,
            }

            const response = await fetch('/api/my-plan/add-my-plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': userId.toString(),
                },
                body: JSON.stringify(addMyOwnPlan),
            });

            const data = await response.json();
            if (data.code === 200) {
                alert("리스트 추가 성공!");
                console.log(data.success);
                setShowModal(false); // 모달 닫기
                window.location.reload();
            } else {
                alert("리스트 추가 실패! 다시 입력해주세요.");
                console.log(data.error_message);
            }

        } catch (error) {
            console.log("서버 요청 실패: " + error);
        }
    }

    // 달력
    const formatDateToYYYYMMDD = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };
    const normalizeDate = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };


    // 개별 토글
    const togglePlan = (planId) => {
        setExpandedPlans(prev => ({
            ...prev,
            [planId]: !prev[planId]
        }));
    };

    return (
        <div style={{padding: '20px',borderRadius: '12px', border: '1px solid #ddd',boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',backgroundColor: 'white', marginBottom: '20px'}}>
            {showModal && (
                <div style={{ position: 'fixed',  top: 0, left: 0, right: 0, bottom: 0,  backgroundColor: 'rgba(0, 0, 0, 0.5)',display: 'flex', justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                    padding: '20px', 
                }}>
                    <div style={{  backgroundColor: 'white',  padding: '20px', borderRadius: '10px', width: '600px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 2px 10px rgba(0,0,0,0.2)',  }}>
                        <h4>나만의 여행 제목 입력</h4>
                        <input type="text"  value={planTitle}  onChange={(e) => setPlanTitle(e.target.value)}  placeholder="여행(리스트) 제목을 입력하세요"  style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />

                        {/* ✅ 여행 기간 선택 UI */}
                        <label style={{ display: 'block', margin: '10px 0 6px' }}>여행 기간 선택</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                            {[{ label: '당일치기', value: 1 }, { label: '1박 2일', value: 2 }, { label: '2박 3일', value: 3 }, { label: '3박 4일', value: 4 }, { label: '4박 5일', value: 5 },
                            ].map(option => (
                                <button key={option.value} onClick={() => setDays(option.value)}  
                                style={{ padding: '6px 10px', borderRadius: '16px', border: days === option.value ? '2px solid #0f4' : '1px solid #ccc',  backgroundColor: days === option.value ? '#d7ffe0' : '#fff',
                                        fontWeight: days === option.value ? 'bold' : 'normal',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>

                        {/* DayPicker - 날짜 선택 */}
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>출발일 선택</label>
                        <DayPicker
                            mode="single"
                            selected={startDate ? new Date(startDate) : undefined}
                            onDayClick={(date) => {
                                if (!days) {
                                    alert("여행 기간을 먼저 선택해주세요.");
                                    return;
                                }
                                const start = normalizeDate(date);
                                const end = new Date(start);
                                end.setDate(start.getDate() + days - 1);
                                setStartDate(formatDateToYYYYMMDD(start));
                                setEndDate(formatDateToYYYYMMDD(end));
                                setHoverDate(null);
                            }}
                            onDayMouseEnter={(date) => {if (days) setHoverDate(date);}}
                            modifiers={{
                                hovered: hoverDate && days
                                    ? Array.from({ length: days }, (_, i) => {
                                        const d = normalizeDate(hoverDate);
                                        d.setDate(d.getDate() + i);
                                        return d;
                                    }) : [],
                                selected: startDate && days
                                    ? Array.from({ length: days }, (_, i) => {
                                        const d = normalizeDate(new Date(startDate));
                                        d.setDate(d.getDate() + i);
                                        return d;
                                    }) : [],
                            }}
                            modifiersStyles={{ hovered: { backgroundColor: '#e0f2ff' }, selected: { backgroundColor: '#3b82f6', color: 'white' },}}
                            disabled={(date) => { const tomorrow = new Date();  tomorrow.setDate(tomorrow.getDate() + 1); return !days || date < tomorrow;  }}
                        />

                        {/* 출발일/도착일 표시 */}
                        <input type="text" value={startDate} readOnly placeholder="출발일" style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc' }} />
                        <input type="text" value={endDate} readOnly placeholder="도착일" style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                        
                        {/* Day별 장소 수 입력 UI */}
                        {startDate && days >0 && (
                            <div style={{ marginTop: '10px' }}>
                                <h4>각 날짜의 여행지 개수</h4>
                                {[...Array(days)].map((_, idx)=> (
                                    <div key={idx} style={{ marginBottom: '8px' }}>
                                        <label style= {{ width: '80px', display: 'inline-block' }}>Day {idx + 1}</label>
                                        <input type="number" min="1"value={placeCountsPerDay[idx] ?? ''}
                                            onChange={(e) => { const counts = [...placeCountsPerDay]; counts[idx] = Number(e.target.value); setPlaceCountsPerDay(counts);}} 
                                            style={{ width: '60px', marginLeft: '10px', borderRadius: '10px', border: '1px solid #ccc'}}
                                        />
                                        <span style={{ marginLeft: '4px'}}>개</span>
                                    </div>
                                ))}
                            
                            </div>
                        )}


                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button onClick={() => setShowModal(false)} style={{  padding: '10px 20px', backgroundColor: '#ccc',border: 'none', borderRadius: '6px', cursor: 'pointer'  }}>취소</button>
                            <button onClick={addMyOwnPlan} style={{ padding: '6px 12px', backgroundColor: '#0f4', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>생성</button>
                        </div>
                    </div>
                </div>
            )}
            
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


            {/* 나만의 리스트 짜기 */}
            <button onClick={() => setShowModal(true)} style={{ padding: '4px 15px',  backgroundColor: '#0f4', color: 'white',   border: 'none',  borderRadius: '6px',   cursor: 'pointer', fontWeight: 'bold',
                boxShadow: '0 2px 6px rgba(0, 255, 68, 0.4)',
                transition: 'background-color 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#02c536'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 255, 68, 0.4)';}}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0f4'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 255, 68, 0.4)'; }}
            >
                나만의 여행 계획 생성하기
            </button>

        </div>
    );
};

export default MyList;