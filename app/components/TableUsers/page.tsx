import React, { useEffect, useState } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_Row,
  createMRTColumnHelper,
} from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv'; // atau gunakan library lain di sini

interface UserData {
  userId: number;
  username: string;
  password: string;
  email: string;
  namaLengkap: string;
  alamat: string;
  role: string;
}

const columnHelper = createMRTColumnHelper<UserData>();

const columns = [
  columnHelper.accessor('userId', {
    header: 'User ID',
    size: 80,
  }),
  columnHelper.accessor('username', {
    header: 'Username',
    size: 120,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    size: 200,
  }),
  columnHelper.accessor('namaLengkap', {
    header: 'Nama Lengkap',
    size: 150,
  }),
  columnHelper.accessor('alamat', {
    header: 'Alamat',
    size: 200,
  }),
  columnHelper.accessor('role', {
    header: 'Role',
    size: 100,
  }),
];

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

const TableUsers = () => {
  const [userData, setUserData] = useState<UserData[]>([]);

  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  const fetchDataFromAPI = async () => {
    try {
      const response = await fetch('https://mocki.io/v1/31b35743-159d-41be-a612-2282c5d65b77');
      if (!response.ok) {
        throw new Error('Gagal mengambil data dari API');
      }
      const jsonData = await response.json();
      setUserData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleExportRows = (rows: MRT_Row<UserData>[]) => {
    const rowData = rows.map((row) => ({
      ...row.original,
    }));
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const rowData = userData.map((data) => ({
      userId: data.userId,
      username: data.username,
      email: data.email,
      namaLengkap: data.namaLengkap,
      alamat: data.alamat,
      role: data.role,
    }));
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    columns,
    data: userData,
    enableRowSelection: true,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button onClick={handleExportData} startIcon={<FileDownloadIcon />}>
          Export All Data
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Export All Rows
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Page Rows
        </Button>
        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Selected Rows
        </Button>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default TableUsers;
