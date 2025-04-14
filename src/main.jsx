// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'
// import { RouterProvider, createBrowserRouter } from 'react-router-dom'
// import SignInPage from './auth/sign-in/index.jsx'
// import Home from './home/index.jsx'
// import Dashboard from './dashboard/index.jsx'
// import { ClerkProvider } from '@clerk/clerk-react'
// import EditResume from './dashboard/resume/[resumeId]/edit/index.jsx'
// import ViewResume from './my-resume/[resumeId]/view/index.jsx'
// import TestAPI from './TestAPI.jsx'
// import DragDropTest from './DragDropTest.jsx'


// // src/main.jsx or src/index.jsx - add this before your app rendering
// if (process.env.NODE_ENV === 'production') {
//   // Overwrite React DevTools functions
//   const originalCreateElement = React.createElement;
//   React.createElement = function(type, props, ...children) {
//     // Hide sensitive props
//     if (props && typeof props === 'object') {
//       const newProps = {...props};
      
//       // Add noise to prevent inspecting
//       Object.defineProperty(newProps, '__PROTECTED__', {
//         enumerable: false,
//         get: function() {
//           console.warn('Attempt to access protected component properties detected');
//           window.location.href = 'about:blank'; // Redirect or other action
//           return undefined;
//         }
//       });
//     }
    
//     return originalCreateElement.apply(this, [type, props, ...children]);
//   };
// }

// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
// const router = createBrowserRouter(
//   [
//     {
//       path: '/',
//       element: <Home />,
//     },
//     {
//       path: '/test-api',
//       element: <TestAPI />,
//     },
//     {
//       path: '/drag-test',
//       element: <DragDropTest />,
//     },
//     {
//       element: <App />,
//       children: [
//         {
//           path: '/dashboard',
//           element: <Dashboard />,
//         },
//         {
//           path: '/dashboard/resume/:resumeId/edit',
//           element: <EditResume />,
//         },
//       ],
//     },
//     {
//       path: '/auth/sign-in',
//       element: <SignInPage />,
//     },
//     {
//       path: '/my-resume/:resumeId/view',
//       element: <ViewResume />,
//     },
//   ],
//   {
//     future: {
//       v7_startTransition: true,
//       v7_relativeSplatPath: true
//     },
//   }
// );

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
//       <RouterProvider router={router} />
//     </ClerkProvider>
//   </React.StrictMode>
// );









import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.jsx';
import Home from './home/index.jsx';
import SignInPage from './auth/sign-in/index.jsx';

// Create a loading component
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-[400px] w-full">
    <div className="text-center">
      <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

// Lazy load heavy components
const Dashboard = lazy(() => import('./dashboard/index.jsx'));
const EditResume = lazy(() => import('./dashboard/resume/[resumeId]/edit/index.jsx'));
const ViewResume = lazy(() => import('./my-resume/[resumeId]/view/index.jsx'));
const TestAPI = lazy(() => import('./TestAPI.jsx'));
const DragDropTest = lazy(() => import('./DragDropTest.jsx'));

// Production protection code (your existing code)
if (process.env.NODE_ENV === 'production') {
  // Overwrite React DevTools functions
  const originalCreateElement = React.createElement;
  React.createElement = function(type, props, ...children) {
    // Hide sensitive props
    if (props && typeof props === 'object') {
      const newProps = {...props};
      
      // Add noise to prevent inspecting
      Object.defineProperty(newProps, '__PROTECTED__', {
        enumerable: false,
        get: function() {
          console.warn('Attempt to access protected component properties detected');
          window.location.href = 'about:blank'; // Redirect or other action
          return undefined;
        }
      });
    }
    
    return originalCreateElement.apply(this, [type, props, ...children]);
  };
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Create router with lazy-loaded routes
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/test-api',
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <TestAPI />
        </Suspense>
      ),
    },
    {
      path: '/drag-test',
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <DragDropTest />
        </Suspense>
      ),
    },
    {
      element: <App />,
      children: [
        {
          path: '/dashboard',
          element: (
            <Suspense fallback={<LoadingScreen />}>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: '/dashboard/resume/:resumeId/edit',
          element: (
            <Suspense fallback={<LoadingScreen />}>
              <EditResume />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: '/auth/sign-in',
      element: <SignInPage />, // Keep this loading immediately for authentication
    },
    {
      path: '/my-resume/:resumeId/view',
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <ViewResume />
        </Suspense>
      ),
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    },
  }
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
);