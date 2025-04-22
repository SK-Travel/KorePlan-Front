import React from 'react';
import SamplePopData from '../../datas/SamplePopData.js';// 샘플데이터임 나중에 DB 생성 후 수정 예정
import { useState, } from 'react';
import { Button } from 'react-bootstrap';


//인기 순위 Top5 리스트
const PopWhatList = () => {
    //현재 샘플데이터 5개로 초기값 설정  (추후 수정 예정)
    const [posts, setposts] = useState(SamplePopData);
    
    //리스트 모두 li로 만들기.
    const popList = posts.map((item) =>
    <> 
        <li>{item.label}</li>
        <Button >찜하기</Button>
    </>
    );
    return (
        <>
            <div style={{ display: 'flex', height: '700px', width:'500px' ,backgroundColor:'#E0F7FA'}}>
              <ol className="list-group list-group-numbered">{popList}</ol>
            </div>
        </>
    );
};

export default PopWhatList;