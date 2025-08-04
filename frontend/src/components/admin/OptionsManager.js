import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Alert } from 'react-bootstrap';

const OptionsManager = () => {
  const [options, setOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newOption, setNewOption] = useState({ type: 'honor', value: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/admin/options', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOptions(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching options');
    }
  };

  const handleAddOption = async () => {
    try {
      await axios.post('http://localhost:5000/admin/options', newOption, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Option added successfully');
      setNewOption({ type: 'honor', value: '' });
      setShowModal(false);
      fetchOptions();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding option');
    }
  };

  const handleDeleteOption = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/options/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Option deleted successfully');
      fetchOptions();
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting option');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Manage Dropdown Options</h2>
      
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
      
      <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3">
        Add New Option
      </Button>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Type</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {options.map(option => (
            <tr key={option._id}>
              <td>{option.type}</td>
              <td>{option.value}</td>
              <td>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => handleDeleteOption(option._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Option</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Option Type</Form.Label>
              <Form.Select 
                value={newOption.type} 
                onChange={(e) => setNewOption({ ...newOption, type: e.target.value })}
              >
                <option value="honor">Honorific</option>
                <option value="level">Level</option>
                <option value="department">Department</option>
                <option value="party">Party</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Option Value</Form.Label>
              <Form.Control 
                type="text" 
                value={newOption.value} 
                onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                placeholder="Enter option value"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddOption}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OptionsManager;