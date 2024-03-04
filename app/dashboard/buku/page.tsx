"use client"
import TableBuku from "../../components/TableBuku/page"
import FormBuku from "../../components/FormBuku/page"
import { useState } from 'react';
import { ChevronsUp, ChevronsDown } from 'react-feather';

export default function DataBarang() {
  const [isSHForm, setSHForm] = useState(true);

  const handleSHForm = () => {
    setSHForm(!isSHForm);
  };

  return (
    <>
      <FormBuku isSHForm={isSHForm} />
        <div className="sh-form">
          <div className="bg-white text-black rounded-full p-2 mt-10" onClick={handleSHForm} >
            {isSHForm ? <ChevronsDown size={25}/> : <ChevronsUp size={25}/>}
          </div>
        </div>
      <TableBuku />
    </>
  );
}
