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

interface Buku {
  bukuId: number;
  judul: string;
  penulis: string;
  penerbit: string;
  tahunTerbit: number;
  stock: number;
}

const columnHelper = createMRTColumnHelper<Buku>();

const columns = [
  columnHelper.accessor('bukuId', {
    header: 'ID Buku',
    size: 80,
  }),
  columnHelper.accessor('judul', {
    header: 'Judul Buku',
    size: 200,
  }),
  columnHelper.accessor('penulis', {
    header: 'Penulis',
    size: 150,
  }),
  columnHelper.accessor('penerbit', {
    header: 'Penerbit',
    size: 200,
  }),
  columnHelper.accessor('tahunTerbit', {
    header: 'Tahun Terbit',
    size: 100,
  }),
  columnHelper.accessor('stock', {
    header: 'Stok',
    size: 80,
  }),
];

const csvConfig = mkConfig({
  fieldSeparator: ',',
  decimalSeparator: '.',
  useKeysAsHeaders: true,
});

const TableBuku = () => {
  const [data, setData] = useState<Buku[]>([]);

  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  const fetchDataFromAPI = async () => {
    try {
      const response = await fetch('https://mocki.io/v1/d7d26cb6-4a00-48ba-8f89-e07c67974198');
      if (!response.ok) {
        throw new Error('Gagal mengambil data dari API');
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleExportRows = (rows: MRT_Row<Buku>[]) => {
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
          Export Semua Data
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          startIcon={<FileDownloadIcon />}
        >
          Export Semua Baris
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Baris Halaman
        </Button>
        <Button
          disabled={
            !table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
          }
          onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export Baris Terpilih
        </Button>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default TableBuku;
