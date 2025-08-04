import React, { useState } from 'react';
import { Form, Button, Alert, Card, Container, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/auth/login', formData);
      console.log(res.data);
      
      
      // Save token and user data
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      // Update app state
      onLogin(res.data.user, res.data.token);
      
      // Redirect to intended page or home
      navigate(location.state?.from || '/');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      console.log(err);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white">
              <h3>Login</h3>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {location.state?.success && (
                <Alert variant="success">{location.state.success}</Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={loading}
                  className="w-100"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;