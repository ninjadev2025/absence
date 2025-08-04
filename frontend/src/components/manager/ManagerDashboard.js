import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Table, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ManagerDashboard = () => {
  const [absences, setAbsences] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAllAbsences = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/absences', {
        params: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          search: searchTerm,
          group: selectedGroup !== 'all' ? selectedGroup : undefined
        }
      });
      setAbsences(res.data);
    } catch (err) {
      setError('Failed to fetch absence data');
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await axios.get('/api/groups');
      setGroups(res.data);
    } catch (err) {
      console.error('Failed to fetch groups');
    }
  };

  useEffect(() => {
    fetchAllAbsences();
    fetchGroups();
  }, [startDate, endDate, searchTerm, selectedGroup]);

  const calculateOverallAbsenceRate = () => {
    if (absences.length === 0) return 0;
    const presentDays = absences.reduce((total, member) => {
      return total + member.presentDays;
    }, 0);
    const totalPossibleDays = absences.length * ((endDate - startDate) / (1000 * 60 * 60 * 24));
    return ((presentDays / totalPossibleDays) * 100).toFixed(2);
  };

  return (
    <Container className="mt-4">
      <h2>Manager Dashboard</h2>
      
      <Card className="mb-4 shadow-sm">
        <Card.Header>All Members Absence Status</Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Start Date</Form.Label>
                <DatePicker
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  className="form-control"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>End Date</Form.Label>
                <DatePicker
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  className="form-control"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Search by Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Filter by Group</Form.Label>
                <Form.Select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                >
                  <option value="all">All Groups</option>
                  {groups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {error && <Alert variant="danger">{error}</Alert>}

          <div className="mb-3">
            <strong>Overall Absence Rate:</strong> {calculateOverallAbsenceRate()}%
          </div>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Group</th>
                <th>Present Days</th>
                <th>Absent Days</th>
                <th>Attendance Rate</th>
              </tr>
            </thead>
            <tbody>
              {absences.map((member, index) => (
                <tr key={index}>
                  <td>{member.name}</td>
                  <td>{member.group}</td>
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

export default ManagerDashboard;