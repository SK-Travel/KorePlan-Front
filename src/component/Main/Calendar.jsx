import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import dayjs from 'dayjs';
import { ko } from 'date-fns/locale';

// 모의 여행 계획 데이터
const travelPlans = [
    { id: 1, name: '가족여행', start: new Date(2025, 5, 7), end: new Date(2025, 5, 8) },
    { id: 2, name: '제주 힐링여행', start: new Date(2025, 5, 9), end: new Date(2025, 5, 12) },
    { id: 3, name: '가평 빠지여행', start: new Date(2025, 7, 4), end: new Date(2025, 7, 8) },
    { id: 4, name: '2주년 여행', start: new Date(2025, 8, 28), end: new Date(2025, 9, 3) },
];

export default function Calendar() {
    const navigate = useNavigate();
    const theme = useTheme();
    // sm(600px) 이하를 모바일로 간주
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // 가장 가까운 이후 계획 인덱스
    const today = dayjs();
    const initialIndex = useMemo(() => {
        const idx = travelPlans.findIndex(p => dayjs(p.end).isAfter(today, 'day'));
        return idx >= 0 ? idx : 0;
    }, []);

    const [selectedPlan, setSelectedPlan] = useState(initialIndex);
    const { name, id, start, end } = travelPlans[selectedPlan];
    const prev = () => setSelectedPlan(i => Math.max(0, i - 1));
    const next = () => setSelectedPlan(i => Math.min(travelPlans.length - 1, i + 1));

    // 현재 계획 범위
    const selection = [{ startDate: start, endDate: end, key: 'selection' }];

    return (
        <Box>
            {/* 상단 네비게이션 */}
            <Box display="flex" alignItems="center" mb={2}>
                <IconButton onClick={prev} disabled={selectedPlan === 0}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h6" flexGrow={1} textAlign="center">
                    {name}
                </Typography>
                <IconButton onClick={next} disabled={selectedPlan === travelPlans.length - 1}>
                    <ArrowForward />
                </IconButton>
            </Box>

            {/* 반응형 달력 감싸는 컨테이너 */}
            <Box
                sx={{
                    maxWidth: '100%',
                    overflowX: isMobile ? 'auto' : 'visible',  // 모바일에만 가로 스크롤 허용
                }}
            >
                <DateRange
                    editableDateInputs={false}
                    onChange={() => { }}
                    moveRangeOnFirstSelection={false}
                    ranges={selection}
                    months={isMobile ? 1 : 2}
                    direction="horizontal"
                    showPreview={false}
                    locale={ko}                         // 한글 로케일
                    monthDisplayFormat="yyyy년 MM월"    // 월 헤더
                    weekdayDisplayFormat="EE"           // 요일 (월, 화, …)
                    dayDisplayFormat="d"                // 셀 내부: 숫자만
                    dateDisplayFormat="yyyy년 MM월 d일"  // 위쪽 미리보기: “2025년 05월 05일”
                    showMonthAndYearPickers={false}
                />

            </Box>

            {/* 상세 수정 버튼 */}
            <Box textAlign="center" mt={2} sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                    variant="contained"
                    onClick={() => navigate(`/myTravel/edit/${id}`)}
                >
                    이 여행 수정하기
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => navigate('/myTravel/new')}
                >
                    새로운 여행계획짜기
                </Button>
            </Box>
        </Box>
    );
}