import React, { useState, useEffect } from 'react';
import '../../styles/formbk.module.css'

interface FormProps {
  isSHForm: boolean;
}

interface Kategori {
  kategoriId: string;
  namaKategori: string;
}

interface Buku {
  judul: string;
  penulis: string;
  penerbit: string;
  tahunTerbit: string;
  stock: string;
  kategoriId: string;
}

const FormBuku: React.FC<FormProps> = ({ isSHForm }) => {
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [buku, setBuku] = useState<Buku>({
    judul: '',
    penulis: '',
    penerbit: '',
    tahunTerbit: '',
    stock: '',
    kategoriId: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBuku({
      ...buku,
      [name]: value
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const selectedKategori = kategoriList.find(kategori => kategori.namaKategori === buku.kategoriId);
  };

  return (
    <div className={`formbuku-container ${isSHForm ? 'show-form' : ''}`}>
      <form className="input-form" onSubmit={handleSubmit}>
        <div>
          <label>
            Judul:
            <input
              type="text"
              name="judul"
              value={buku.judul}
              onChange={handleChange}
            />
          </label>
          <label>
            Penulis:
            <input
              type="text"
              name="penulis"
              value={buku.penulis}
              onChange={handleChange}
            />
          </label>
          <label>
            Penerbit:
            <input
              type="text"
              name="penerbit"
              value={buku.penerbit}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Kategori:
            <div className="dropdown-container">
              <input list="kategori" name="kategoriId" value={buku.kategoriId} onChange={handleChange} placeholder="Type here..." />
              <datalist id="kategori">
                {kategoriList.map((item) => (
                  <option key={item.kategoriId} value={item.namaKategori} />
                ))}
              </datalist>
            </div>
          </label>
          <label>
            Tahun Terbit:
            <input
              type="date"
              name="tahunTerbit"
              value={buku.tahunTerbit}
              onChange={handleChange}
            />
          </label>
          <label>
            Jumlah Stock:
            <input
              type="text"
              name="stock"
              value={buku.stock}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Add Book Data</button>
        </div>
      </form>
    </div>
  );
};

export default FormBuku;
