import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e0e0e0',
        mt: 'auto',
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* 로고/브랜드명 */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#000',
              mb: 1,
              fontSize: {
                xs: '1.5rem',
                md: '2rem',
              },
            }}
          >
            KorePlan
          </Typography>

          {/* 슬로건 */}
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              mb: 3,
              fontSize: {
                xs: '0.9rem',
                md: '1rem',
              },
            }}
          >
            당신의 완벽한 한국 여행을 계획하세요
          </Typography>

          <Divider sx={{ width: '100%', maxWidth: 400, mb: 3 }} />

          {/* 저작권 정보 */}
          <Typography
            variant="body2"
            sx={{
              color: '#999',
              fontSize: {
                xs: '0.8rem',
                md: '0.9rem',
              },
            }}
          >
            Copyright © KorePlan 2025. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;