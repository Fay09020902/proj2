// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar/NavBar';
// import Footer from './Footer/Footer';

function Layout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <main style={{ flex: 1, padding: '24px' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
