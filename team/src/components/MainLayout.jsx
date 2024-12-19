import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; 

function MainLayout() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-grow overflow-auto bg-white-100 ">
        <Outlet /> 
      </div>

     
    </div>
  );
}

export default MainLayout;
