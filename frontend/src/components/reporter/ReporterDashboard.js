import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ReporterDashboard = ({ user }) => {
  const [absences, setAbsences] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchGroupAbsences = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/absences/group/${user.group}`, {
        params: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      });
      setAbsences(res.data);
    } catch (err) {
      setError('Failed to fetch absence data');
    } finally {
      setLoading(false);
    }
  };

  const calculateAbsenceRate = () => {
    if (absences.length === 0) return 0;
    const presentDays = absences.reduce((total, member) => {
      return total + member.presentDays;
    }, 0);
    const totalPossibleDays = absences.length * ((endDate - startDate) / (1000 * 60 * 60 * 24));
    return ((presentDays / totalPossibleDays) * 100).toFixed(2);
  };

  useEffect(() => {
    fetchGroupAbsences();
  }, [startDate, endDate]);

  return (
    <Container className="mt-4">
      <h2>Reporter Dashboard - {user.group} Group</h2>
      
      <Card className="mb-4 shadow-sm">
        <Card.Header>Absence Report</Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Start Date</Form.Label>
                <DatePicker
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  className="form-control"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>End Date</Form.Label>
                <DatePicker
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  className="form-control"
                />
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button onClick={fetchGroupAbsences} disabled={loading}>
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
            </Col>
          </Row>

          {error && <Alert variant="danger">{error}</Alert>}

          <div className="mb-3">
            <strong>Group Absence Rate:</strong> {calculateAbsenceRate()}%
          </div>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Present Days</th>
                <th>Absent Days</th>
                <th>Attendance Rate</th>
              </tr>
            </thead>
            <tbody>
              {absences.map((member, index) => (
                <tr key={index}>
                  <td>{member.name}</td>
                  <td>{member.presentDays}</td>
                  <td>{member.absentDays}</td>
                  <td>{((member.presentDays / (member.presentDays + member.absentDays)) * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReporterDashboard;