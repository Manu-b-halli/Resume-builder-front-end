import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function TestAPI() {
  const [status, setStatus] = useState('Testing...');
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:1337';
    const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;
    
    console.log({
      API_URL,
      API_KEY_LENGTH: API_KEY?.length
    });
    
    axios.get(`${API_URL}/api/user-resumes`, {
      headers: {
        Authorization: API_KEY ? `Bearer ${API_KEY}` : undefined
      }
    })
    .then(response => {
      setStatus('Success!');
      console.log(response.data);
    })
    .catch(error => {
      setStatus('Error');
      setError(error.response || error.message);
      console.error(error);
    });
  }, []);
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>API Test</h1>
      <p>Status: {status}</p>
      {error && (
        <pre style={{ background: '#f5f5f5', padding: '10px' }}>
          {JSON.stringify(error, null, 2)}
        </pre>
      )}
    </div>
  );
}