import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/KorePlan.css'
import { Link } from 'react-router-dom';

const Top10HH = () => {
    return (
        <>
            <div>
                {/* 무엇을 할까요? */}
                <div className="text-center col-6 py-2">
                    <span className="form-control text-center" style={{backgroundColor:'#FF0B20', width:'280px'}}>실시간 핫한 숙소</span>
                    {/* 뿌려주는 박스 */}
                    <div className="form-control" style={{backgroundColor:'#e0f7fa', width:'280px', height:'240px'}}>

                        <div>
                            {/* 여기선 반복문으로 아이템 꺼내는 형식으로 해야 함. */}
                            {/* 숙소 이름 */}
                            <h4>1. 시그니엘 부산</h4>
                            {/* 숙소 사진 */}
                            <img alt="지역사진" width="100" src="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDEyMjBfNjUg%2FMDAxNzM0Njk5OTUyMDUy.FypC8uqbBpCgTzGAKCFVnG6j7TWQna7Dd9OBS63MiF4g.6mcf8m03s3C9CeeoNVjM7gwAx8cy5OkA8iy9GCy2d0gg.JPEG%2FKakaoTalk_20241219_163211948_08.jpg&type=sc960_832"></img>
                        </div>
                    </div>
                    <Link to="/hotHotel" style={{ textDecoration: 'none' }}><h1 className="form-control text-black text-center" style={{width:'280px', backgroundColor:'#D900FF'}}>숙소 더 보러 가기 ==&gt; </h1></Link>
                </div>
            </div>
        </>
    );
};

export default Top10HH;