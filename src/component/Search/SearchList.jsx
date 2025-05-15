//검색 결과에 대한 정보 및 결과 주변 추천 장소 보여주는 컴포넌트

import React, { useState } from "react";
import SearchFilterBar from "../Main/SearchFilterBar";

const SearchList = ({ onSelectPlace }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWho, setSelectedWho] = useState(null);
  const [selectedWhat, setSelectedWhat] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    try {
      const res = await fetch(
        `/api/place?keyword=${encodeURIComponent(searchTerm)}`
      );

      if (!res.ok) {
        const errorText = await res.text(); // 404거나 오류 응답인 경우 텍스트로 읽기
        console.error("에러 응답:", errorText);
        alert("장소를 찾을 수 없습니다.");
        return;
      }

      const data = await res.json(); // ✅ OK일 경우에만 json 파싱

      if (data && data.lat && data.lng) {
        const place = {
          name: data.name,
          address: data.address,
          lat: data.lat,
          lng: data.lng,
        };

        setSearchResults([place]);
        onSelectPlace(place);
      } else {
        alert("검색 결과가 없습니다.");
      }
    } catch (err) {
      console.error("서버 호출 실패:", err);
    }
  };

  return (
    <div>
      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearch}
        selectedWho={selectedWho}
        selectedWhat={selectedWhat}
        onSelectWho={setSelectedWho}
        onSelectWhat={setSelectedWhat}
      />

      <div style={{ marginTop: "20px" }}>
        {searchResults.length > 0 ? (
          searchResults.map((place, idx) => (
            <div
              key={idx}
              onClick={() => onSelectPlace(place)}
              style={{
                padding: "10px",
                marginBottom: "8px",
                backgroundColor: "#f9f9f9",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              <strong>{place.name}</strong>
              <div>{place.address}</div>
            </div>
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default SearchList;
