import React, { useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const who = ['가족', '친구', '연인', '혼자'];
const what = ['힐링', '활동', '맛집투어', '문화체험'];

const ChooseBarResponsive = () => {
  const [selectedWho, setSelectedWho] = useState(null);
  const [selectedWhat, setSelectedWhat] = useState(null);

  return (
    <Container
      fluid
      className="d-flex flex-column align-items-center justify-content-center p-0"
      style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Row
        className="text-center g-0"
        style={{
          width: '100%',
          maxWidth: '900px',
          margin: 0,
        }}
      >
        {/* WHO 영역 */}
        <Col
          xs={12}
          md={6}
          className="d-flex flex-column align-items-center"
          style={{
            borderRight: '1px solid #ccc',
            padding: '16px 0',
          }}
        >
          <h5 style={{ marginBottom: '12px' }}>누구랑 가나요?</h5>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              width: '200px',
            }}
          >
            {who.map((label) => (
              <Button
                key={label}
                variant={selectedWho === label ? 'primary' : 'outline-primary'}
                onClick={() => setSelectedWho(label)}
              >
                {label}
              </Button>
            ))}
          </div>
        </Col>

        {/* WHAT 영역 */}
        <Col
          xs={12}
          md={6}
          className="d-flex flex-column align-items-center"
          style={{
            padding: '16px 0',
          }}
        >
          <h5 style={{ marginBottom: '12px' }}>무엇을 할까요?</h5>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              width: '200px',
            }}
          >
            {what.map((label) => (
              <Button
                key={label}
                variant={selectedWhat === label ? 'success' : 'outline-success'}
                onClick={() => setSelectedWhat(label)}
              >
                {label}
              </Button>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ChooseBarResponsive;
