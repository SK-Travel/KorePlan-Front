import React from 'react';
import Festival_Info from './Festival_Info';
import Festival_Info_Detail from './Festival_Info_Detail';
import FestivalMap from './FestivalMap';

const FestivalTotal_Info = ({ contentId, festivalData }) => {
  console.log('🎪 FestivalTotal_Info에서 받은 데이터들:', {
    contentId,
    festivalData
  });

  // 필수 데이터가 없는 경우
  if (!contentId || !festivalData) {
    return (
      <div style={{
        backgroundColor: 'white',
        margin: '20px auto',
        maxWidth: '1200px', // 최대 너비 제한
        borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb'
      }}>
        {/* 제목 바 */}
        <div style={{
          backgroundColor: 'white',
          borderBottom: '2px solid #3b82f6',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            margin: 0,
            color: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            🎪 축제 정보
          </h2>
          <button style={{
            padding: '10px 20px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            color: '#374151',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#e5e7eb';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f8fafc';
          }}
          >
            ✏️ 정보 수정 요청
          </button>
        </div>
        
        <div style={{
          padding: '60px 32px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '64px',
            marginBottom: '24px'
          }}>⚠️</div>
          <h3 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '12px',
            margin: '0 0 12px 0'
          }}>축제 정보를 불러올 수 없습니다</h3>
          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            margin: '0 0 24px 0',
            lineHeight: '1.5'
          }}>
            {!contentId && '축제 ID가 없습니다.'}
            {contentId && !festivalData && '축제 데이터가 전달되지 않았습니다.'}
            <br />
            축제 목록에서 다시 선택해주세요.
          </p>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            이전 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      margin: '20px auto',
      maxWidth: '1200px', // 최대 너비 제한
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 제목 바 */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '2px solid #3b82f6',
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          margin: 0,
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          🎪 축제 정보
        </h2>
        <button style={{
          padding: '10px 20px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          color: '#374151',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#e5e7eb';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#f8fafc';
        }}
        >
          ✏️ 정보 수정 요청
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div style={{
        padding: '32px'
      }}>
        
        {/* 축제 기본 정보 - Festival_Info 컴포넌트 */}
        <div style={{
          marginBottom: '40px'
        }}>
          <Festival_Info contentId={contentId} />
        </div>

        {/* 축제 상세 정보 - Festival_Info_Detail 컴포넌트 */}
        <div style={{
          marginBottom: '40px'
        }}>
          <Festival_Info_Detail contentId={contentId} festivalData={festivalData}  />
        </div>

        {/* 축제 위치 - FestivalMap 컴포넌트 */}
        <div style={{
          marginBottom: '0'
        }}>
          <FestivalMap festivalData={festivalData} />
        </div>

      </div>
    </div>
  );
};

export default FestivalTotal_Info;