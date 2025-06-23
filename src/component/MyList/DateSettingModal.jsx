import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';
import { DayPicker } from 'react-day-picker';
import { ko } from 'date-fns/locale';
import moment from 'moment';
import 'react-day-picker/dist/style.css';

const DateSettingModal = ({ 
    open, 
    onClose, 
    onUpdateDates, // EditMyList에서 전달하는 prop 이름과 일치
    initialStartDate = null,
    initialEndDate = null 
}) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // moment 객체를 Date 객체로 안전하게 변환하는 함수
    const momentToDate = (momentObj) => {
        if (!momentObj) return null;
        
        // moment 객체인 경우
        if (moment.isMoment(momentObj)) {
            return momentObj.toDate();
        }
        
        // 이미 Date 객체인 경우
        if (momentObj instanceof Date) {
            return momentObj;
        }
        
        // 문자열인 경우 moment로 파싱 후 Date로 변환
        if (typeof momentObj === 'string') {
            const parsed = moment(momentObj);
            return parsed.isValid() ? parsed.toDate() : null;
        }
        
        return null;
    };

    // 모달이 열릴 때 초기값 설정
    useEffect(() => {
        if (open) {
            console.log('📅 DateModal 열림, 초기값:', { initialStartDate, initialEndDate });
            
            const convertedStartDate = momentToDate(initialStartDate);
            const convertedEndDate = momentToDate(initialEndDate);
            
            console.log('📅 변환된 날짜:', { convertedStartDate, convertedEndDate });
            
            setStartDate(convertedStartDate);
            setEndDate(convertedEndDate);
        }
    }, [open, initialStartDate, initialEndDate]);

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
        if (days === 5) return '4박 5일';
        if (days === 6) return '5박 6일';
        if (days === 7) return '6박 7일';
        return `${days - 1}박 ${days}일`;
    };

    // 날짜 범위가 7일을 초과하는지 확인
    const isDateRangeExceeded = () => {
        if (!startDate || !endDate) return false;
        const days = calculateDays(startDate, endDate);
        return days > 7;
    };

    const handleDateSelect = (range) => {
        console.log('📅 날짜 선택:', range);
        
        if (range?.from) {
            setStartDate(range.from);
            if (range.to) {
                // 선택한 종료일이 시작일로부터 6일 이내인지 확인
                const diffTime = Math.abs(range.to - range.from);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                
                if (diffDays <= 7) {
                    setEndDate(range.to);
                } else {
                    // 7일을 초과하면 시작일로부터 6일 후로 설정 (6박 7일)
                    const maxEndDate = new Date(range.from);
                    maxEndDate.setDate(maxEndDate.getDate() + 6);
                    setEndDate(maxEndDate);
                }
            } else {
                setEndDate(range.from); // 같은 날 선택시 당일치기
            }
        }
    };

    const handleSave = () => {
        if (startDate && endDate && onUpdateDates) {
            console.log('📅 날짜 저장:', { startDate, endDate });
            
            // Date 객체를 moment 객체로 변환하여 전달
            const momentStart = moment(startDate);
            const momentEnd = moment(endDate);
            
            console.log('📅 moment 객체로 변환:', { momentStart, momentEnd });
            
            onUpdateDates(momentStart, momentEnd);
        }
        onClose();
    };

    const isValidDateRange = () => {
        return startDate && endDate && !isDateRangeExceeded();
    };

    if (!open) return null;

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
                        padding: 2rem;
                        background: white;
                        border-radius: 1.5rem;
                        max-width: 500px;
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

                    @keyframes modalAppear {
                        to {
                            transform: scale(1);
                        }
                    }

                    .modal-header {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 0.75rem;
                        margin-bottom: 1.5rem;
                    }

                    .modal-icon {
                        color: #6366f1;
                        font-size: 1.5rem;
                    }

                    .modal-container h2 {
                        font-size: 1.875rem;
                        font-weight: 700;
                        margin: 0;
                        color: #374151;
                        letter-spacing: -0.025em;
                    }

                    .modal-container p {
                        color: #64748b;
                        font-size: 1rem;
                        margin: 0.5rem 0 1.5rem;
                        font-weight: 400;
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

                    .action-buttons {
                        display: flex;
                        gap: 0.75rem;
                        margin-top: 1.5rem;
                    }

                    .action-button {
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

                    .action-button:disabled {
                        background: #e5e7eb;
                        color: #9ca3af;
                        cursor: not-allowed;
                        transform: none;
                    }

                    .cancel-button {
                        background: white;
                        color: #374151;
                        border: 2px solid #e5e7eb;
                    }

                    .cancel-button:hover {
                        background: #f9fafb;
                        transform: translateY(-1px);
                        box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.1);
                    }

                    .save-button {
                        background: #e5e7eb;
                        color: #9ca3af;
                    }

                    .save-button.enabled {
                        background: #10b981 !important;
                        color: white !important;
                        box-shadow: 0 4px 12px -2px rgba(16, 185, 129, 0.4);
                    }

                    .save-button.enabled:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 6px 16px -4px rgba(16, 185, 129, 0.5);
                    }

                    /* 스크롤바 스타일링 */
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

                    @media (max-width: 768px) {
                        .modal-overlay {
                            padding: 0.5rem;
                        }

                        .modal-container {
                            padding: 1.5rem;
                            max-height: 90vh;
                        }

                        .modal-container h2 {
                            font-size: 1.5rem;
                        }

                        .date-picker-container {
                            padding: 1rem;
                        }

                        .action-button {
                            padding: 0.75rem 1.25rem;
                            font-size: 0.9rem;
                        }
                    }
                    `}
                </style>

                <div className="modal-header">
                    <FaCalendarAlt className="modal-icon" />
                    <h2>여행 날짜 설정</h2>
                </div>
                <p>여행 날짜를 선택해 주세요. (최대 6박 7일)</p>

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
                                    ⚠️ 최대 6박 7일까지만 선택 가능합니다
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
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return date < today;
                        }}
                    />
                </div>

                <div className="action-buttons">
                    <button
                        onClick={onClose}
                        className="action-button cancel-button"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!isValidDateRange()}
                        className={`action-button save-button ${isValidDateRange() ? 'enabled' : ''}`}
                    >
                        날짜 적용
                    </button>
                </div>
            </div>
        </div>
    );
};

DateSettingModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpdateDates: PropTypes.func.isRequired,
    initialStartDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    initialEndDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default DateSettingModal;