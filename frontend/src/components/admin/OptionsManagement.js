import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import axios from 'axios';

const OptionsManagement = ({ setError, setSuccess }) => {
  const [options, setOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newOption, setNewOption] = useState({ type: 'honor', value: '' });
  const [editingOption, setEditingOption] = useState(null);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const res = await axios.get('/admin/options', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOptions(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching options');
    }
  };

  const handleAddOption = async () => {
    try {
      await axios.post('/admin/options', newOption, {
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

  const handleUpdateOption = async () => {
    try {
      await axios.put(`/admin/options/${editingOption._id}`, 
        { value: editingOption.value },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setSuccess('Option updated successfully');
      setEditingOption(null);
      fetchOptions();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating option');
    }
  };

  const handleDeleteOption = async (id) => {
    if (window.confirm('Are you sure you want to delete this option?')) {
      try {
        await axios.delete(`/admin/options/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSuccess('Option deleted successfully');
        fetchOptions();
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting option');
      }
    }
  };

  const getBadgeColor = (type) => {
    switch(type) {
      case 'honor': return 'primary';
      case 'level': return 'success';
      case 'department': return 'warning';
      case 'party': return 'info';
      case 'group': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <>
      <Button 
        variant="primary" 
        onClick={() => setShowModal(true)}
        className="mb-3"
      >
        Add New Option
      </Button>

      <Table striped bordered hover responsive>
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
              <td>
                <Badge bg={getBadgeColor(option.type)}>
                  {option.type}
                </Badge>
              </td>
              <td>
                {option.value}
                {editingOption?._id === option._id ? (
                  <Form.Control
                    type="text"
                    value={editingOption.value}
                    onChange={(e) => setEditingOption({
                      ...editingOption,
                      value: e.target.value
                    })}
                    className="mt-2"
                  />
                ) : null}
              </td>
              <td>
                {editingOption?._id === option._id ? (
                  <>
                    <Button 
                      variant="success" 
                      size="sm" 
                      onClick={handleUpdateOption}
                      className="me-2"
                    >
                      Save
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => setEditingOption(null)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="info" 
                      size="sm" 
                      onClick={() => setEditingOption(option)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => handleDeleteOption(option._id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Option Modal */}
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
                onChange={(e) => setNewOption({...newOption, type: e.target.value})}
              >
                <option value="honor">Honorific</option>
                <option value="level">Level</option>
                <option value="department">Department</option>
                <option value="party">Party</option>
                <option value="group">Group</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Option Value</Form.Label>
              <Form.Control
                type="text"
                value={newOption.value}
                onChange={(e) => setNewOption({...newOption, value: e.target.value})}
                placeholder="Enter option value"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddOption}
            disabled={!newOption.value.trim()}
          >
            Add Option
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OptionsManagement;