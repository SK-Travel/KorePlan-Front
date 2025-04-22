import React from 'react';
import SampleFesData from '../../datas/SampleFesData'
import { useState } from 'react';
const Festival = () => {
    const [posts, setposts] = useState(SampleFesData);
    
    //리스트 모두 li로 만들기.
    const festivalList = posts.map((item, idx) => (
        <li key={idx} className="list-group-item">
          <a href="#">{item.label}</a>
        </li>
      ));
    return (
        <div style={{backgroundColor: '#FFF8DC'}}>
              <h3>이달의 축제</h3>
              <ol className="list-group list-group-numbered">{festivalList}</ol>
        </div>
    );
};

export default Festival;