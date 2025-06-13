import React, { useState, useEffect } from 'react';
import { AlertCircle, Users, Clock, DollarSign, Phone, MapPin, Globe, Calendar } from 'lucide-react';

const Festival_Info_Detail = ({ contentId, festivalData }) => {
  const [basicInfo, setBasicInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 축제 기본 정보 API 호출
  useEffect(() => {
    const fetchFestivalBasicInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🎪 축제 기본 정보 API 호출:', contentId);
        // contentTypeId=15 (축제)
        const response = await fetch(`/api/detail/${contentId}/intro?contentTypeId=15`);
        
        if (!response.ok) {
          throw new Error('축제 기본 정보를 불러오는데 실패했습니다.');
        }
        
        const data = await response.json();
        console.log('📋 받은 기본 정보:', data);
        
        // API 응답에서 item 추출
        const item = data.response?.body?.items?.item?.[0] || {};
        setBasicInfo(item);
        
      } catch (err) {
        console.error('❌ 축제 기본 정보 로드 실패:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (contentId) {
      fetchFestivalBasicInfo();
    }
  }, [contentId]);

  // 로딩 상태
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        margin: '20px 0'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>기본 정보를 불러오는 중...</p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '200px',
        padding: '24px',
        textAlign: 'center',
        backgroundColor: '#fef2f2',
        borderRadius: '12px',
        border: '1px solid #fecaca',
        margin: '20px 0'
      }}>
        <AlertCircle size={40} style={{ color: '#ef4444', marginBottom: '12px' }} />
        <p style={{ color: '#dc2626', fontWeight: '500', marginBottom: '8px' }}>
          기본 정보를 불러올 수 없습니다
        </p>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          {error}
        </p>
      </div>
    );
  }

  // 홈페이지 URL 추출 함수
  const extractUrl = (homepageData) => {
    if (!homepageData) return '';
    
    // HTML 태그가 포함된 경우 href 속성에서 URL 추출
    const hrefMatch = homepageData.match(/href=["']([^"']+)["']/);
    if (hrefMatch && hrefMatch[1]) {
      return hrefMatch[1];
    }
    
    // 일반 URL인 경우 그대로 반환
    if (homepageData.startsWith('http')) {
      return homepageData;
    }
    
    // www로 시작하는 경우 http:// 추가
    if (homepageData.startsWith('www.')) {
      return `http://${homepageData}`;
    }
    
    return homepageData;
  };
  const hasSponsorInfo = basicInfo?.sponsor1 || basicInfo?.sponsor2;
  const hasPlaytime = basicInfo?.playtime;
  const hasUsetime = basicInfo?.usetimefestival;
  const hasAddress = festivalData?.addr1 || festivalData?.addr2;
  const hasHomepage = festivalData?.homepage;
  const hasFestivalPeriod = festivalData?.eventStartDate || festivalData?.eventEndDate;

  // 아무 정보도 없으면 컴포넌트를 렌더링하지 않음
  if (!hasSponsorInfo && !hasPlaytime && !hasUsetime && !hasAddress && !hasHomepage && !hasFestivalPeriod) {
    return null;
  }

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      margin: '20px 0',
      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb'
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Users size={28} style={{ color: '#3b82f6' }} />
        기본 정보
      </h2>

      <div style={{
        display: 'grid',
        gap: '24px'
      }}>
        
        {/* 축제 기간 */}
        {hasFestivalPeriod && (
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Calendar size={20} style={{ color: '#8b5cf6' }} />
              축제 기간
            </h3>
            
            <div style={{
              padding: '16px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <span style={{
                fontSize: '16px',
                color: '#1f2937',
                fontWeight: '500'
              }}>
                {festivalData.eventStartDate && festivalData.eventEndDate 
                  ? `${festivalData.eventStartDate} ~ ${festivalData.eventEndDate}`
                  : festivalData.eventStartDate || festivalData.eventEndDate
                }
              </span>
            </div>
          </div>
        )}
        
        {/* 주최자 정보 */}
        {hasSponsorInfo && (
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Users size={20} style={{ color: '#3b82f6' }} />
              주최 정보
            </h3>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              {/* 주최자1 */}
              {basicInfo.sponsor1 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '16px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#6b7280',
                      backgroundColor: '#eff6ff',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}>
                      주최자
                    </span>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#1f2937'
                    }}>
                      {basicInfo.sponsor1}
                    </span>
                  </div>
                  
                  {basicInfo.sponsor1tel && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginLeft: '16px'
                    }}>
                      <Phone size={16} style={{ color: '#6b7280' }} />
                      <span style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        {basicInfo.sponsor1tel}
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {/* 주최자2 */}
              {basicInfo.sponsor2 && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '16px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#6b7280',
                      backgroundColor: '#eff6ff',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}>
                      주관/협력
                    </span>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#1f2937'
                    }}>
                      {basicInfo.sponsor2}
                    </span>
                  </div>
                  
                  {basicInfo.sponsor2tel && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginLeft: '16px'
                    }}>
                      <Phone size={16} style={{ color: '#6b7280' }} />
                      <span style={{
                        fontSize: '14px',
                        color: '#6b7280'
                      }}>
                        {basicInfo.sponsor2tel}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 운영 시간 */}
        {hasPlaytime && (
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Clock size={20} style={{ color: '#10b981' }} />
              운영 시간
            </h3>
            <div style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#4b5563',
              backgroundColor: '#ffffff',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}
            dangerouslySetInnerHTML={{
              __html: basicInfo.playtime.replace(/\n/g, '<br>').replace(/&lt;br&gt;/g, '<br>')
            }}
            />
          </div>
        )}

        {/* 이용 요금 */}
        {hasUsetime && (
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <DollarSign size={20} style={{ color: '#f59e0b' }} />
              이용 요금
            </h3>
            <div style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#4b5563',
              backgroundColor: '#ffffff',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}
            dangerouslySetInnerHTML={{
              __html: basicInfo.usetimefestival.replace(/\n/g, '<br>').replace(/&lt;br&gt;/g, '<br>')
            }}
            />
          </div>
        )}

        {/* 주소 정보 */}
        {hasAddress && (
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <MapPin size={20} style={{ color: '#ef4444' }} />
              주소
            </h3>
            
            <div style={{
              padding: '16px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <span style={{
                fontSize: '16px',
                color: '#1f2937',
                lineHeight: '1.6'
              }}>
                {`${festivalData.addr1 || ''} ${festivalData.addr2 || ''}`.trim()}
              </span>
            </div>
          </div>
        )}

        {/* 홈페이지 정보 */}
        {hasHomepage && (
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Globe size={20} style={{ color: '#8b5cf6' }} />
              홈페이지
            </h3>
            
            <div style={{
              padding: '16px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <a 
                href={extractUrl(festivalData.homepage)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontWeight: '500',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  backgroundColor: '#eff6ff',
                  borderRadius: '8px',
                  border: '1px solid #3b82f6',
                  transition: 'all 0.2s ease',
                  fontSize: '16px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#3b82f6';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#eff6ff';
                  e.target.style.color = '#3b82f6';
                }}
              >
                <Globe size={18} />
                <span>공식 홈페이지 방문</span>
                <span style={{ fontSize: '14px' }}>↗</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Festival_Info_Detail;