import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Top5Place from './Top5Place';
import Top5Hotel from './Top5Hotel';
import Top5Festival from './Top5Festival';


// 메인 Top5Section 컴포넌트
const Top5Section = () => {
  const [activeTab, setActiveTab] = useState('여행지');
  const navigate = useNavigate();

  // 탭 설정
  const tabs = [
    { key: '여행지', label: '여행지' },
    { key: '숙소', label: '숙소' },
    { key: '축제', label: '축제' }
  ];

  // 현재 활성 탭에 따른 컴포넌트 렌더링
  const renderCurrentTab = () => {
    switch (activeTab) {
      case '여행지':
        return <Top5Place />;
      case '숙소':
        return <Top5Hotel />;
      case '축제':
        return <Top5Festival />;
      default:
        return <Top5Place />;
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '48px 16px',
      borderBottom: '2px solid #e5e7eb'
    }}>
      {/* 헤더 섹션 */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '8px'
        }}>
          🔥 지금 가장 인기있는 <span style={{ color: '#3b82f6' }}>{activeTab}</span> TOP 5
        </h2>
        <p style={{
          color: '#6b7280'
        }}>
          사용자 데이터 기반 추천 {activeTab} 를 알려드려요.
        </p>
      </div>


      {/* 탭 네비게이션 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '48px'
      }}>
        <div style={{
          backgroundColor: '#3b82f6',
          borderRadius: '50px',
          padding: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          gap: '8px' // 버튼들 사이 간격 추가
        }}>
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '12px 32px',
                borderRadius: '50px',
                fontWeight: '400',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: activeTab === tab.key ? '#ffffff' : 'transparent',
                color: activeTab === tab.key ? '#3b82f6' : '#ffffff',
                boxShadow: activeTab === tab.key ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
                transform: activeTab === tab.key ? 'scale(1.05)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.key) {
                  e.target.style.backgroundColor = '#2563eb';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.key) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>



      {/* 탭별 컴포넌트 렌더링 - 슬라이드 컨테이너 */}
      <div style={{
        position: 'relative',
        minHeight: '400px',
        paddingTop: '32px', // 탭과 카드 사이 여백 증가
        marginTop: '24px'   // 추가 여백
      }}>
        {renderCurrentTab()}
      </div>


    </div>
  );
};

export default Top5Section;