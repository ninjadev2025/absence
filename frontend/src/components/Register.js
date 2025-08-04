import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    honor: '',
    name: '',
    level: '',
    department: '',
    party: '',
    sex: '',
    role: 'user',
    group: '',
    year: '',
    month: '',
    day: ''
  });

  const [options, setOptions] = useState({
    honors: [],
    levels: [],
    departments: [],
    parties: [],
    groups: [], // Initialize groups array
    sexes: ['Male', 'Female', 'Other'],
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    years: [],
    days: Array.from({ length: 31 }, (_, i) => i + 1)
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setOptions(prev => ({
      ...prev,
      years: Array.from({ length: 48 }, (_, i) => currentYear - 65 + i)
    }));

    const fetchOptions = async () => {
      try {
        const res = await axios.get('/auth/options');
        setOptions(prev => ({
          ...prev,
          ...res.data,
          groups: res.data.groups || [] // Ensure groups exists
        }));
      } catch (err) {
        console.error('Failed to load options');
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('/auth/register', {
        ...formData,
        role: formData.role // Ensure role is included
      });

      onLogin(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h3 className="mb-0">Register</h3>
            </Card.Header>
            <Card.Body>
              {error && <div className="alert alert-danger">{error}</div>}

              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Honorific</Form.Label>
                      <Form.Select
                        name="honor"
                        value={formData.honor}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select...</option>
                        {options.honors.map((honor, i) => (
                          <option key={i} value={honor}>{honor}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Role</Form.Label>
                      <Form.Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                      >
                        <option value="user">Regular User</option>
                        <option value="reporter">Reporter</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    {formData.role === 'reporter' && (
                      <Form.Group>
                        <Form.Label>Group</Form.Label>
                        <Form.Select
                          name="group"
                          value={formData.group}
                          onChange={handleChange}
                          required={formData.role === 'reporter'}
                        >
                          <option value="">Select Group</option>
                          {options.groups.map((group, i) => (
                            <option key={i} value={group}>{group}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    )}
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Level</Form.Label>
                      <Form.Select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select...</option>
                        {options.levels.map((level, i) => (
                          <option key={i} value={level}>{level}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Department</Form.Label>
                      <Form.Select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select...</option>
                        {options.departments.map((dept, i) => (
                          <option key={i} value={dept}>{dept}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Party</Form.Label>
                      <Form.Select
                        name="party"
                        value={formData.party}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select...</option>
                        {options.parties.map((party, i) => (
                          <option key={i} value={party}>{party}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Sex</Form.Label>
                      <Form.Select
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select...</option>
                        {options.sexes.map((sex, i) => (
                          <option key={i} value={sex}>{sex}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Birthday</Form.Label>
                      <Row>
                        <Col>
                          <Form.Select
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Month</option>
                            {options.months.map((month, i) => (
                              <option key={i} value={i + 1}>{month}</option>
                            ))}
                          </Form.Select>
                        </Col>
                        <Col>
                          <Form.Select
                            name="day"
                            value={formData.day}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Day</option>
                            {options.days.map((day, i) => (
                              <option key={i} value={day}>{day}</option>
                            ))}
                          </Form.Select>
                        </Col>
                        <Col>
                          <Form.Select
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Year</option>
                            {options.years.map((year, i) => (
                              <option key={i} value={year}>{year}</option>
                            ))}
                          </Form.Select>
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col>
                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;