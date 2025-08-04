import React from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';

const UserDashboard = ({ user }) => {
  return (
    <Container>
      <h2 className="my-4">Welcome, {user.name}</h2>
      
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Your Information</Card.Title>
              <Card.Text>
                <strong>Role:</strong> {user.role}<br />
                <strong>Department:</strong> {user.department}<br />
                <strong>Level:</strong> {user.level}<br />
                {user.group && <><strong>Group:</strong> {user.group}<br /></>}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Recent Activity</Card.Title>
              <Card.Text>
                {/* Placeholder for user-specific content */}
                Your dashboard content will appear here.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;