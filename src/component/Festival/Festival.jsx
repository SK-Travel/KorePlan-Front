import React, { useState } from 'react';
import SampleFesData from '../../datas/Sample/SampleFesData';
import { Link } from 'react-router-dom';
import ZzimButton from '../Button/ZzimButton';

import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import AspectRatio from '@mui/joy/AspectRatio';

const Festival = () => {
  const [posts] = useState(SampleFesData);
  
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#FFF8DC',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>진행중인 축제</h3>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          justifyContent: 'center',
        }}
      >
        {posts.map((item) => (
          <Card key={item.id} sx={{ width: 300, position: 'relative' }}>
            {/* 찜 버튼 (우상단 고정) */}
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}>
            <ZzimButton small/>
            </div>

            {/* 축제명 + 날짜 */}
            <Typography level="title-lg" sx={{ mt: 1 }}>
              <Link
                to={`/festival/${item.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {item.label}
              </Link>
            </Typography>
            <Typography level="body-sm" sx={{ mb: 1 }}>
              {item.period || '축제 기간 미정'}
            </Typography>

            {/* 이미지 */}
            <AspectRatio minHeight="160px" maxHeight="200px">
              <img
                src={item.imgUrl}
                alt={item.label}
                loading="lazy"
              />
            </AspectRatio>

            {/* 설명 + 버튼 */}
            <CardContent orientation="horizontal">
              <div>
                <Typography level="body-xs">설명</Typography>
                <Typography
                  level="body-sm"
                  sx={{
                    maxWidth: '180px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.comment || '설명이 없습니다.'}
                </Typography>
              </div>

              <Button
                variant="solid"
                size="md"
                color="primary"
                component={Link}
                to={`/festival/${item.id}`}
                sx={{ ml: 'auto', fontWeight: 600 }}
              >
                자세히
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Festival;
