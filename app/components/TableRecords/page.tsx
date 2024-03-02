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

interface Peminjaman {
  peminjamId: number;
  userId: number;
  bukuId: number;
  tanggalPeminjaman: string;
  tanggalPengembalian: string;
  statusPeminjaman: string;
}

const columnHelper = createMRTColumnHelper<Peminjaman>();

const columns = [
  columnHelper.accessor('peminjamId', {
    header: 'Peminjam ID',
    size: 100,
  }),
  columnHelper.accessor('userId', {
    header: 'User ID',
    size: 100,
  }),
  columnHelper.accessor('bukuId', {
    header: 'Buku ID',
    size: 100,
  }),
  columnHelper.accessor('tanggalPeminjaman', {
    header: 'Tanggal Peminjaman',
    size: 150,
  }),
  columnHelper.accessor('tanggalPengembalian', {
    header: 'Tanggal Pengembalian',
    size: 180,
  }),
  columnHelper.accessor('statusPeminjaman', {
    header: 'Status Peminjaman',
    size: 150,
  }),
];

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

const TableRecords = () => {
  const [data, setData] = useState<Peminjaman[]>([]);

  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  const fetchDataFromAPI = async () => {
    try {
      const response = await fetch('https://mocki.io/v1/83c80bb4-4a20-4bff-9eff-7aad53b0eac7');
      if (!response.ok) {
        throw new Error('Gagal mengambil data dari API');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleExportRows = (rows: MRT_Row<Peminjaman>[]) => {
    const rowData = rows.map((row) => ({
      ...row.original,
    }));
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const rowData = data.map((item) => ({
      ...item,
    }));
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const table = useMaterialReactTable({
    columns,
    data,
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

export default TableRecords;
