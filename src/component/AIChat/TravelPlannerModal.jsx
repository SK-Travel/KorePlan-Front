import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaCog } from 'react-icons/fa'; // 추가

const themes = [
    { key: '관광지', label: '🏛️ 관광지', color: '#e74c3c' },
    { key: '문화시설', label: '🎭 문화시설', color: '#9b59b6' },
    { key: '레포츠', label: '🏃 레포츠', color: '#3498db' },
    { key: '숙박', label: '🏨 숙박', color: '#34495e' },
    { key: '쇼핑', label: '🛍️ 쇼핑', color: '#e67e22' },
    { key: '음식점', label: '🍽️ 음식점', color: '#f1c40f' }
];

const TravelPlannerModal = ({ onPlanGenerated }) => {
    const [step, setStep] = useState(0);
    const [region, setRegion] = useState('');
    const [preferences, setPreferences] = useState([]);
    const [days, setDays] = useState(null);
    const [companion, setCompanion] = useState('');
    const [loading, setLoading] = useState(false);

    const regions = [
        '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시',
        '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원도',
        '충청북도', '충청남도', '전북특별자치도', '전라남도', '경상북도',
        '경상남도', '제주특별자치도'
    ];

    const companions = ['혼자', '친구', '가족', '연인'];

    const dayOptions = ['당일치기', '1박 2일', '2박 3일', '3박 4일', '4박 5일', '5박 6일'];

    const dayValueMap = {
        '당일치기': 1,
        '1박 2일': 2,
        '2박 3일': 3,
        '3박 4일': 4,
        '4박 5일': 5,
        '5박 6일': 6,
    };

    const handleToggle = (item) => {
        setPreferences((prev) =>
            prev.includes(item) ? prev.filter(p => p !== item) : [...prev, item]
        );
    };

    const requestPlan = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/openai/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    region,
                    days,
                    companion,
                    preferences: preferences.join(', ')
                })
            });
            const plan = await response.json();
            onPlanGenerated(plan);
        } catch (error) {
            alert('계획 생성 중 오류 발생:', error);
        } finally {
            setLoading(false);
        }
    };

    const isNextEnabled = () => {
        switch (step) {
            case 0: return region !== '';
            case 1: return preferences.length > 0;
            case 2: return days !== null;
            case 3: return companion !== '';
            default: return false;
        }
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            requestPlan();
        }
    };
    
    const handlePrev = () => {
        if (step > 0) setStep(step - 1);
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return {
                    title: '시/도는 어디로?',
                    description: '여행하고 싶은 지역을 선택해 주세요.',
                    options: regions,
                    isMulti: false,
                    selected: region,
                    onSelect: setRegion
                };
            case 1:
                return {
                    title: '테마는 무엇이 좋을까요?',
                    description: '가고 싶은 장소의 유형을 선택해 주세요.(다중 선택 가능)',
                    options: themes,
                    isMulti: true,
                    selected: preferences,
                    onToggle: handleToggle,
                    isTheme: true
                };
            case 2:
                return {
                    title: '여행 기간은?',
                    description: '원하는 기간을 선택해 주세요.',
                    options: dayOptions,
                    isMulti: false,
                    selected: Object.keys(dayValueMap).find(k => dayValueMap[k] === days),
                    onSelect: (label) => setDays(dayValueMap[label])
                };
            case 3:
                return {
                    title: '누구와 함께 하나요?',
                    description: '동행자를 선택해 주세요.',
                    options: companions,
                    isMulti: false,
                    selected: companion,
                    onSelect: setCompanion
                };
            default:
                return null;
        }
    };

    const {
        title,
        description,
        options,
        isMulti,
        selected,
        onSelect,
        onToggle,
        isTheme
    } = renderStep();

    return (
        <div className="modal-container">
            <style>
                {`
                .modal-container {
                    padding: 2rem;
                    background: white;
                    border-radius: 1.5rem;
                    max-width: 640px;
                    margin: auto;
                    text-align: center;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                }
                .step-indicator {
                    font-size: 0.875rem;
                    color: gray;
                    text-align: right;
                }
                .option-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
                    gap: 1rem;
                    padding: 1rem 0;
                }
                .option-button {
                    padding: 0.75rem 1rem;
                    border-radius: 2rem;
                    font-size: 0.875rem;
                    font-weight: 500;
                    background: #f0f0f0;
                    border: 1px solid #ccc;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .option-button:hover {
                    transform: scale(1.05);
                    background: #e0e0e0;
                }
                .option-selected {
                    background: #3b82f6 !important;
                    color: white;
                    border-color: #3b82f6;
                    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
                }
                .nav-button {
                    flex: 1;
                    padding: 0.75rem;
                    border-radius: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    transition: 0.2s;
                }
                .nav-button:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
                .next-button {
                    background: #ccc;
                    color: black;
                }
                .next-enabled {
                    background:rgb(0, 255, 64) !important;
                    color: black;
                }
                .prev-button {
                    background: #eee;
                    color: #333;
                }
                `}
            </style>

            <div className="step-indicator">{step + 1}/4</div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-gray-500">{description}</p>

            <div className="option-grid">
                {options.map(option => {
                    const key = isTheme ? option.key : option;
                    const label = isTheme ? option.label : option;
                    const isSelected = isMulti
                        ? selected.includes(key)
                        : selected === key;

                    return (
                        <button
                            key={key}
                            onClick={() =>
                                isMulti ? onToggle(key) : onSelect(key)
                            }
                            className={`option-button ${isSelected ? 'option-selected' : ''}`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                {step > 0 ? (
                    <button
                        onClick={handlePrev}
                        className="nav-button prev-button"
                    >
                        이전
                    </button>
                ) : (
                    <div style={{ flex: 1 }} />
                )}

                <button
                    onClick={handleNext}
                    disabled={!isNextEnabled() || loading}
                    className={`nav-button next-button ${isNextEnabled() && !loading ? 'next-enabled' : ''}`}
                >
                    {loading ? (
                        <>
                            <FaCog className="animate-spin" />
                            여행 계획 생성 중...
                        </>
                    ) : step < 3 ? '다음' : '계획생성'}
                </button>
            </div>
        </div>
    );
};

TravelPlannerModal.propTypes = {
    onPlanGenerated: PropTypes.func.isRequired,
};

export default TravelPlannerModal;
