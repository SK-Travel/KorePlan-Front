import React from 'react';
import { Link } from 'react-router-dom';

const Top10HP = () => {
    return (
        <div>
            {/* 누구랑 가나요? 뿌려주는 화면*/}
            <div className="text-center col-6 py-2">
                <span className="form-control text-center" style={{backgroundColor:'#FDEB65', width:'280px'}}>실시간 핫한 장소</span>
                {/* 뿌려주는 박스 */}
                <div className="form-control" style={{backgroundColor:'#e0f7fa', width:'280px', height:'240px'}}>

                    <div>
                        {/* 여기선 반복문으로 아이템 꺼내는 형식으로 해야 함. */}
                        {/* 지역 이름 */}
                        <h4>1. 부산</h4>
                        {/* 지역 사진 */}
                        <img alt="지역사진" width="150" src="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTAxMzFfMjY2%2FMDAxNzM4Mjk0MDUwNDA1.ZdMN1C_ranofh4sTmXQDWNw9eSkRKRAMptx7Xsq5nqIg.SIMFLgXb2pX9bWNlcYoEWxwklZ1_SPRuFIMqWQ9CGh8g.PNG%2Fimage.png&type=sc960_832"></img>
                    </div>
                </div>
                <Link to="/hotPlace" style={{ textDecoration: 'none' }}><h1 className="form-control text-black text-center" style={{width:'280px', backgroundColor:'#D900FF'}}>핫플 더 보러 가기 ==&gt; </h1></Link>
            </div>
        </div>
    );
};

export default Top10HP;