import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SpotInfo = ({ spotData }) => {
  const location = useLocation();
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // location.state에서 contentTypeId와 기타 정보 추출
  const { contentTypeId, selectedTheme } = location.state || {};

  console.log('🎯 SpotInfo에서 받은 데이터들:', {
    spotData,
    locationState: location.state,
    contentTypeId,
    selectedTheme
  });

  // SpotData가 없으면 로딩 상태 표시
  if (!spotData) {
    return (
      <div style={{
        padding: '40px 20px',
        textAlign: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        margin: '20px 0'
      }}>
        <div style={{
          width: '200px',
          height: '24px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          margin: '0 auto 16px',
          animation: 'shimmer 1.5s infinite'
        }}></div>
        <div style={{
          width: '120px',
          height: '16px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          margin: '0 auto'
        }}></div>
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

  // API 호출
  useEffect(() => {
    const fetchDetailInfo = async () => {
      // ✅ spotData와 location.state에서 필요한 정보 추출
      const contentId = spotData?.contentId;
      
      console.log('🔍 API 호출 정보:', { 
        contentId, 
        contentTypeId,
        selectedTheme,
        spotDataExists: !!spotData 
      });

      if (!contentId || !contentTypeId) {
        console.error('❌ 필수 정보 누락:', { contentId, contentTypeId });
        setError('필수 정보가 누락되었습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8080/api/detail/${contentId}/intro?contentTypeId=${contentTypeId}`
        );
        
        if (!response.ok) {
          throw new Error('데이터를 가져오는데 실패했습니다.');
        }
        
        const data = await response.json();
        console.log('✅ API 응답:', data);
        
        // API 응답에서 첫 번째 아이템 추출
        if (data?.response?.body?.items?.item && data.response.body.items.item.length > 0) {
          const item = data.response.body.items.item[0];
          setDetailData(extractNeededFields(item, contentTypeId));
        } else {
          setError('상세 정보를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('❌ API 호출 오류:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailInfo();
  }, [spotData, contentTypeId]); // contentTypeId도 의존성에 추가

  // 컨텐츠 타입별 필요한 필드만 추출
  const extractNeededFields = (item, typeId) => {
    console.log('🔍 extractNeededFields 호출:', { typeId, item });
    
    switch (String(typeId)) {
      case '12': // 관광지
        return {
          type: '관광지',
          data: {
            '문의전화': item.infocenter || '정보 없음',
            '휴일정보': item.restdate || '정보 없음',
            '이용시간': item.usetime || '정보 없음',
            '주차정보': item.parking || '정보 없음',
            '체험안내': item.expguide || '정보 없음',
            '체험연령': item.expagerange || '정보 없음',
            '이용계절': item.useseason || '정보 없음',
            '반려동물동반': item.chkpet || '정보 없음'
          }
        };

      case '14': // 문화시설
        return {
          type: '문화시설',
          data: {
            '문의전화': item.infocenterculture || '정보 없음',
            '이용시간': item.usetimeculture || '정보 없음',
            '휴관일': item.restdateculture || '정보 없음',
            '주차가능여부': item.parkingculture || '정보 없음',
            '이용요금': item.usefee || '정보 없음',
            '유모차대여': item.chkbabycarriageculture || '정보 없음',
            '신용카드사용': item.chkcreditcardculture || '정보 없음'
          }
        };

      case '28': // 레포츠
        return {
          type: '레포츠',
          data: {
            '문의전화': item.infocenterleports || '정보 없음',
            '예약': item.reservation || '정보 없음',
            '운영시기': item.openperiod || '정보 없음',
            '이용시간': item.usetimeleports || '정보 없음',
            '이용요금': item.usefeeleports || '정보 없음',
            '주차정보': item.parkingleports || '정보 없음',
            '주차요금': item.parkingfeeleports || '정보 없음',
            '유모차대여': item.chkbabycarriageleports || '정보 없음'
          }
        };

      case '32': // 숙박
        return {
          type: '숙박',
          data: {
            '환불규정': item.refundregulation || '정보 없음',
            '체크인시간': item.checkintime || '정보 없음',
            '체크아웃시간': item.checkouttime || '정보 없음',
            '취사가능여부': item.chkcooking || '정보 없음',
            '스포츠시설': item.sports === '1' ? '있음' : '없음',
            '사우나': item.sauna === '1' ? '있음' : '없음',
            '노래방': item.karaoke === '1' ? '있음' : '없음',
            '바베큐장': item.barbecue === '1' ? '있음' : '없음',
            '휘트니스센터': item.fitness === '1' ? '있음' : '없음',
            '식당': item.foodplace || '정보 없음',
            '문의전화': item.infocenterlodging || '정보 없음',
            '주차가능': item.parkinglodging || '정보 없음',
            '예약방법': item.reservationlodging || '정보 없음',
            '예약URL': item.reservationurl || '정보 없음'
          }
        };

      case '38': // 쇼핑
        return {
          type: '쇼핑',
          data: {
            '개장일': item.opendateshopping || '정보 없음',
            '휴무일': item.restdateshopping || '정보 없음',
            '문의전화': item.infocentershopping || '정보 없음',
            '주차정보': item.parkingshopping || '정보 없음',
            '신용카드사용': item.chkcreditcardshopping || '정보 없음',
            '화장실': item.restroom || '정보 없음'
          }
        };

      case '39': // 음식점
        return {
          type: '음식점',
          data: {
            '대표메뉴': item.firstmenu || '정보 없음',
            '문의전화': item.infocenterfood || '정보 없음',
            '주차가능': item.parkingfood || '정보 없음',
            '영업시간': item.opentimefood || '정보 없음',
            '휴무일': item.restdatefood || '정보 없음',
            '신용카드': item.chkcreditcardfood || '정보 없음'
          }
        };

      default:
        return {
          type: '알 수 없음',
          data: {}
        };
    }
  };

  // HTML 태그 제거 함수
  const removeHtmlTags = (str) => {
    if (!str) return '정보 없음';
    return str.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim() || '정보 없음';
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          padding: '32px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>상세 정보를 불러오는 중...</p>
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          padding: '32px',
          textAlign: 'center'
        }}>
          <div style={{
            color: '#ef4444',
            fontSize: '48px',
            marginBottom: '16px'
          }}>⚠️</div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '8px'
          }}>오류 발생</h2>
          <p style={{
            color: '#6b7280',
            marginBottom: '16px'
          }}>{error}</p>
          <button 
            onClick={() => window.history.back()}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '8px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      padding: '32px 16px'
    }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        {/* 헤더 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
            color: 'white',
            padding: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <h1 style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  margin: 0
                }}>
                  {detailData?.type || '장소'} 상세정보
                </h1>
                <p style={{
                  color: 'rgba(255,255,255,0.8)',
                  margin: 0,
                  fontSize: '14px'
                }}>
                  {spotData.title}
                </p>
              </div>
              <button 
                onClick={() => window.history.back()}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
              >
                ← 돌아가기
              </button>
            </div>
          </div>
        </div>

        {/* 기본 정보 카드 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          marginBottom: '24px'
        }}>
          <div style={{ padding: '24px' }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              margin: '0 0 24px 0'
            }}>
              <span style={{ marginRight: '12px', fontSize: '24px' }}>🏢</span>
              기본 정보
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px'
            }}>
              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  장소명
                </span>
                <span style={{
                  color: '#1f2937',
                  fontWeight: '500',
                  fontSize: '16px'
                }}>
                  {spotData.title || '정보 없음'}
                </span>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  주소
                </span>
                <span style={{
                  color: '#1f2937',
                  fontWeight: '500',
                  fontSize: '16px'
                }}>
                  {spotData.addr1 || '정보 없음'}
                </span>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  전화번호
                </span>
                <span style={{
                  color: '#1f2937',
                  fontWeight: '500',
                  fontSize: '16px'
                }}>
                  {spotData.tel || '정보 없음'}
                </span>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  테마
                </span>
                <span style={{
                  color: '#1f2937',
                  fontWeight: '500',
                  fontSize: '16px'
                }}>
                  {selectedTheme || spotData?.selectedTheme || '정보 없음'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 상세 정보 카드 */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '24px' }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              margin: '0 0 24px 0'
            }}>
              <span style={{ marginRight: '12px', fontSize: '24px' }}>📋</span>
              상세 정보
            </h2>
            
            {detailData?.data && Object.keys(detailData.data).length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px'
              }}>
                {Object.entries(detailData.data).map(([key, value]) => (
                  <div key={key} style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    padding: '16px',
                    transition: 'box-shadow 0.2s',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                  onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        {key}
                      </span>
                      <span style={{
                        color: '#1f2937',
                        fontWeight: '500',
                        fontSize: '16px',
                        lineHeight: '1.5'
                      }}>
                        {removeHtmlTags(value)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '48px 0'
              }}>
                <div style={{
                  fontSize: '64px',
                  marginBottom: '16px'
                }}>📭</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>상세 정보가 없습니다</h3>
                <p style={{
                  color: '#6b7280',
                  margin: 0
                }}>해당 콘텐츠의 상세 정보를 찾을 수 없습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* 디버깅 정보 (개발용) */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{
            marginTop: '24px',
            backgroundColor: '#f3f4f6',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <h3 style={{
              fontWeight: 'bold',
              color: '#374151',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>디버깅 정보</h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '4px 0'
            }}>Content ID: {spotData?.contentId}</p>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '4px 0'
            }}>Content Type ID: {contentTypeId}</p>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '4px 0'
            }}>Selected Theme: {selectedTheme}</p>
            <details style={{ marginTop: '8px' }}>
              <summary style={{
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}>
                원본 데이터 보기
              </summary>
              <pre style={{
                marginTop: '8px',
                fontSize: '12px',
                backgroundColor: 'white',
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                overflow: 'auto',
                maxHeight: '300px'
              }}>
                {JSON.stringify({ spotData, detailData, locationState: location.state }, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotInfo;