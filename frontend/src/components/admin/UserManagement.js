import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Badge, Dropdown } from 'react-bootstrap';
import axios from 'axios';

const UserManagement = ({ setError, setSuccess }) => {
  const [users, setUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'user',
    group: '',
    level: '',
    department: '',
    party: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [options, setOptions] = useState({
    levels: [],
    departments: [],
    parties: [],
    groups: []
  });

  useEffect(() => {
    fetchUsers();
    fetchOptions();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching users');
    }
  };

  const fetchOptions = async () => {
    try {
      const res = await axios.get('/auth/options');
      setOptions(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching options');
    }
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      role: user.role || 'user',
      group: user.group || '',
      level: user.level,
      department: user.department,
      party: user.party
    });
    setShowEditModal(true);
  };

  const handlePasswordClick = (user) => {
    setCurrentUser(user);
    setNewPassword('');
    setShowPasswordModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`/admin/users/${currentUser._id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('User updated successfully');
      fetchUsers();
      setShowEditModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating user');
    }
  };

  const handleChangePassword = async () => {
    try {
      await axios.put(
        `/admin/users/${currentUser._id}/password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setSuccess('Password updated successfully');
      setShowPasswordModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating password');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSuccess('User deleted successfully');
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting user');
      }
    }
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Group</th>
            <th>Level</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.honor} {user.name}</td>
              <td>{user.username}</td>
              <td>
                <Badge bg={user.role === 'admin' ? 'danger' : user.role === 'manager' ? 'primary' : 'secondary'}>
                  {user.role || 'user'}
                </Badge>
              </td>
              <td>{user.group || '-'}</td>
              <td>{user.level}</td>
              <td>{user.department}</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="primary" size="sm">
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleEditClick(user)}>Edit</Dropdown.Item>
                    <Dropdown.Item onClick={() => handlePasswordClick(user)}>Change Password</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item 
                      onClick={() => handleDeleteUser(user._id)}
                      className="text-danger"
                    >
                      Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit User Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="user">User</option>
                <option value="reporter">Reporter</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Group</Form.Label>
              <Form.Select
                value={formData.group}
                onChange={(e) => setFormData({...formData, group: e.target.value})}
              >
                <option value="">Select Group</option>
                {options.groups?.map((group, i) => (
                  <option key={i} value={group}>{group}</option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Add other fields similarly */}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateUser}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password for {currentUser?.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleChangePassword}
            disabled={newPassword.length < 6}
          >
            Change Password
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserManagement;