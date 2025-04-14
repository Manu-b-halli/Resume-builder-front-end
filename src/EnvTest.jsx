// Create src/EnvTest.jsx
import React from 'react';

export default function EnvTest() {
  // Get all environment variables starting with VITE_
  const envVars = Object.keys(import.meta.env)
    .filter(key => key.startsWith('VITE_'))
    .reduce((obj, key) => {
      obj[key] = import.meta.env[key] ? 
        (key.includes('KEY') ? '***PRESENT***' : import.meta.env[key]) 
        : 'MISSING';
      return obj;
    }, {});
    
  return (
    <div style={{padding: '20px'}}>
      <h1>Environment Variables Test</h1>
      <pre style={{background: '#f5f5f5', padding: '10px'}}>
        {JSON.stringify(envVars, null, 2)}
      </pre>
    </div>
  );
}