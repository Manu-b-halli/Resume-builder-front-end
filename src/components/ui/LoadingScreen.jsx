// src/components/ui/LoadingScreen.jsx
import React from 'react';

function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <div className="text-center">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}

export default LoadingScreen;