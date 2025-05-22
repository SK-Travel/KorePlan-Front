import React, { useState } from 'react';

const AIChatBox = () => {
    // 사용자의 입력 메시지를 저장
    const [message, setMessage] = useState('');

    // Open AI로부터 받은 응답 저장
    const [response, setResponse] = useState('');

    // 로딩 상태(API 요청 중일 때 true)
    const [loading, setLoading] = useState(false);

    // 질문 보내는 비동기처리 함수
    const sendMessage = async () => {
        if(!message.trim()) 
            return; // 빈메시지는 무시

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
            const data = await response.text();
            setResponse(data);
        } catch (error) {
            setResponse("오류 발생: " + error);
        } finally {
            setLoading(false); // 로딩 종료
        }
    }

    return (
        <div style={{ margin: 20 }}>

            {/* 질문 입력 창 */}
            <textarea className="form-control" rows={5}  cols={50}  placeholder="여행지를 물어보세요" value={message} onChange={(e) => setMessage(e.target.value)}
                style={{
                    width: "800px",
                    height: "150px",  // 높이 고정
                    resize: "vertical", // 사용자가 세로 크기만 조절 가능하게
                    overflowY: "auto",  // 세로 스크롤 자동
                    padding: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                }}
            />
            <br />

            {/* 질문 보내기 버튼 */}
            <button type="button" className="btn form-control"  style={{backgroundColor: 'green', width:'150px'}} onClick={sendMessage} disabled={loading} >
                {loading ? "응답 대기 중..." : "물어보기"}
            </button>

            {/* 응답 결과 출력 */}
            <pre style={{whiteSpace: "pre-wrap", backgroundColor: "#f4f4f4", padding: 10, marginTop: 20, borderRadius: 5, 
                maxHeight: 400, 
                overflowY: "auto",
                fontFamily: "monospace",
                fontSize: 14,
                }}
            >
                {response}
            </pre>
        </div>
    );
};

export default AIChatBox;