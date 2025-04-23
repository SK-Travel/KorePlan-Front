import React, { Component } from 'react';
import MyListLogo from '../assets/MyList.png'

class MyList extends Component {
    render() {
        return (
            <div className="text-center">
                <h1>MyList</h1>
                <img src={MyListLogo} alt="내 리스트 로고" width="100"/>
                <div className="bg-success d-flex flex-column align-items-center text-center form-control">
                    <a href="#" style={{textDecoration:'none'}} className='border-bottom w-100 py-2 text-black'><h3>내 정보</h3></a>
                    <a href="#" style={{textDecoration:'none'}} className="border-bottom w-100 py-2 text-black"><h3>My 찜 &리스트</h3></a>
                    <a href="#" style={{textDecoration:'none'}} className="border-bottom w-100 py-2 text-black"><h3>인기차트</h3></a>
                    <a href="#" style={{textDecoration:'none'}} className="w-100 py-2 text-black"><h3>AI 챗봇</h3></a>
                </div>
            </div>

        );
    }
}

export default MyList;