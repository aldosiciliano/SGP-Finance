import React from 'react';
import Navbar from './Navbar';

const AppShell = ({ children }) => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-shell">{children}</main>
    </div>
  );
};

export default AppShell;
