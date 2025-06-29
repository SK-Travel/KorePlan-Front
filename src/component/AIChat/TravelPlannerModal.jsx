import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaCog, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { DayPicker } from 'react-day-picker';
import { ko } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

const themes = [
    { key: '관광지', label: '🏛️ 관광지', color: '#e74c3c' },
    { key: '문화시설', label: '🎭 문화시설', color: '#9b59b6' },
    { key: '레포츠', label: '🏃 레포츠', color: '#3498db' },
    { key: '쇼핑', label: '🛍️ 쇼핑', color: '#e67e22' },
];

// 지역 분류
const metropolitanAreas = [
    '서울특별시', '부산광역시', '대구광역시', '인천광역시', 
    '광주광역시', '대전광역시', '울산광역시', 
    '제주특별자치도'
];

const provinces = [
    '경기도', '강원특별자치도', '충청북도', '충청남도', 
    '전북특별자치도', '전라남도', '경상북도', '경상남도'
];

const TravelPlannerModal = ({ onPlanGenerated, onClose }) => {
    const [step, setStep] = useState(0);
    const [region, setRegion] = useState('');
    const [showWardSelection, setShowWardSelection] = useState(false);
    const [wards, setWards] = useState([]);
    const [selectedWard, setSelectedWard] = useState('');
    const [wardLoading, setWardLoading] = useState(false);
    const [preferences, setPreferences] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [companion, setCompanion] = useState('');
    const [loading, setLoading] = useState(false);

    const companions = ['혼자', '친구', '가족', '연인'];

    const handleToggle = (item) => {
        setPreferences((prev) =>
            prev.includes(item) ? prev.filter(p => p !== item) : [...prev, item]
        );
    };

    const calculateDays = (start, end) => {
        if (!start || !end) return 0;
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    const getDurationText = (days) => {
        if (days === 1) return '당일치기';
        if (days === 2) return '1박 2일';
        if (days === 3) return '2박 3일';
        if (days === 4) return '3박 4일';
        return `${days - 1}박 ${days}일`;
    };

    const isDateRangeExceeded = () => {
        if (!startDate || !endDate) return false;
        const days = calculateDays(startDate, endDate);
        return days > 4;
    };

    // 구/군 목록 가져오기 및 필터링
    const fetchWards = async (regionName) => {
        setWardLoading(true);
        try {
            const response = await fetch(`/api/region-list/regions/${regionName}/wards`);
            const data = await response.json();
            
            // 중복 제거: "수원시", "수원시 팔달구" → "수원시"만 남김
            const allWards = data.wards || [];
            const filteredWards = allWards.filter(ward => {
                // 공백이 없는 ward는 그대로 포함
                if (!ward.includes(' ')) return true;
                
                // "수원시 팔달구" 형태인 경우, "수원시"가 목록에 있으면 제외
                const cityName = ward.split(' ')[0];
                return !allWards.includes(cityName);
            });
            
            setWards(filteredWards);
        } catch (error) {
            console.error('구/군 목록 조회 실패:', error);
            setWards([]);
        } finally {
            setWardLoading(false);
        }
    };

    // 지역 선택 처리
    const handleRegionSelect = async (selectedRegion) => {
        setRegion(selectedRegion);
        setSelectedWard(''); // 지역 변경시 구/군 초기화
        
        if (provinces.includes(selectedRegion)) {
            // 자치도면 구/군 선택 단계로
            await fetchWards(selectedRegion);
            setShowWardSelection(true);
        } else {
            // 광역시/특별시면 바로 다음 단계로
            setShowWardSelection(false);
            setStep(1);
        }
    };

    // 구/군 선택 처리
    const handleWardSelect = (selectedWard) => {
        setSelectedWard(selectedWard);
    };

    // 구/군 선택 완료 후 다음 단계로
    const handleWardConfirm = () => {
        if (selectedWard) {
            setShowWardSelection(false);
            setStep(1);
        }
    };

    // 구/군 선택에서 뒤로가기
    const handleBackToRegion = () => {
        setShowWardSelection(false);
        setSelectedWard('');
        setWards([]);
    };

    const requestPlan = async () => {
        setLoading(true);
        try {
            const days = calculateDays(startDate, endDate);
            const requestData = {
                region,
                days,
                companion,
                preferences: preferences.join(', ')
            };

            // 자치도인 경우 ward 추가
            if (provinces.includes(region) && selectedWard) {
                requestData.ward = selectedWard;
            }

            const response = await fetch('/api/openai/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });
            const plan = await response.json();
            onPlanGenerated({
                plan, 
                days, 
                region: provinces.includes(region) && selectedWard ? `${region} ${selectedWard}` : region,
                startDate: startDate.toISOString().split('T')[0], 
                endDate: endDate.toISOString().split('T')[0]
            });
        } catch (error) {
            alert('계획 생성 중 오류 발생:' + error);
        } finally {
            setLoading(false);
        }
    };

    const isNextEnabled = () => {
        switch (step) {
            case 0: return false; // step 0에서는 지역 선택시 자동으로 넘어감
            case 1: return preferences.length > 0;
            case 2: return startDate && endDate && !isDateRangeExceeded();
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
        // 구/군 선택 중인 경우
        if (showWardSelection) {
            return {
                title: `${region}의 어느 지역인가요?`,
                description: '여행하고 싶은 구/군을 선택해 주세요.',
                isWardSelection: true
            };
        }

        switch (step) {
            case 0:
                return {
                    title: '어느 지역으로 떠날까요?',
                    description: '여행하고 싶은 지역을 선택해 주세요.',
                    options: [...metropolitanAreas, ...provinces],
                    isMulti: false,
                    selected: region,
                    onSelect: handleRegionSelect
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
                    description: '달력에서 여행 날짜를 선택해 주세요. (최대 3박 4일)',
                    isDatePicker: true
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

    const stepData = renderStep();

    const handleDateSelect = (range) => {
        if (range?.from) {
            setStartDate(range.from);
            if (range.to) {
                const diffTime = Math.abs(range.to - range.from);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                
                if (diffDays <= 4) {
                    setEndDate(range.to);
                } else {
                    const maxEndDate = new Date(range.from);
                    maxEndDate.setDate(maxEndDate.getDate() + 3);
                    setEndDate(maxEndDate);
                }
            } else {
                setEndDate(range.from);
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button 
                    onClick={onClose}
                    className="close-button"
                    aria-label="닫기"
                >
                    <FaTimes />
                </button>
                <style>
                    {`
                    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
                    
                    * {
                        font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    }

                    .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.6);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1000;
                        padding: 1rem;
                    }

                    .modal-container {
                        position: relative;
                        padding: 2rem 2rem;
                        background: white;
                        border-radius: 1.5rem;
                        max-width: 600px;
                        width: 100%;
                        max-height: 85vh;
                        overflow-y: auto;
                        text-align: center;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                        transform: scale(0.9);
                        animation: modalAppear 0.3s ease forwards;
                    }

                    .close-button {
                        position: absolute;
                        top: 1.5rem;
                        right: 1.5rem;
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        color: #9ca3af;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        padding: 0.5rem;
                        border-radius: 0.5rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 10;
                    }

                    .close-button:hover {
                        color: #374151;
                        background: #f3f4f6;
                        transform: scale(1.1);
                    }

                    .modal-container::-webkit-scrollbar {
                        width: 8px;
                    }

                    .modal-container::-webkit-scrollbar-track {
                        background: transparent;
                        border-radius: 4px;
                        margin: 1rem 0;
                    }

                    .modal-container::-webkit-scrollbar-thumb {
                        background: #d1d5db;
                        border-radius: 4px;
                    }

                    .modal-container::-webkit-scrollbar-thumb:hover {
                        background: #9ca3af;
                    }

                    @keyframes modalAppear {
                        to {
                            transform: scale(1);
                        }
                    }

                    .step-indicator {
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        font-size: 0.875rem;
                        font-weight: 600;
                        color: #6366f1;
                        background: rgba(99, 102, 241, 0.1);
                        padding: 0.5rem 1rem;
                        border-radius: 2rem;
                        margin-bottom: 1.5rem;
                        border: 1px solid rgba(99, 102, 241, 0.2);
                    }

                    .location-breadcrumb {
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        font-size: 0.875rem;
                        font-weight: 500;
                        color: #6b7280;
                        background: #f9fafb;
                        padding: 0.5rem 1rem;
                        border-radius: 1rem;
                        margin-bottom: 1rem;
                        border: 1px solid #e5e7eb;
                    }

                    .modal-container h2 {
                        font-size: 1.875rem;
                        font-weight: 700;
                        margin: 1rem 0 0.5rem;
                        color: #374151;
                        letter-spacing: -0.025em;
                    }

                    .modal-container p {
                        color: #64748b;
                        font-size: 1rem;
                        margin-bottom: 1.5rem;
                        font-weight: 400;
                    }

                    .option-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                        gap: 0.75rem;
                        padding: 1rem 0;
                        margin-bottom: 1rem;
                    }

                    .option-grid.regions {
                        grid-template-columns: repeat(3, 1fr);
                        max-height: 250px;
                        overflow-y: auto;
                        padding: 1rem;
                        background: #f9fafb;
                        border-radius: 1rem;
                        border: 1px solid #e5e7eb;
                        margin: 0;
                    }

                    .option-grid.wards {
                        grid-template-columns: repeat(3, 1fr);
                        max-height: 300px;
                        overflow-y: auto;
                        padding: 1rem;
                        background: #f9fafb;
                        border-radius: 1rem;
                        border: 1px solid #e5e7eb;
                        margin: 0;
                    }

                    .option-grid.regions::-webkit-scrollbar,
                    .option-grid.wards::-webkit-scrollbar {
                        width: 6px;
                    }

                    .option-grid.regions::-webkit-scrollbar-track,
                    .option-grid.wards::-webkit-scrollbar-track {
                        background: #f1f5f9;
                        border-radius: 3px;
                        margin: 0.5rem 0;
                    }

                    .option-grid.regions::-webkit-scrollbar-thumb,
                    .option-grid.wards::-webkit-scrollbar-thumb {
                        background: #6366f1;
                        border-radius: 3px;
                    }

                    .option-grid.regions::-webkit-scrollbar-thumb:hover,
                    .option-grid.wards::-webkit-scrollbar-thumb:hover {
                        background: #4f46e5;
                    }

                    .option-button {
                        position: relative;
                        padding: 0.875rem 1rem;
                        border-radius: 1rem;
                        font-size: 0.9rem;
                        font-weight: 500;
                        background: white;
                        border: 2px solid #e5e7eb;
                        cursor: pointer;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        color: #374151;
                        min-height: 50px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .option-button:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
                        border-color: #6366f1;
                        background: #f8fafc;
                    }

                    .option-selected {
                        background: #6366f1 !important;
                        color: white !important;
                        border-color: #6366f1 !important;
                        box-shadow: 0 4px 12px -2px rgba(99, 102, 241, 0.4) !important;
                        transform: translateY(-1px);
                    }

                    .loading-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 1rem;
                        padding: 2rem;
                        color: #6b7280;
                    }

                    .date-picker-container {
                        margin-top: 1rem;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 1.5rem;
                        background: #f9fafb;
                        border-radius: 1rem;
                        border: 1px solid #e5e7eb;
                    }

                    .selected-dates {
                        margin-bottom: 1rem;
                        padding: 1rem;
                        background: white;
                        border-radius: 0.75rem;
                        border: 1px solid #e5e7eb;
                        width: 100%;
                    }

                    .selected-dates.exceeded {
                        background: #fef2f2;
                        border-color: #fca5a5;
                    }

                    .date-info {
                        font-size: 0.875rem;
                        color: #6b7280;
                        margin-bottom: 0.5rem;
                    }

                    .date-range {
                        font-size: 1rem;
                        font-weight: 600;
                        color: #374151;
                        margin-bottom: 0.25rem;
                    }

                    .duration-info {
                        font-size: 0.875rem;
                        color: #6366f1;
                        font-weight: 500;
                    }

                    .duration-info.exceeded {
                        color: #dc2626;
                    }

                    .date-limit-warning {
                        font-size: 0.875rem;
                        color: #dc2626;
                        margin-top: 0.25rem;
                        font-weight: 500;
                    }

                    .date-picker-container .rdp {
                        margin: 0;
                    }

                    .date-picker-container .rdp-root {
                        --rdp-accent-color: #6366f1;
                        --rdp-background-color: #6366f1;
                        --rdp-accent-color-dark: #4f46e5;
                        --rdp-background-color-dark: #4f46e5;
                    }

                    .date-picker-container .rdp-day_button:hover {
                        background-color: rgba(99, 102, 241, 0.1);
                        border-radius: 0.5rem;
                    }

                    .nav-button {
                        flex: 1;
                        padding: 0.875rem 1.5rem;
                        border-radius: 1rem;
                        font-weight: 600;
                        font-size: 0.95rem;
                        cursor: pointer;
                        border: none;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.5rem;
                        min-height: 48px;
                    }

                    .nav-button:disabled {
                        background: #e5e7eb;
                        color: #9ca3af;
                        cursor: not-allowed;
                        transform: none;
                    }

                    .next-button {
                        background: #e5e7eb;
                        color: #9ca3af;
                    }

                    .next-enabled {
                        background: #10b981 !important;
                        color: white !important;
                        box-shadow: 0 4px 12px -2px rgba(16, 185, 129, 0.4);
                    }

                    .next-enabled:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 6px 16px -4px rgba(16, 185, 129, 0.5);
                    }

                    .prev-button {
                        background: white;
                        color: #374151;
                        border: 2px solid #e5e7eb;
                    }

                    .prev-button:hover {
                        background: #f9fafb;
                        transform: translateY(-1px);
                        box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.1);
                    }

                    .back-button {
                        background: #f3f4f6;
                        color: #6b7280;
                        border: 2px solid #e5e7eb;
                    }

                    .back-button:hover {
                        background: #e5e7eb;
                        color: #374151;
                        transform: translateY(-1px);
                    }

                    .animate-spin {
                        animation: spin 1s linear infinite;
                    }

                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }

                    @media (max-width: 768px) {
                        .modal-overlay {
                            padding: 0.5rem;
                        }

                        .modal-container {
                            padding: 1.5rem;
                            max-height: 90vh;
                        }

                        .option-grid {
                            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                            gap: 0.5rem;
                        }

                        .option-grid.regions,
                        .option-grid.wards {
                            grid-template-columns: repeat(2, 1fr);
                            max-height: 200px;
                        }

                        .modal-container h2 {
                            font-size: 1.5rem;
                        }

                        .date-picker-container {
                            padding: 1rem;
                        }
                    }

                    @media (max-width: 480px) {
                        .option-grid {
                            grid-template-columns: 1fr 1fr;
                        }

                        .option-grid.regions,
                        .option-grid.wards {
                            grid-template-columns: 1fr;
                        }
                        
                        .nav-button {
                            padding: 0.75rem 1.25rem;
                            font-size: 0.9rem;
                        }
                    }
                    `}
                </style>

                <div className="step-indicator">
                    <span>단계 {showWardSelection ? 1 : step + 1}</span>
                    <span>/</span>
                    <span>4</span>
                </div>

                {/* 선택된 지역 표시 */}
                {region && (
                    <div className="location-breadcrumb">
                        <span>{region}</span>
                        {selectedWard && (
                            <>
                                <span>›</span>
                                <span>{selectedWard}</span>
                            </>
                        )}
                    </div>
                )}

                <h2>{stepData.title}</h2>
                <p>{stepData.description}</p>

                {stepData.isWardSelection ? (
                    // 구/군 선택 화면
                    <div>
                        {wardLoading ? (
                            <div className="loading-container">
                                <FaCog className="animate-spin" style={{ fontSize: '2rem', color: '#6366f1' }} />
                                <span>구/군 목록을 불러오는 중...</span>
                            </div>
                        ) : (
                            <div className="option-grid wards">
                                {wards.map(ward => (
                                    <button
                                        key={ward}
                                        onClick={() => handleWardSelect(ward)}
                                        className={`option-button ${selectedWard === ward ? 'option-selected' : ''}`}
                                    >
                                        {ward}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : stepData.isDatePicker ? (
                    <div className="date-picker-container">
                        {(startDate || endDate) && (
                            <div className={`selected-dates ${isDateRangeExceeded() ? 'exceeded' : ''}`}>
                                <div className="date-info">선택된 여행 일정</div>
                                <div className="date-range">
                                    {startDate?.toLocaleDateString('ko-KR')} 
                                    {endDate && endDate !== startDate && ` ~ ${endDate.toLocaleDateString('ko-KR')}`}
                                </div>
                                <div className={`duration-info ${isDateRangeExceeded() ? 'exceeded' : ''}`}>
                                    {getDurationText(calculateDays(startDate, endDate))}
                                </div>
                                {isDateRangeExceeded() && (
                                    <div className="date-limit-warning">
                                        ⚠️ 최대 3박 4일까지만 선택 가능합니다
                                    </div>
                                )}
                            </div>
                        )}
                        <DayPicker
                            mode="range"
                            selected={{ from: startDate, to: endDate }}
                            onSelect={handleDateSelect}
                            locale={ko}
                            disabled={(date) => {
                                const tomorrow = new Date();
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                return date < tomorrow;
                            }}
                        />
                    </div>
                ) : (
                    <div className={`option-grid ${step === 0 ? 'regions' : ''}`}>
                        {stepData.options?.map(option => {
                            const key = stepData.isTheme ? option.key : option;
                            const label = stepData.isTheme ? option.label : option;
                            const isSelected = stepData.isMulti
                                ? stepData.selected.includes(key)
                                : stepData.selected === key;

                            return (
                                <button
                                    key={key}
                                    onClick={() =>
                                        stepData.isMulti ? stepData.onToggle(key) : stepData.onSelect(key)
                                    }
                                    className={`option-button ${isSelected ? 'option-selected' : ''}`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                    {showWardSelection ? (
                        // 구/군 선택 화면의 버튼들
                        <>
                            <button
                                onClick={handleBackToRegion}
                                className="nav-button back-button"
                            >
                                <FaArrowLeft />
                                지역 다시 선택
                            </button>
                            <button
                                onClick={handleWardConfirm}
                                disabled={!selectedWard}
                                className={`nav-button next-button ${selectedWard ? 'next-enabled' : ''}`}
                            >
                                다음
                            </button>
                        </>
                    ) : (
                        // 일반 단계의 버튼들
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

TravelPlannerModal.propTypes = {
    onPlanGenerated: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default TravelPlannerModal;