import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Box,
    Typography,
    IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';

const DaySelectionModal = ({ 
    open, 
    onClose, 
    onDaySelect, 
    availableDays = [],
    locationTitle = "",
    maxDays = 7 
}) => {
    const DAY_COLOR_MAP = {
        1: '#FF6B6B',
        2: '#4ECDC4', 
        3: '#45B7D1',
        4: '#FFA07A',
        5: '#98D8C8',
        6: '#F7DC6F',
        7: '#BB8FCE'
    };

    // 사용 가능한 날짜가 없으면 1부터 maxDays까지 생성
    const days = availableDays.length > 0 ? availableDays : Array.from({ length: maxDays }, (_, i) => i + 1);

    const handleDayClick = (day) => {
        console.log('📅 Day 선택:', day);
        onDaySelect(day);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                style: {
                    borderRadius: '16px',
                    padding: '8px'
                }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingBottom: '16px'
            }}>
                <Box>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                        어느 날에 추가할까요?
                    </Typography>
                    {locationTitle && (
                        <Typography variant="body2" color="text.secondary" sx={{ marginTop: '4px' }}>
                            "{locationTitle}"을(를) 추가할 날짜를 선택해주세요
                        </Typography>
                    )}
                </Box>
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ paddingTop: '0', paddingBottom: '16px' }}>
                <Grid container spacing={2}>
                    {days.map(day => (
                        <Grid item xs={6} sm={4} key={day}>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => handleDayClick(day)}
                                sx={{
                                    height: '80px',
                                    borderRadius: '12px',
                                    border: `2px solid ${DAY_COLOR_MAP[day] || '#ddd'}`,
                                    backgroundColor: 'white',
                                    color: DAY_COLOR_MAP[day] || '#666',
                                    '&:hover': {
                                        backgroundColor: DAY_COLOR_MAP[day] || '#f0f0f0',
                                        color: 'white',
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 4px 12px ${DAY_COLOR_MAP[day] || '#ddd'}40`
                                    },
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '4px'
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px' }}>
                                    Day {day}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                    {day}일차
                                </Typography>
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>

            <DialogActions sx={{ padding: '16px 24px' }}>
                <Button onClick={onClose} variant="outlined" fullWidth>
                    취소
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DaySelectionModal;