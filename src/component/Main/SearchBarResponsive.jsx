import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const SearchBarResponsive = ({ value, onChange, onSubmit }) => {
  return (
    <Form className="w-100" onSubmit={onSubmit}>
      <Row className="g-2 align-items-center">
        <Col xs={9} sm={10}>
          <Form.Control
            type="text"
            placeholder="여행지"
            className="w-100"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ height: '50px', fontSize: '16px' }}
          />
        </Col>
        <Col xs={3} sm={2}>
          <Button
            variant="warning"
            type="submit"
            className="w-100"
            style={{ height: '50px', fontWeight: 'bold' }}
          >
            검색
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchBarResponsive;