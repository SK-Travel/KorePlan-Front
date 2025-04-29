import React, { useState, useEffect } from "react";
import StarIcon from "@mui/icons-material/Star";
import { CustomSelect } from "../../styles/HeaderStyle";
import SamplePopData from "../../datas/Sample/SamplePopData";
import SampleFesData from "../../datas/Sample/SampleFesData";
import SampleHotelData from "../../datas/Sample/SampleHotelData";

//나중에 백엔드 API 연동할 때 똑같은 구조로 realTimeData만 교체하기!!
const realTimeData = {
  spot: SamplePopData.map((item) => item.label),
  hotel: SampleHotelData.map((item) => item.label),
  festival: SampleFesData.map((item) => item.label),
};

const RealTimeRankingBar = () => {
  console.log("▶ realTimeData:", realTimeData);
  const [selected, setSelected] = useState("spot");
  const [index, setIndex] = useState(0);

  const currentList = realTimeData[selected];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % currentList.length);
    }, 2000); // 2초 간격

    return () => clearInterval(interval);
  }, [selected]);

  return (
    
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "60px",                
        fontSize: "16px",              
        padding: "12px 20px", 
        backgroundColor: "#228B22",
        color: "#fff",
        width: "100%",
        maxWidth: "100vw",
        boxSizing: "border-box",
      }}
    >
      <StarIcon style={{ color: "#FFD700", marginRight: "6px" }} />
      <CustomSelect
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value);
          setIndex(0);
        }}
        style={{
          fontSize: "15px",            
          padding: "6px 30px 6px 12px", 
          marginRight: "10px",         
        }}
      >
        <option value="spot">여행지</option>
        <option value="hotel">숙소</option>
        <option value="festival">축제</option>
      </CustomSelect>
      <div
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          marginLeft: "13px",
          flex: 1,
        }}
      >
        실시간 인기{" "}
        {selected === "spot"
          ? "여행지"
          : selected === "hotel"
          ? "숙소"
          : "축제"}{" "}
        ▸&nbsp;
        <strong style={{ color: "#fff" }}>{currentList[index]}</strong>
      </div>
    </div>
  );
};

export default RealTimeRankingBar;
