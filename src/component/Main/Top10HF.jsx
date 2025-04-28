import React from 'react';
import { Link } from 'react-router-dom';

const Top10HF = () => {
    return (
        <>
            {/* 페스티벌 뿌려주는 화면 */}
            <div>
                {/* 페스티벌 */}
                <div className="text-center col-6 py-2">
                    <span className="form-control text-center" style={{backgroundColor:'#0800e1', width:'280px'}}>실시간 핫한 축제</span>
                    {/* 뿌려주는 박스 */}
                    <div className="form-control" style={{backgroundColor:'#e0f7fa', width:'280px', height:'240px'}}>

                        <div>
                            {/* 여기선 반복문으로 아이템 꺼내는 형식으로 해야 함. */}
                            {/* 숙소 이름 */}
                            <h4>1. 제주 마노르블랑 루피너스 꽃향기축제</h4>
                            {/* 숙소 사진 */}
                            <img alt="지역사진" width="150" src="https://search.pstatic.net/common?type=b&size=672&quality=95&direct=true&src=https%3A%2F%2Fcsearch-phinf.pstatic.net%2F20250317_208%2F1742174288005SK7p9_JPEG%2F3482451_image2_1.jpg"></img>
                        </div>
                    </div>
                    <Link to="/festival" style={{ textDecoration: 'none' }}><h1 className="form-control text-black text-center" style={{width:'280px', backgroundColor:'#D900FF'}}>축제 더 보러 가기 ==&gt; </h1></Link>
                </div>

            </div>
    </>
    );
};

export default Top10HF;