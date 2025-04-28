import React, {useState} from 'react';
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import { Link } from 'react-router-dom';

const Calendar = () => {
    const [startDate, setStartDate] = useState(new Date());

    return (
        <>
            {/* 달력 나오기 */}
            <div className="d-flex">
                {/* 달력 */}
                <div>
                    <DatePicker 
                        selected={startDate} onChange={(date) => setStartDate(date)} inline // 항상 보여지게 하기
                        locale = {ko} dateFormat="yyyy년 MM월 dd일"
                    />
                </div>
                {/* 계획된 여행 N개 알려주기 */}
                <div>
                    <h1 className="form-control text-black text-center" style={{width:'160px', backgroundColor:'#00FF37'}}>계획된 여행 N개</h1> 
                    <Link to="/myTravel" style={{textDecoration:'none'}}><h1 className="form-control text-black text-center" style={{width:'160px', backgroundColor:'#00FF37'}}>여행계획짜러 가기 ==&gt;</h1></Link>
                </div>
            </div>
        </>
    );
};

export default Calendar;