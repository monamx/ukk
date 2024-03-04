"use client"
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const Setting = () => {
  const { data: session } = useSession();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [namaLengkap, setnamaLengkap] = useState('');
  const [alamat, setalamat] = useState('');

  useEffect(() => {
  if (session) {
    setUsername((session as any)?.token?.token?.user?.username );
    setEmail((session as any)?.token?.token?.user?.email);
    setnamaLengkap((session as any)?.token?.token?.user?.namaLengkap);
    setalamat((session as any)?.token?.token?.user?.alamat);
  }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedUser = {
      username,
      email,
      namaLengkap,
      alamat,
    };

    try {
      userId: (session as any)?.token?.token?.user?.userId
      const response = await fetch('http://localhost:5000/user/${userId}', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        console.log('Profil pengguna diperbarui!');
      } else {
        console.error('Gagal memperbarui profil pengguna.');
      }
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };

  if (session) {
    console.log('Token 1:', (session as any).token);
      console.log('Token 2:', (session as any).token?.token);
      console.log('Token 3:', (session as any).token?.token?.token);
      console.log('Token 4:', (session as any).token?.token?.token?.token);
      console.log('Token 5:', (session as any).token?.token?.token?.token?.token);
    }

  return (
    <div className="min-h-screen flexjustify-center">
      <div className="container mx-auto p-16">
        <h1 className="text-3xl font-bold mb-6 text-center">Pengaturan Profil</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-gray-200 p-6 rounded-3xl">
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
            <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Username"
            />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Email"
            />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
            <input
            type="text"
            value={namaLengkap}
            onChange={(e) => setnamaLengkap(e.target.value)}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Full Name"
            />
        </div>
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
            <textarea
            value={alamat}
            onChange={(e) => setalamat(e.target.value)}
            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Address"
            />
        </div>
        <div className="flex items-center justify-center">
            <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
            Simpan
            </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default Setting;
