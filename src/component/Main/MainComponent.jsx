import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/KorePlan.css'

const MainComponent = () => {
    return (
        <div className="container">

            {/* 검색 박스 */}
            <div className="search-box d-flex">
                <div className="d-flex align-items-center ml-3">
                    {/* <!-- 돋보기 이미지 --> */}
                    <img alt="검색" width="35" src="https://cdn.pixabay.com/photo/2022/03/06/06/39/search-7050945_960_720.png" />
                    {/* <!-- text --> */}
                    <div className="d-flex ml-4">
                        <input id="searchUserTextByLoginId" type="text" className="form-control" placeholder="여행지를 검색해보세요" style={{ width:'700px', height:'50px'}}/>
                        <button id="searchBtn" className="form-control bg-warning" style={{ width:'100px', height:'50px'}}>검색</button>
                    </div>
                </div>
            </div>





            {/* 누구랑 가나요?, 무엇을 할까요? 테마선택란 */}
            <div className="d-flex justify-content-between align-items-center">

                {/* 누구랑 가나요? */}
                <div className="text-center border-end col-6 py-2 border-bottom">
                    <div>
                        <h1>누구랑 가나요?</h1>

                        {/* 테마 버튼 */}
                        <div className="d-flex justify-content-between px-3">
                            <a href="#" style={{textDecoration:'none'}}><span className="form-control" style={{backgroundColor:'#A4DEF3', width:'100px'}}>가족</span></a>
                            <a href="#" style={{textDecoration:'none'}}><span className="form-control" style={{backgroundColor:'#A4DEF3', width:'100px'}}>친구</span></a>
                            <a href="#" style={{textDecoration:'none'}}><span className="form-control" style={{backgroundColor:'#A4DEF3', width:'100px'}}>연인</span></a>
                            <a href="#" style={{textDecoration:'none'}}><span className="form-control" style={{backgroundColor:'#A4DEF3', width:'100px'}}>혼자</span></a>
                        </div>
                    </div>
                </div>

                {/* 무엇을 할까요? */}
                <div className="text-center border-bottom col-6 py-2">
                    <h1>무엇을 할까요?</h1>

                    {/* 테마 버튼 */}
                    <div className="d-flex justify-content-between px-3">
                        <a href="#" style={{textDecoration:'none'}}><span className="form-control" style={{backgroundColor:'#A4DEF3', width:'100px'}}>힐링</span></a>
                        <a href="#" style={{textDecoration:'none'}}><span className="form-control" style={{backgroundColor:'#A4DEF3', width:'100px'}}>활동</span></a>
                        <a href="#" style={{textDecoration:'none'}}><span className="form-control" style={{backgroundColor:'#A4DEF3', width:'100px'}}>맛집투어</span></a>
                        <a href="#" style={{textDecoration:'none'}}><span className="form-control" style={{backgroundColor:'#A4DEF3', width:'100px'}}>문화체험</span></a>
                    </div>
                </div>
            </div>



            {/* 누구랑 가나요?, 무엇을 할까요? 뿌려주는 화면 */}

            <div className="d-flex justify-content-between align-items-center">

                {/* 누구랑 가나요? */}
                <div className="text-center border-end col-6 py-2">
                    <span className="form-control text-center" style={{backgroundColor:'#FDEB65', width:'300px'}}>실시간 핫한 장소</span>
                    {/* 뿌려주는 박스 */}
                    <div className="form-control" style={{backgroundColor:'#8CCB7E'}}>

                        <div className="d-flex justify-content-around align-items-center">
                            {/* 여기선 반복문으로 아이템 꺼내는 형식으로 해야 함. */}
                            {/* 지역 이름 */}
                            <h2>1. 부산</h2>
                            {/* 지역 사진 */}
                            <img alt="지역사진" width="200" src="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNTAxMzFfMjY2%2FMDAxNzM4Mjk0MDUwNDA1.ZdMN1C_ranofh4sTmXQDWNw9eSkRKRAMptx7Xsq5nqIg.SIMFLgXb2pX9bWNlcYoEWxwklZ1_SPRuFIMqWQ9CGh8g.PNG%2Fimage.png&type=sc960_832"></img>
                        </div>
                    </div>
                </div>

                {/* 무엇을 할까요? */}
                <div className="text-center col-6 py-2">
                    <span className="form-control text-center" style={{backgroundColor:'#FF0B20', width:'300px'}}>실시간 핫한 숙소</span>
                    {/* 뿌려주는 박스 */}
                    <div className="form-control" style={{backgroundColor:'#8CCB7E'}}>

                        <div className="d-flex justify-content-around align-items-center">
                            {/* 여기선 반복문으로 아이템 꺼내는 형식으로 해야 함. */}
                            {/* 숙소 이름 */}
                            <h2>1. 시그니엘 부산</h2>
                            {/* 숙소 사진 */}
                            <img alt="지역사진" width="100" src="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDEyMjBfNjUg%2FMDAxNzM0Njk5OTUyMDUy.FypC8uqbBpCgTzGAKCFVnG6j7TWQna7Dd9OBS63MiF4g.6mcf8m03s3C9CeeoNVjM7gwAx8cy5OkA8iy9GCy2d0gg.JPEG%2FKakaoTalk_20241219_163211948_08.jpg&type=sc960_832"></img>
                        </div>
                    </div>
                </div>

            </div>

            {/* 달력 나오기 */}
            <div className="d-flex">
                {/* 달력 */}
                <div>


                </div>

                {/* 계획된 여행 N개 알려주기 */}
                <div>
                    <h1 className="bg-secondary text-black">계획된 여행 N개가 존재합니다!</h1>
                    
                </div>



            </div>



        </div>
    );
};

export default MainComponent;