import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Welcome from './Welcome';
import Layout from './Layout';
import Home from './Home';
import About from './About';
import Contact from './Contact';
import Details from './Details';

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
          element: <Home />
        },
        // {
        //   path: 'Home',
        //   element: <Home />
        // },
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
        }
      ]
    }
  ]);

  return (
    <RouterProvider router={router}>
      <Outlet context={{ searchQuery }} />
    </RouterProvider>
  );
};

export default App;
