import React from "react";
import { MapPin, Eye, Calendar, Clock } from "lucide-react";

const Festival_Info_Header = ({ festivalData, stats }) => {
  // festivalData가 없으면 로딩 상태 표시
  if (!festivalData) {
    return (
      <div
        style={{
          padding: "40px 20px",
          textAlign: "center",
          backgroundColor: "#f8fafc",
          borderRadius: "12px",
          margin: "20px 0",
        }}
      >
        <div
          style={{
            width: "200px",
            height: "24px",
            backgroundColor: "#e5e7eb",
            borderRadius: "4px",
            margin: "0 auto 16px",
            animation: "shimmer 1.5s infinite",
          }}
        ></div>
        <div
          style={{
            width: "120px",
            height: "16px",
            backgroundColor: "#e5e7eb",
            borderRadius: "4px",
            margin: "0 auto",
          }}
        ></div>
        <style>
          {`
            @keyframes shimmer {
              0% { opacity: 1; }
              50% { opacity: 0.5; }
              100% { opacity: 1; }
            }
          `}
        </style>
      </div>
    );
  }

  // 카테고리명 변환
  const getCategoryName = (category) => {
    return category || "축제";
  };

  // 지역 정보 포맷팅 (regionName + wardName)
  const formatLocation = () => {
    const parts = [];
    if (festivalData.regionName) parts.push(festivalData.regionName);
    if (
      festivalData.wardName &&
      festivalData.wardName !== festivalData.regionName
    ) {
      parts.push(festivalData.wardName);
    }
    return parts.join(" ");
  };

  // 주소 정보 포맷팅
  const formatAddress = () => {
    const parts = [];
    if (festivalData.addr1) parts.push(festivalData.addr1);
    if (festivalData.addr2) parts.push(festivalData.addr2);
    return parts.join(" ");
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")}`;
  };

  // 축제 기간 포맷팅
  const formatDateRange = () => {
    if (!festivalData.eventStartDate || !festivalData.eventEndDate) {
      return "일정 미정";
    }
    const startDate = formatDate(festivalData.eventStartDate);
    const endDate = formatDate(festivalData.eventEndDate);
    return `${startDate} ~ ${endDate}`;
  };

  // D-day 계산 및 표시
  const getDDayInfo = () => {
    if (!festivalData.eventStartDate || !festivalData.eventEndDate) {
      return { text: "일정 미정", color: "#6b7280" };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(festivalData.eventStartDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(festivalData.eventEndDate);
    endDate.setHours(0, 0, 0, 0);

    const status = festivalData.status;

    if (status === "진행중") {
      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return { text: "마감까지 D-Day", color: "#dc2626" };
      } else if (diffDays > 0) {
        return { text: `마감까지 D-${diffDays}`, color: "#dc2626" };
      } else {
        return { text: "종료됨", color: "#6b7280" };
      }
    } else if (status === "진행예정") {
      const diffTime = startDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return { text: "개최까지 D-Day", color: "#2563eb" };
      } else if (diffDays > 0) {
        return { text: `개최까지 D-${diffDays}`, color: "#2563eb" };
      } else {
        return { text: "진행중", color: "#16a34a" };
      }
    } else {
      return { text: "종료됨", color: "#6b7280" };
    }
  };

  // 축제 상태에 따른 배지 스타일
  const getStatusBadgeStyle = (status) => {
    const baseStyle = {
      padding: "8px 16px",
      borderRadius: "20px",
      fontSize: "14px",
      fontWeight: "600",
      marginBottom: "20px",
      display: "inline-block",
    };

    switch (status) {
      case "진행중":
        return {
          ...baseStyle,
          backgroundColor: "#dcfce7",
          color: "#166534",
          border: "1px solid #bbf7d0",
        };
      case "진행예정":
        return {
          ...baseStyle,
          backgroundColor: "#dbeafe",
          color: "#1e40af",
          border: "1px solid #bfdbfe",
        };
      case "종료됨":
        return {
          ...baseStyle,
          backgroundColor: "#f3f4f6",
          color: "#6b7280",
          border: "1px solid #d1d5db",
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: "#f3f4f6",
          color: "#6b7280",
          border: "1px solid #d1d5db",
        };
    }
  };

  // 숫자 포맷팅 (K 단위)
  const formatNumber = (num) => {
    if (!num) return "0";
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString();
  };

  // 버튼 호버 효과
  const buttonHoverStyle = {
    transition: "all 0.2s ease",
    cursor: "pointer",
  };

  const dDayInfo = getDDayInfo();

  console.log("🎪 FestivalHeader에서 사용할 데이터:", {
    title: festivalData.title,
    regionName: festivalData.regionName,
    wardName: festivalData.wardName,
    addr1: festivalData.addr1,
    addr2: festivalData.addr2,
    category: festivalData.c2Name,
    status: festivalData.status,
    eventStartDate: festivalData.eventStartDate,
    eventEndDate: festivalData.eventEndDate,
  });

  return (
    <div
      style={{
        width: "100%",
        padding: "60px 0",
        textAlign: "center",
        backgroundColor: "white",
        color: "#333",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      {/* 메인 컨텐츠 */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        {/* 상태 배지 */}
        <div style={getStatusBadgeStyle(festivalData.status)}>
          {festivalData.status || "정보없음"}
        </div>
        <div>
          <img src={festivalData.firstimage} />
        </div>
        {/* 축제명 */}
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "700",
            margin: "0 0 16px 0",
            lineHeight: "1.2",
            color: "#1f2937",
          }}
        >
          {festivalData.title || "축제명 없음"}
        </h1>

        {/* 지역 정보 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "18px",
            color: "#6b7280",
            marginBottom: "8px",
          }}
        >
          <MapPin size={20} color="#9ca3af" />
          <span>{formatLocation()}</span>
        </div>

        {/* 상세 주소 */}
        {formatAddress() && (
          <div
            style={{
              fontSize: "16px",
              color: "#9ca3af",
              marginBottom: "24px",
              lineHeight: "1.5",
            }}
          >
            {formatAddress()}
          </div>
        )}

        {/* 축제 기간 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            fontSize: "18px",
            color: "#ef4444",
            fontWeight: "600",
            marginBottom: "40px",
            padding: "16px 24px",
            backgroundColor: "#fef2f2",
            borderRadius: "12px",
            border: "1px solid #fecaca",
            maxWidth: "600px",
            margin: "0 auto 40px",
          }}
        >
          <Calendar size={20} color="#ef4444" />
          <span>{formatDateRange()}</span>
        </div>

        {/* 통계 및 액션 버튼 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          {/* 조회수 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              backgroundColor: "#f0f9ff",
              border: "1px solid #bae6fd",
              borderRadius: "30px",
              ...buttonHoverStyle,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#e0f2fe";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#f0f9ff";
              e.target.style.transform = "translateY(0)";
            }}
          >
            <Eye size={18} color="#0284c7" />
            <span
              style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a" }}
            >
              조회수{" "}
              {formatNumber(festivalData.viewCount || stats?.viewCount || 0)}
            </span>
          </div>

          {/* D-Day 정보 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              backgroundColor: "#fef7ed",
              border: "1px solid #fed7aa",
              borderRadius: "30px",
              ...buttonHoverStyle,
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#fef3e2";
              e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#fef7ed";
              e.target.style.transform = "translateY(0)";
            }}
          >
            <Clock size={18} color="#ea580c" />
            <span
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: dDayInfo.color,
              }}
            >
              {dDayInfo.text}
            </span>
          </div>

          {/* 카테고리 (축제가 아닌 경우만 표시) */}
          {getCategoryName(festivalData.c2Name) !== "축제" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "30px",
                ...buttonHoverStyle,
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#ecfdf5";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#f0fdf4";
                e.target.style.transform = "translateY(0)";
              }}
            >
              <span style={{ fontSize: "18px" }}>🎭</span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#0f172a",
                }}
              >
                {getCategoryName(festivalData.c2Name)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Festival_Info_Header;
