import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TravelPlannerModal  = ({ onPlanGenerated  }) => {
    // 사용자가 선택한 입력값 상태 관리
    const [region, setRegion] = useState(''); // 지역명
    const [days, setDays] = useState(3); // 몇 박
    const [companion, setCompanion] = useState(''); // 누구랑
    const [preferences, setPreferences] = useState([]); // 장소 타입
    const [loading, setLoading] = useState(false); // GPT 로딩 상태

    // GPT에게 여행 계획 요청 함수
    const requestPlan = async () => {
        setLoading(true); // 버튼 로딩상태로 전환
        try {
            const response = await fetch('/api/openai/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ region, days, companion,
                    preferences: preferences.join(', ') // 문자열로 변환해 전송
                 }) // 사용자 입력 전송
            });

            const plan = await response.json(); // 응답을 JSON으로 파싱
            // plan은 [{ day, order, region, name, lat, lng }, ...] 형식의 배열
            onPlanGenerated(plan); // 부모 컴포넌트로 계획 전달
        } catch (error) {
            alert("계획 생성 중 오류 발생:", error);
        } finally {
            setLoading(false); // 로딩 종료
        }
    };


    // 단일 선택버튼 UI 생성 함수
    const renderSingleSelect = (options, selected, setter) => (
        <div style={{ marginBottom: '10px' }}>
            {options.map(option => (
                <button key={option} onClick={() => setter(option)} style={{ marginRight: '8px', padding: '6px 12px', 
                    backgroundColor: selected === option ? '#4CAF50' : '#f0f4f9',
                    color: selected === option ? 'white' : 'black',
                    border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer'}}
                >
                    {option}
                </button>
            ))}
        </div>
    );

    // 다중 선택용 버튼 UI
    const renderMultiSelect = (options, selectedList, setter) => (
        <div style={{ marginBottom: '10px' }}>
            {options.map(option => {const selected = selectedList.includes(option);
                return (
                <button key={option} onClick={() => setter(prev => selected ? prev.filter(p => p !== option) // 제거
                    : [...prev, option] // 추가
                    )
                    }
                    style={{
                    marginRight: '8px',
                    padding: '6px 12px',
                    backgroundColor: selected ? '#4CAF50' : '#f0f4f9',
                    color: selected ? 'white' : 'black',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                    }}
                >
                    {option}
                </button>
                );
            })}
        </div>
    );
    return (
        <div className="modal-content p-4">
            {/* 지역 선택 */}
            <div>
                <strong>어디로 가나요?:</strong>
                {renderSingleSelect(['서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원도', 
                    '충청북도', '충청남도', '전북특별자치도', '전라남도', '경상북도', '경상남도', '제주특별자치도',       
                ], region, setRegion)}
            </div>

            {/* 여행 일 수 선택 */}
            <div>
                <strong>며칠 가나요?:</strong>
                {renderSingleSelect([1, 2, 3, 4, 5], days, setDays)}
            </div>
            {/* 동행 선택 */}
            <div>
                <strong>누구와 가나요?</strong>
                {renderSingleSelect(['혼자', '친구', '가족', '연인'], companion, setCompanion)}
            </div>
            {/* 선호 장소 타입 선택 */}
            <div>
                <strong>선호 장소(다중선택 가능)</strong>
                {renderMultiSelect(['자연', '맛집', '쇼핑', '관광지'], preferences, setPreferences)}
            </div>
            {/* 계획 생성 버튼 */}
             <button onClick={requestPlan} disabled={loading || !region || !companion || !preferences.length >= 1 }>
                {loading ? 'GPT 계획 생성 중...' : '계획 생성'}
            </button>
        </div>
    );
};


TravelPlannerModal.propTypes = {
  onPlanGenerated: PropTypes.func.isRequired,
};
// a
export default TravelPlannerModal;