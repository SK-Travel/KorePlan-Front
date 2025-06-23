import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    Button, 
    Typography, 
    IconButton, 
    useMediaQuery, 
    useTheme,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Chip,
    Container
} from '@mui/material';
import { ArrowBack, ArrowForward, CalendarToday } from '@mui/icons-material';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import dayjs from 'dayjs';
import { ko } from 'date-fns/locale';
import axios from 'axios';

export default function Calendar() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // md(960px) 이하를 모바일로 변경
    const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

    // 상태 관리
    const [travelPlans, setTravelPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(0);

    // API 호출
    useEffect(() => {
        const fetchTravelPlans = async () => {
            try {
                setLoading(true);
                const userId = localStorage.getItem('userId') || 1;
                
                const response = await axios.get('/api/my-plan/list', {
                    headers: {
                        'userId': userId
                    }
                });

                if (response.data.code === 200) {
                    const plans = response.data.result.map(plan => ({
                        id: plan.id,
                        name: plan.title,
                        start: new Date(plan.startDate),
                        end: new Date(plan.endDate),
                        sendDataDto: plan.sendDataDto,
                    }));
                    
                    setTravelPlans(plans);
                    
                    const today = dayjs();
                    const futureIndex = plans.findIndex(p => dayjs(p.end).isAfter(today, 'day'));
                    setSelectedPlan(futureIndex >= 0 ? futureIndex : 0);
                } else {
                    setError('여행 계획을 불러오는데 실패했습니다.');
                }
            } catch (err) {
                console.error('API 호출 오류:', err);
                setError('서버 연결에 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchTravelPlans();
    }, []);

    const prev = () => setSelectedPlan(i => Math.max(0, i - 1));
    const next = () => setSelectedPlan(i => Math.min(travelPlans.length - 1, i + 1));

    // 로딩 상태
    if (loading) {
        return (
            <Container maxWidth="lg">
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    // 에러 상태
    if (error) {
        return (
            <Container maxWidth="lg">
                <Box p={2}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                    <Button 
                        variant="contained" 
                        onClick={() => window.location.reload()}
                    >
                        다시 시도
                    </Button>
                </Box>
            </Container>
        );
    }

    // 여행 계획이 없는 경우
    if (travelPlans.length === 0) {
        return (
            <Container maxWidth="lg">
                <Box textAlign="center" p={4}>
                    <CalendarToday sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" mb={2}>
                        아직 여행 계획이 없습니다
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/myplan')}
                        sx={{
                            backgroundColor: '#1976d2',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#1565c0',
                            }
                        }}
                    >
                        첫 여행 계획 만들기
                    </Button>
                </Box>
            </Container>
        );
    }

    const { name, id, start, end, sendDataDto } = travelPlans[selectedPlan];
    const selection = [{ startDate: start, endDate: end, key: 'selection' }];

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                {                /* 헤더 섹션 */}
                <Card 
                    elevation={3}
                    sx={{ 
                        mb: 3,
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                        color: 'white',
                        borderRadius: 3,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(25, 118, 210, 0.3)',
                        }
                    }}
                >
                    <CardContent sx={{ py: 3 }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <IconButton 
                                onClick={prev} 
                                disabled={selectedPlan === 0}
                                sx={{ 
                                    color: 'white',
                                    opacity: selectedPlan === 0 ? 0.5 : 1,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        transform: 'scale(1.1)',
                                    }
                                }}
                            >
                                <ArrowBack />
                            </IconButton>
                            
                            <Box textAlign="center" flex={1}>
                                <Typography 
                                    variant={isMobile ? "h5" : "h4"} 
                                    fontWeight="700" 
                                    color="white"
                                    mb={0.5}
                                    sx={{
                                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    }}
                                >
                                    {name}
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    color="rgba(255, 255, 255, 0.9)"
                                    sx={{
                                        fontWeight: '500',
                                    }}
                                >
                                    {`${dayjs(start).format('MM/DD')} ~ ${dayjs(end).format('MM/DD')}`}
                                </Typography>
                            </Box>
                            
                            <IconButton 
                                onClick={next} 
                                disabled={selectedPlan === travelPlans.length - 1}
                                sx={{ 
                                    color: 'white',
                                    opacity: selectedPlan === travelPlans.length - 1 ? 0.5 : 1,
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        transform: 'scale(1.1)',
                                    }
                                }}
                            >
                                <ArrowForward />
                            </IconButton>
                        </Box>
                    </CardContent>
                </Card>

                {/* 캘린더 섹션 */}
                <Card 
                    elevation={3} 
                    sx={{ 
                        mb: 3, 
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                        }
                    }}
                >
                    <CardContent sx={{ p: 0 }}>
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                pointerEvents: 'none', // 전체 달력 클릭 비활성화
                                '& .rdrCalendarWrapper': {
                                    background: 'transparent',
                                    color: theme.palette.text.primary,
                                    fontFamily: theme.typography.fontFamily,
                                    width: '100%',
                                    maxWidth: isMobile ? '100%' : '800px',
                                },
                                '& .rdrMonths': {
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexWrap: isMobile ? 'wrap' : 'nowrap',
                                    gap: isMobile ? 0 : 2,
                                },
                                '& .rdrMonth': {
                                    width: isMobile ? '100%' : '350px',
                                    padding: theme.spacing(2),
                                },
                                '& .rdrMonthAndYearWrapper': {
                                    height: '50px',
                                    paddingBottom: theme.spacing(2),
                                },
                                '& .rdrMonthAndYearPickers': {
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                },
                                '& .rdrMonthPicker, & .rdrYearPicker': {
                                    margin: '0 4px',
                                },
                                '& .rdrMonthName': {
                                    color: theme.palette.text.primary,
                                    fontWeight: '600',
                                    fontSize: '1.1rem',
                                },
                                '& .rdrWeekDays': {
                                    display: 'flex',
                                    marginBottom: '8px',
                                },
                                '& .rdrWeekDay': {
                                    color: theme.palette.text.secondary,
                                    fontWeight: '600',
                                    fontSize: '0.85rem',
                                    textAlign: 'center',
                                    width: '14.28%',
                                    padding: '8px 0',
                                },
                                '& .rdrDays': {
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                },
                                '& .rdrDay': {
                                    width: '14.28%',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    cursor: 'default',
                                    userSelect: 'none',
                                },
                                '& .rdrDayNumber': {
                                    color: theme.palette.text.primary,
                                    fontSize: '0.9rem',
                                    fontWeight: '400',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    position: 'relative',
                                    zIndex: 2,
                                },
                                '& .rdrDayToday .rdrDayNumber': {
                                    border: '2px solid #1976d2 !important',
                                    color: '#1976d2 !important',
                                    fontWeight: '700 !important',
                                    backgroundColor: 'white !important',
                                    textDecoration: 'none !important',
                                },
                                '& .rdrDayToday .rdrDayNumber span': {
                                    textDecoration: 'none !important',
                                },
                                '& .rdrDayPassive .rdrDayNumber': {
                                    color: theme.palette.text.disabled,
                                },
                                '& .rdrDayInRange': {
                                    position: 'relative',
                                    backgroundColor: 'transparent !important',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '4px',
                                        bottom: '4px',
                                        left: '0',
                                        right: '0',
                                        backgroundColor: 'rgba(25, 118, 210, 0.1) !important',
                                        zIndex: 1,
                                    },
                                    '& .rdrDayNumber': {
                                        color: '#1976d2 !important',
                                        fontWeight: '500 !important',
                                        backgroundColor: 'transparent !important',
                                        zIndex: 2,
                                    },
                                },
                                '& .rdrDayStartEdge': {
                                    position: 'relative',
                                    backgroundColor: 'transparent !important',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '4px',
                                        bottom: '4px',
                                        left: '4px',
                                        right: '0',
                                        backgroundColor: '#1976d2 !important',
                                        borderTopLeftRadius: '16px !important',
                                        borderBottomLeftRadius: '16px !important',
                                        borderTopRightRadius: '0 !important',
                                        borderBottomRightRadius: '0 !important',
                                        zIndex: 1,
                                    },
                                    '& .rdrDayNumber': {
                                        color: 'white !important',
                                        fontWeight: '600 !important',
                                        zIndex: 2,
                                    },
                                },
                                '& .rdrDayEndEdge': {
                                    position: 'relative',
                                    backgroundColor: 'transparent !important',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '4px',
                                        bottom: '4px',
                                        left: '0',
                                        right: '4px',
                                        backgroundColor: '#1976d2 !important',
                                        borderTopLeftRadius: '0 !important',
                                        borderBottomLeftRadius: '0 !important',
                                        borderTopRightRadius: '16px !important',
                                        borderBottomRightRadius: '16px !important',
                                        zIndex: 1,
                                    },
                                    '& .rdrDayNumber': {
                                        color: 'white !important',
                                        fontWeight: '600 !important',
                                        zIndex: 2,
                                    },
                                },
                                '& .rdrDayStartEdge.rdrDayEndEdge': {
                                    '&::before': {
                                        left: '4px',
                                        right: '4px',
                                        borderRadius: '16px !important',
                                        borderTopLeftRadius: '16px !important',
                                        borderBottomLeftRadius: '16px !important',
                                        borderTopRightRadius: '16px !important',
                                        borderBottomRightRadius: '16px !important',
                                    },
                                },
                                '& .rdrDayHovered': {
                                    backgroundColor: '#f5f5f5',
                                    transition: 'all 0.2s ease',
                                },
                                '& .rdrNextPrevButton': {
                                    display: 'block',
                                    width: '24px',
                                    height: '24px',
                                    margin: '0 8px',
                                    borderRadius: '50%',
                                    backgroundColor: 'transparent',
                                    border: `1px solid ${theme.palette.divider}`,
                                    color: theme.palette.text.primary,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: theme.palette.action.hover,
                                    },
                                },
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
                                locale={ko}
                                monthDisplayFormat="yyyy년 MM월"
                                weekdayDisplayFormat="EE"
                                dayDisplayFormat="d"
                                dateDisplayFormat="yyyy년 MM월 d일"
                                showMonthAndYearPickers={false}
                            />
                        </Box>
                    </CardContent>
                </Card>

                

                {/* 액션 버튼들 */}
                <Box 
                    display="flex" 
                    justifyContent="center" 
                    gap={2} 
                    flexDirection={isMobile ? 'column' : 'row'}
                    alignItems="center"
                >
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate(`/myplan/${id}`)}
                        sx={{
                            background: 'linear-gradient(45deg, #1976d2 30%, #1565c0 90%)',
                            minWidth: isMobile ? '200px' : '180px',
                            minHeight: '48px',
                            borderRadius: '25px',
                            fontWeight: '600',
                            textTransform: 'none',
                            boxShadow: '0 4px 15px rgba(25, 118, 210, 0.3)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1565c0 30%, #0d47a1 90%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                            }
                        }}
                    >
                        이 여행 수정하기
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate('/myplan')}
                        sx={{
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            minWidth: isMobile ? '200px' : '180px',
                            minHeight: '48px',
                            borderRadius: '25px',
                            fontWeight: '600',
                            textTransform: 'none',
                            borderWidth: '2px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                borderColor: '#1565c0',
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                transform: 'translateY(-2px)',
                                borderWidth: '2px',
                                boxShadow: '0 4px 15px rgba(25, 118, 210, 0.2)',
                            }
                        }}
                    >
                        새 여행 계획하기
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}