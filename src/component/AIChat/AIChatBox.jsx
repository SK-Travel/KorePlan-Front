import React, { useState } from 'react';
import PropTypes from 'prop-types';

const AIChatBox = ({ onExtractLocations }) => {
    // 사용자의 입력 메시지를 저장
    const [message, setMessage] = useState('');

    // 채팅 내역 저장(User And AI)
    const [chatHistory, setChatHistory] = useState([]);

    // 현재 OpenAI 응답을 기다리는 중인지 나타내는 로딩 상태
    const [loading, setLoading] = useState(false);


    // AI응답에서 위도, 경도(위치) 추출 함수
    const extractLocationsFromAIReply = (text) => {
        // 예: "경복궁: 37.579617, 126.977041\n남산타워: 37.551169, 126.988227"
        const lines =  text.split("\n");
        const locations = [];

        lines.forEach(line => {
            // 예: "경복궁: 37.579617, 126.977041"
            const match = line.match(/(.+?):\s*([0-9.]+),\s*([0-9.]+)/);
            if (match) {
                const [, name, lat, lng] = match;

                console.log('추출:', name, lat, lng); 
                locations.push({ name, lat: parseFloat(lat), lng:parseFloat(lng) });
            }
        })
        onExtractLocations(locations);
    }

    // 질문 보내는 비동기처리 함수
    const sendMessage = async () => {
        if(!message.trim()) 
            return; // 빈메시지는 무시

        // 사용자의 메시지를 먼저 대화 내역에 추가
        const userMsg = { role: 'user', content: message };
        setChatHistory(prev => [...prev, userMsg]);     //이전 배열을 복사, 그 뒤에 새 항목을 추가한 새 배열 생성

        // 입력창 비우고 로딩 시작
        setMessage('');
        setLoading(true); // 로딩 시작

        try {
            const response = await fetch('/api/openai/ask', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({message}) // {"message": "~~~~~~~~~~`..........."}
            });

            // 응답은 json이 아닌 텍스트로 받기
            const aiReply = await response.text();

            // AI 응답 대화 내용 추가
            const aiMsg = { role: 'ai', content: aiReply}
            setChatHistory(prev => [...prev, aiMsg]); //이전 배열을 복사, 그 뒤에 새 항목을 추가한 새 배열 생성

            extractLocationsFromAIReply(aiReply);

        } catch (error) {
            // 에러 발생 시, AI 역할로 오류 메시지 출력
            setChatHistory(prev => [...prev, { role: 'ai', content: "오류 발생: " + error }]);
        } finally {
            setLoading(false); // 로딩 종료
        }
    }

    return (
        <div className="d-flex align-items-center justify-content-center text-end" style={{ margin: 20 }}>
            {/* ====== 채팅 히스토리 표시 영역 ====== */}
            <div style={{ minHeight: '200px', overflowY: 'auto',  backgroundColor: '#f9f9f9', padding: 10, borderRadius: 5,
                marginBottom: 10,  border: '1px solid #ccc', width: '800px'}}>

                {chatHistory.map((msg, index) => (
                    <div key={index} style={{textAlign: msg.role === 'user' ? 'right' : 'left', marginBottom: 10}}>
                        <span style={{ display: 'inline-block', backgroundColor: msg.role === 'user' ?  '#DCF8C6' : '#E6E6E6', padding: '8px 12px',
                            borderRadius: 15, maxWidth: '70%', wordBreak: 'break-word',
                            direction: msg.role === 'user' ? 'rtl' : 'ltr',
                            textAlign: 'left'}}>
                            {msg.content}
                        </span>
                    </div>
                ))}

                {/* ====== 메시지 입력 창 ====== */}
                <textarea className="form-control" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="무엇이든 물어보세요" style={{ width: "700px", resize: "vertical", // 세로 크기만 조절 가능
                    padding: "8px", fontSize: "14px", fontFamily: "inherit" }} />
                <br />
                {/* 전송 버튼 */}
                <button type="button" className="btn btn-success" onClick={sendMessage} disabled={loading} style={{ width: '150px'}}>
                    {loading ? '응답 대기 중...': '보내기'}
                </button>
            </div>
        </div>
    );
};

AIChatBox.propTypes = {
    onExtractLocations: PropTypes.func.isRequired
};


export default AIChatBox;