const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors({
    // origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: 'Content-Type, Authorization',
  }));

const authenticateToken = (req, res, next) => {
  const {authorization} = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Akses ditolak. Anda belum login.' })
  }

  const token = authorization.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  try {
    const jwtDecode = jwt.verify(token, secret);
    req.userData = jwtDecode
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized'
    })
  }
  next()
};

app.get('/dashboard', authenticateToken, (req, res) => {
  res.json({ message: 'Selamat datang di dashboard!' });
});
  
// Register
app.post('/register', async (req, res) => {
  const {
    username,
    password,
    email,
    namaLengkap,
    alamat,
    role,
  } = req.body;
  
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
  
    if (existingUser) {
      return res.status(400).json({ error: 'Alamat email sudah terdaftar.' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        email,
        namaLengkap,
        alamat,
        role,
      },
    });
  
    res.json({ message: 'Pendaftaran berhasil' });
});
  
// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
      where: { email: email },
  });

  if (!user) {
      return res.status(404).json({ error: 'not_found' });
  }

  if (!user.password) {
      return res.status(400).json({
          message: 'Password not set',
      });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
      return res.status(401).json({ error: 'invalid_password' });
  }

  // const payload = {
  //     id: user.userId,
  //     username: user.username,
  //     email: user.email,
  // };

  const secret = process.env.JWT_SECRET;

  const expiresIn = 60 * 60 * 1;

  // const token = jwt.sign(payload, secret, { expiresIn: expiresIn });
  const token = jwt.sign({}, secret, { expiresIn: expiresIn });

  return res.json({
      data: user,
      token: token,
  });
});

app.patch('/user', async (req, res) => {
  const { username, password, email, namaLengkap, alamat, userId } = req.body;

  try {
    const result = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        namaLengkap,
        alamat,
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal memperbarui pengguna.' });
  }
});

// Kategori Read
app.get('/kategori', async (req, res) => {
  try {
    const result = await prisma.Kategori_Buku.findMany();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }  
});

