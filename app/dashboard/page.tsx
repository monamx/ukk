"use client"
import Navbar from "../components/Navbar/page"
import Sidebar from "../components/Sidebar/page"
// import Data from "../../Component/Data/page"
// import Form from "../../Component/Form/page"
import { useState } from 'react';
import { ChevronsUp, ChevronsDown } from 'react-feather';

export default function DataBarang() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isSHForm, setSHForm] = useState(true);

  const handleCollapse = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleSHForm = () => {
    setSHForm(!isSHForm);
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar handleCollapse={handleCollapse} />
      <div className="flex h-screen">
        <div className={`sidebar ${isSidebarCollapsed ? '' : 'sidebar-hide'}`}>
          <Sidebar />
        </div>
        <div className={`data-buku ${isSidebarCollapsed ? '' : 'sidebar-hide'}`}>
          {/* <Form isSHForm={isSHForm} />
          <div className="sh-form" onClick={handleSHForm}>
            {isSHForm ? <ChevronsDown size={25}/> : <ChevronsUp size={25}/>}
          </div>
          <Data /> */}
        </div>
      </div>
    </div>
  );
}
