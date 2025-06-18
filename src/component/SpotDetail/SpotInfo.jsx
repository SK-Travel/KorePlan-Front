import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SpotMap from './SpotMap';
import SpotComment from './SpotComment';

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
        backgroundColor: 'white',
        margin: '20px 0',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* 제목 바 */}
        <div style={{
          backgroundColor: 'white',
          borderBottom: '2px solid #000',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            margin: 0,
            color: '#000'
          }}>상세정보</h2>
          <button style={{
            padding: '8px 16px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            🖊 관련정보 수정요청
          </button>
        </div>
        
        <div style={{
          padding: '40px 20px',
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
          <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>상세 정보를 불러오는 중...</p>
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

  // API 호출
  useEffect(() => {
    const fetchDetailInfo = async () => {
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
          `/api/detail/${contentId}/intro?contentTypeId=${contentTypeId}`
        );
        
        if (!response.ok) {
          throw new Error('데이터를 가져오는데 실패했습니다.');
        }
        
        const data = await response.json();
        console.log('✅ API 응답:', data);
        
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
  }, [spotData, contentTypeId]);

  // 컨텐츠 타입별 필요한 필드만 추출
  const extractNeededFields = (item, typeId) => {
    console.log('🔍 extractNeededFields 호출:', { typeId, item });
    
    switch (String(typeId)) {
      case '12': // 관광지
        return {
          type: '관광지',
          data: {
            '문의 및 안내': item.infocenter || '정보 없음',
            '휴일': item.restdate || '정보 없음',
            '이용시간': item.usetime || '정보 없음',
            '주차': item.parking || '정보 없음',
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
            '문의 및 안내': item.infocenterculture || '정보 없음',
            '이용시간': item.usetimeculture || '정보 없음',
            '휴일': item.restdateculture || '정보 없음',
            '주차': item.parkingculture || '정보 없음',
            '입장료': item.usefee || '정보 없음',
            '유모차대여': item.chkbabycarriageculture || '정보 없음',
            '신용카드사용': item.chkcreditcardculture || '정보 없음'
          }
        };

      case '28': // 레포츠
        return {
          type: '레포츠',
          data: {
            '문의 및 안내': item.infocenterleports || '정보 없음',
            '예약': item.reservation || '정보 없음',
            '운영시기': item.openperiod || '정보 없음',
            '이용시간': item.usetimeleports || '정보 없음',
            '입장료': item.usefeeleports || '정보 없음',
            '주차': item.parkingleports || '정보 없음',
            '주차요금': item.parkingfeeleports || '정보 없음',
            '유모차대여': item.chkbabycarriageleports || '정보 없음'
          }
        };

      case '32': // 숙박
        return {
          type: '숙박',
          data: {
            '문의 및 안내': item.infocenterlodging || '정보 없음',
            '체크인시간': item.checkintime || '정보 없음',
            '체크아웃시간': item.checkouttime || '정보 없음',
            '주차': item.parkinglodging || '정보 없음',
            '취사가능여부': item.chkcooking || '정보 없음',
            '예약방법': item.reservationlodging || '정보 없음',
            '환불규정': item.refundregulation || '정보 없음',
            '부대시설': `${item.sports === '1' ? '스포츠시설 ' : ''}${item.sauna === '1' ? '사우나 ' : ''}${item.karaoke === '1' ? '노래방 ' : ''}${item.barbecue === '1' ? '바베큐장 ' : ''}${item.fitness === '1' ? '휘트니스센터 ' : ''}`.trim() || '정보 없음'
          }
        };

      case '38': // 쇼핑
        return {
          type: '쇼핑',
          data: {
            '문의 및 안내': item.infocentershopping || '정보 없음',
            '휴일': item.restdateshopping || '정보 없음',
            '주차': item.parkingshopping || '정보 없음',
            '신용카드사용': item.chkcreditcardshopping || '정보 없음',
            '화장실': item.restroom || '정보 없음',
            '개장일': item.opendateshopping || '정보 없음'
          }
        };

      case '39': // 음식점
        return {
          type: '음식점',
          data: {
            '문의 및 안내': item.infocenterfood || '정보 없음',
            '주차': item.parkingfood || '정보 없음',
            '영업시간': item.opentimefood || '정보 없음',
            '휴일': item.restdatefood || '정보 없음',
            '신용카드': item.chkcreditcardfood || '정보 없음',
            '대표메뉴': item.firstmenu || '정보 없음'
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
        backgroundColor: 'white',
        margin: '20px 0',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* 제목 바 */}
        <div style={{
          backgroundColor: 'white',
          borderBottom: '2px solid #000',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            margin: 0,
            color: '#000'
          }}>상세정보</h2>
          <button style={{
            padding: '8px 16px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            🖊 관련정보 수정요청
          </button>
        </div>
        
        <div style={{
          padding: '40px 20px',
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
          <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>상세 정보를 불러오는 중...</p>
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
        backgroundColor: 'white',
        margin: '20px 0',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* 제목 바 */}
        <div style={{
          backgroundColor: 'white',
          borderBottom: '2px solid #000',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            margin: 0,
            color: '#000'
          }}>상세정보</h2>
          <button style={{
            padding: '8px 16px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            🖊 관련정보 수정요청
          </button>
        </div>
        
        <div style={{
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            color: '#ef4444',
            fontSize: '48px',
            marginBottom: '16px'
          }}>⚠️</div>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>오류 발생</h3>
          <p style={{
            color: '#6b7280',
            marginBottom: '16px',
            margin: '0 0 16px 0'
          }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      margin: '20px 0',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 제목 바 */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '2px solid #000',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          margin: 0,
          color: '#000'
        }}>상세정보</h2>
        <button style={{
          padding: '8px 16px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          🖊 관련정보 수정요청
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div style={{
        padding: '30px'
      }}>
        {/* 장소 설명 - SpotComment 컴포넌트 사용 */}
        <div style={{
          marginBottom: '30px'
        }}>
          <SpotComment contentId={spotData?.contentId} />
        </div>

        {/* 지도 영역 - SpotMap 컴포넌트 사용 */}
        <div style={{
          marginBottom: '30px'
        }}>
          <SpotMap spotData={spotData} />
        </div>

        {/* 세부 정보 그리드 */}
        {detailData?.data && Object.keys(detailData.data).length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '20px'
          }}>
            {Object.entries(detailData.data).map(([key, value], index) => (
              <div key={key} style={{
                padding: '0',
                borderBottom: index < Object.keys(detailData.data).length - 2 ? '1px solid #eee' : 'none',
                paddingBottom: '15px',
                marginBottom: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <div style={{
                    minWidth: '8px',
                    height: '8px',
                    backgroundColor: '#dc3545',
                    borderRadius: '50%',
                    marginTop: '8px',
                    flexShrink: 0
                  }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#333',
                      marginBottom: '8px'
                    }}>
                      {key}
                    </div>
                    <div style={{
                      fontSize: '15px',
                      color: '#666',
                      lineHeight: '1.5'
                    }}>
                      {removeHtmlTags(value)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>📭</div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>상세 정보가 없습니다</h3>
            <p style={{
              color: '#6b7280',
              margin: 0,
              fontSize: '14px'
            }}>해당 콘텐츠의 상세 정보를 찾을 수 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotInfo;