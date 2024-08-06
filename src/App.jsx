import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Welcome from './Welcome';
import Layout from './Layout';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import Details from './Details';
import ResetPassword from './ResetPassword'; 
import { AuthProvider } from './AuthContext';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout onSearchChange={handleSearchChange} />,
      children: [
        {
          index: true,
          element: <Welcome />
        },
        {
          path: 'Login',
          element: <Login />
        },
        {
          path: 'Signup',
          element: <Signup />
        },
        {
          path: 'Home',
          element: <Home />
        },
        {
          path: 'About',
          element: <About />
        },
        {
          path: 'Contact',
          element: <Contact />
        },
        {
          path: 'Details',
          element: <Details />
        },
        {
          path: 'reset-password',
          element: <ResetPassword />
        }
      ]
    }
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router}>
        <Outlet context={{ searchQuery }} />
      </RouterProvider>
    </AuthProvider>
  );
};

export default App;
