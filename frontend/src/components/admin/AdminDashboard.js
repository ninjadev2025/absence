import React, { useState } from 'react';
import { Tab, Tabs, Container, Alert } from 'react-bootstrap';
import UserManagement from './UserManagement';
import OptionsManagement from './OptionsManagement';

const AdminDashboard = () => {
  const [key, setKey] = useState('users');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  return (
    <Container className="mt-4" style={{ 
      overflow: 'visible', // Crucial for dropdowns
      position: 'relative' // Needed for proper dropdown positioning
    }}>
      <h2 className="mb-4">Admin Dashboard</h2>
      
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" onClose={() => setSuccess('')} dismissible>
          {success}
        </Alert>
      )}

      <div style={{
        position: 'relative',
        overflow: 'visible', // Allow dropdowns to overflow
        zIndex: 1 // Ensure proper stacking context
      }}>
        <Tabs
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
        >
          <Tab eventKey="users" title="User Management">
            <div style={{
              position: 'relative',
              overflow: 'visible',
              minHeight: '400px',
              zIndex: 0 // Lower than container
            }}>
              <UserManagement 
                setError={setError} 
                setSuccess={setSuccess} 
              />
            </div>
          </Tab>
          <Tab eventKey="options" title="Options Management">
            <div style={{
              position: 'relative',
              overflow: 'visible',
              minHeight: '400px',
              zIndex: 0
            }}>
              <OptionsManagement 
                setError={setError} 
                setSuccess={setSuccess} 
              />
            </div>
          </Tab>
        </Tabs>
      </div>
    </Container>
  );
};

export default AdminDashboard;