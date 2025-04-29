import React, { useState, useEffect } from "react";
import StarIcon from "@mui/icons-material/Star";
import { CustomSelect } from "../../styles/HeaderStyle";
const realTimeData = {
  spot: [
    "부산 해운대",
    "서울 남산타워",
    "제주 성산일출봉",
    "강릉 경포대",
    "여수 오동도",
  ],
  hotel: [
    "롯데호텔 서울",
    "신라호텔",
    "파라다이스시티",
    "그랜드하얏트 제주",
    "해비치 호텔",
  ],
  festival: [
    "진해 군항제",
    "함평 나비축제",
    "안동 탈춤축제",
    "화천 산천어축제",
    "보령 머드축제",
  ],
};

const RealTimeRankingBar = () => {
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
        fontSize: "14px",
        padding: "8px 16px",
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
