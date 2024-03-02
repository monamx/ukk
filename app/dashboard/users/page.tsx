"use client"
import Navbar from "../../components/Navbar/page"
import Sidebar from "../../components/Sidebar/page"
import Table from "../table/page"
// import Table from "../components/FormTable/page"
// import FormBuku from "../components/FormBuku/page"
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
        <div className="data-buku">
          {/* <FormBuku isSHForm={isSHForm} />
          <div className="sh-form">
            <div className="bg-white text-black rounded-full p-2 mt-10" onClick={handleSHForm} >
              {isSHForm ? <ChevronsDown size={25}/> : <ChevronsUp size={25}/>}
            </div>
          </div> */}
          <Table />

        </div>
      </div>
    </div>
  );
}
