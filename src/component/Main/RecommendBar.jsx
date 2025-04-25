import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/KorePlan.css'

const RecommendBar = () => {
    return (
        <>
            {/* 누구랑 가나요?, 무엇을 할까요? 뿌려주는 화면 */}
            <div>
                {/* 누구랑 가나요? */}
                <div className="text-center col-6 py-2">
                    <span className="form-control text-center" style={{backgroundColor:'#FDEB65', width:'222px'}}>실시간 핫한 장소</span>
                    {/* 뿌려주는 박스 */}
                    <div className="form-control" style={{backgroundColor:'#e0f7fa', width:'222px', height:'200px'}}>

                        <div>
                            {/* 여기선 반복문으로 아이템 꺼내는 형식으로 해야 함. */}
                            {/* 지역 이름 */}
                            <h3>1. 부산</h3>
                            {/* 지역 사진 */}
                            <img alt="지역사진" width="150" src="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTAxMzFfMjY2%2FMDAxNzM4Mjk0MDUwNDA1.ZdMN1C_ranofh4sTmXQDWNw9eSkRKRAMptx7Xsq5nqIg.SIMFLgXb2pX9bWNlcYoEWxwklZ1_SPRuFIMqWQ9CGh8g.PNG%2Fimage.png&type=sc960_832"></img>
                        </div>
                    </div>
                </div>

                {/* 무엇을 할까요? */}
                <div className="text-center col-6 py-2">
                    <span className="form-control text-center" style={{backgroundColor:'#FF0B20', width:'222px'}}>실시간 핫한 숙소</span>
                    {/* 뿌려주는 박스 */}
                    <div className="form-control" style={{backgroundColor:'#e0f7fa', width:'222px', height:'200px'}}>

                        <div>
                            {/* 여기선 반복문으로 아이템 꺼내는 형식으로 해야 함. */}
                            {/* 숙소 이름 */}
                            <h3>1. 시그니엘 부산</h3>
                            {/* 숙소 사진 */}
                            <img alt="지역사진" width="100" src="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDEyMjBfNjUg%2FMDAxNzM0Njk5OTUyMDUy.FypC8uqbBpCgTzGAKCFVnG6j7TWQna7Dd9OBS63MiF4g.6mcf8m03s3C9CeeoNVjM7gwAx8cy5OkA8iy9GCy2d0gg.JPEG%2FKakaoTalk_20241219_163211948_08.jpg&type=sc960_832"></img>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default RecommendBar;