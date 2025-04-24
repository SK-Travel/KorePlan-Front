import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles/KorePlan.css'

const SearchBar = () => {
    return (
        <>
            {/* 검색 박스 */}
        <div className="search-box d-flex" >
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
        </>
    );
};

export default SearchBar;