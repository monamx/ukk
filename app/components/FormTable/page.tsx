// import { CSVLink } from "react-csv";
// import React from "react";

// const FormTabel = () => {
  
//     const data = [
//         { details: { firstName: 'Ahmed', lastName: 'Tomi' }, job: 'manager'},
//         { details: { firstName: 'John', lastName: 'Jones' }, job: 'developer'},
//     ];

//     const csvData = data.map(item => ({
//         firstName: item.details.firstName,
//         lastName: item.details.lastName,
//         job: item.job,
//     }));

//   return (
//     <>
//       <CSVLink data={csvData} filename={"my-file.csv"}
//         className="btn btn-primary"
//         target="_blank"
//         >Download cuy</CSVLink>
//     </>
//   );
// };

// export default FormTabel;






import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
}

const FormTabel = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://dummyjson.com/users"
      );
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const convertToCSV = () => {
    const csvData = users.map((user: User) => ({
      lastname: user.lastName,
      firstname: user.firstName,
      age: user.age,
      email: user.email,
    }));

    return csvData;
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Daftar Pengguna</h1>
      {users.length > 0 ? (
        <CSVLink
          data={convertToCSV()}
          filename={"daftar-pengguna.csv"}
          className="btn btn-primary"
          target="_blank"
        >
          Download Daftar Pengguna
        </CSVLink>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FormTabel;
