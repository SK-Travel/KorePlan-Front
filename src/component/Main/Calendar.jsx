import React, {useState} from 'react';
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";

const Calendar = () => {
    const [startDate, setStartDate] = useState(new Date());

    return (
        <>
            {/* 달력 나오기 */}
            <div>
                {/* 달력 */}
                <div>
                    <DatePicker 
                        selected={startDate} onChange={(date) => setStartDate(date)} inline // 항상 보여지게 하기
                        locale = {ko} dateFormat="yyyy년 MM월 dd일"
                    />
                </div>
                {/* 계획된 여행 N개 알려주기 */}
                <div>
                    <h1 className="bg-secondary form-control text-black" style={{width:'222px'}}>계획된 여행 N개가 존재합니다!</h1> 
                </div>
            </div>
        </>
    );
};

export default Calendar;