import React, { useState } from 'react';
import axios from 'axios';

const Like = ({ dataId }) => {
    const [liked, setLiked] = useState(false); // 현재 좋아요 상태
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const toggleLike = async() => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/like/${dataId}`);

            if (response.ok) {
                const data = await response.json();
                if (data.code === 200) {
                    setLiked(data.likeStatus === 1);
                    console.log(data.result);
                } else {
                    setError(data.error_message || "오류가 발생했습니다.");
                }
            } else {
                setError("응답이 올바르지 않습니다.");
            }
        } catch (error) {
            console.log("서버와 통신 중 오류:", error);
            setError("서버와 통신 중 오류가 발생했습니다.");
        }
        setLoading(false);
    };
    return (
        <div>
            <div>
                <button onClick={toggleLike} disabled={loading}>
                    {liked ? '❤️ 찜 취소' : '🤍 찜하기'}
                </button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default Like;