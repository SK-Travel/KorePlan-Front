import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/KorePlan.css'

const RecommendChooseBar = () => {
    return (
        <>
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
        </>
    );
};

export default RecommendChooseBar;