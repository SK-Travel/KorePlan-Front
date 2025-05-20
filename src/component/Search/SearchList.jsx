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
        const errorText = await res.text();
        console.error("에러 응답:", errorText);
        alert("결과를 찾을 수 없습니다.");
        return;
      }

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setSearchResults(data);
        onSelectPlace(data[0]); // 첫 번째 장소를 기본으로 선택
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
              <strong>{place.title}</strong>
              <div>{place.roadAddress}</div>
              <small style={{ color: "#888" }}>{place.category}</small>
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