// Kategori Create
app.post('/kategori', async (req, res) => {
  try {
    const result = await prisma.Kategori_Buku.create({
      data: req.body,
    });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Kategori Update
app.patch('/kategori/:id', async (req, res) => {
  try {
    const result = await prisma.Kategori_Buku.update({
      where: { kategoriId: Number(req.params.id), },
      data: { namaKategori: req.body.namaKategori, },
    });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Kategori Delete
app.delete('/kategori/:id', async (req, res) => {
  try {
    const result = await prisma.Kategori_Buku.delete({
      where: {
        kategoriId: Number(req.params.id),
      },
    });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Buku Read
app.get('/buku', async (req, res) => {
  try {
    const result = await prisma.Buku.findMany();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }  
});

// testing api
// app.post('/test/apa', async (req, res) => {
//   try {
//     const result = await prisma.dataset.create();
//     res.status(200).json(result);
//   } catch (error) {
//     console.error('error cuy');
//     res.status(200).json({ error: 'terjadi konflik', details: error.message })
//   }
// })

// Buku Create

app.post('/buku', async (req, res) => {
  try {
    const tahunTerbit = new Date(req.body.tahunTerbit).getFullYear();
    const result = await prisma.Buku.create({
      data: {
        judul: req.body.judul,
        penulis: req.body.penulis,
        penerbit: req.body.penerbit,
        tahunTerbit: tahunTerbit,
        stock: Number(req.body.stock)
      },
    });

    const kategoriId = Number(req.body.kategoriId);

    const relasi = await prisma.Kategori_Buku_Relasi.create({
      data: {
        buku: {
          connect: {
            bukuId: result.bukuId
          }
        },
        kategoriBuku: {
          connect: {
            kategoriId: kategoriId
          }
        }
      }
    });

    res.status(200).json({ result, relasi });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Buku Update
app.patch('/buku/:id', async (req, res) => {
  try {
    const result = await prisma.Buku.update({
      where: { bukuId: Number(req.params.id), },
      data: {
        judul: req.body.judul,
        penulis: req.body.penulis,
        penerbit: req.body.penerbit,
        tahunTerbit: Number(req.body.tahunTerbit)
      },
    });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Buku Delete
app.delete('/buku/:id', async (req, res) => {
  try {

    await prisma.Kategori_Buku_Relasi.deleteMany({
      where: {
        bukuId: Number(req.params.id),
      },
    });

    const result = await prisma.Buku.delete({
      where: {
        bukuId: Number(req.params.id),
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Peminjaman Read
app.get('/peminjaman', async (req, res) => {
  try {
    const result = await prisma.Peminjaman.findMany();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }  
});

// Peminjaman Create
app.post('/peminjaman', async (req, res) => {
  try {
    const result = await prisma.Peminjaman.create({
      data: {
        userId: req.body.userId,
        bukuId: req.body.bukuId,
        tanggalPeminjaman: Number(req.body.tanggalPeminjaman),
        tanggalPengembalian: Number(req.body.tanggalPengembalian),
        statusPeminjaman: req.body.statusPeminjaman
      },
    });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Peminjaman Update
app.patch('/peminjaman/:id', async (req, res) => {
  try {
    const result = await prisma.Peminjaman.update({
      where: { peminjamId: Number(req.params.id), },
      data: {
        userId: req.body.userId,
        bukuId: req.body.bukuId,
        tanggalPeminjaman: Number(req.body.tanggalPeminjaman),
        tanggalPengembalian: Number(req.body.tanggalPengembalian),
        statusPeminjaman: req.body.statusPeminjaman
      },
    });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Peminjaman Delete
app.delete('/peminjaman/:id', async (req, res) => {
  try {
    const result = await prisma.Peminjaman.delete({
      where: {
        peminjamId: Number(req.params.id),
      },
    });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Koleksi Read
app.get('/koleksi/:id', async (req, res) => {
  try {
    const result = await prisma.Koleksi_Pribadi.findUnique({
      where: { koleksiId: Number(req.params.id), },
    });

    if (!result) {
      return res.status(404).json({ message: 'Koleksi tidak ditemukan' });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }  
});

app.get('/koleksi', async (req, res) => {
  try {
    const result = await prisma.Koleksi_Pribadi.findMany();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }  
});

// Koleksi Create
app.post('/koleksi', async (req, res) => {
  try {
    const result = await prisma.Koleksi_Pribadi.create({
      data: {
        userId: req.body.userId,
        bukuId: req.body.bukuId
      },
    });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Koleksi Delete
app.delete('/koleksi/:id', async (req, res) => {
  try {
    const result = await prisma.Koleksi_Pribadi.delete({
      where: {
        bukuId: Number(req.params.id),
      },
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Relasi Kategori Read
app.get('/relasi', async (req, res) => {
  try {
    const data = await prisma.Kategori_Buku_Relasi.findMany({
      include: {
        kategoriBuku: {
          select: {
            namaKategori: true,
          },
        },
        buku: {
          select: {
            judul: true,
          },
        },
      },
    });

    const result = data.map((item) => ({
      judul: item.buku.judul,
      namaKategori: item.kategoriBuku.namaKategori,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// app.get('/koleksi', async (req, res) => {
//   try {
//     const data = await prisma.Koleksi_Pribadi.findMany({
//       include: {
//         User: {
//           select: {
//             Nama_Lengkap: true,
//           },
//         },
//         Buku: {
//           select: {
//             Judul: true,
//           },
//         },
//       },
//     });

//     const result = data.map((item) => ({
//       Judul: item.Buku.Judul,
//       Nama_Lengkap: item.User.Nama_Lengkap,
//     }));

//     res.status(200).json(result);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).json({ error: 'Internal Server Error', details: error.message });
//   }
// });

app.get('/ulasan', async (req, res) => {
  try {
    const data = await prisma.Ulasan_Buku.findMany({
      include: {
        user: {
          select: {
            namaLengkap: true,
          },
        },
        buku: {
          select: {
            judul: true,
            penulis: true,
            penerbit: true,
            tahunTerbit: true,
          },
        },
      },
    });

    const result = data.map((item) => ({
      judul: item.buku.judul,
      penulis: item.buku.penulis,
      penerbit: item.buku.penerbit,
      tahunTerbit: item.buku.tahunTerbit,
      namaLengkap: item.user.namaLengkap,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

app.post('/ulasan', async (req, res) => {
  try {
    const result = await prisma.Ulasan_Buku.create({
      data: {
        userId: req.body.userId,
        bukuId: req.body.bukuId,
        rating: Number(req.body.rating),
        ulasan: req.body.ulasan
      },
    });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ulasan Read
app.get('/ulasans', async (req, res) => {
  try {
    const bukuResult = await prisma.Buku.findMany();
    const ulasanResult = await prisma.Ulasan_Buku.findMany();
    res.status(200).json({ buku: bukuResult, ulasan: ulasanResult });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }  
});

app.listen(5000, () => {
  console.log('Server berjalan di port 5000');
});
