import { Bookmark, MessageSquare, FilePlus, Star } from 'react-feather';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface UserData {
  namaKategori: string;
  ulasanId: string;
  bukuId: string;
  judul: string;
  penulis: string;
  penerbit: string;
  tahunTerbit: string;
  ulasan: string;
  rating: string;
}

const Cards = () => {
  const [listBuku, setListBuku] = useState<UserData[]>([]);
  const [ulasanData, setUlasanData] = useState<UserData[]>([]);
  const [openedPopupBook, setOpenedPopupBook] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [collectedBooks, setCollectedBooks] = useState<string[]>([]);
  const [ulasanText, setUlasanText] = useState<string>("");

  const { data: session } = useSession();



  const fetchData = async () => {
    try {
      const result = await fetch('http://localhost:5000/ulasans');
      const data = await result.json();

      console.log('Data Ulasan JSON dari server:', data);
      setListBuku(data.buku);
      setUlasanData(data.ulasan);

      const storedCollectedBooks = localStorage.getItem('collectedBooks');
      if (storedCollectedBooks) {
        setCollectedBooks(JSON.parse(storedCollectedBooks));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handlePopup = (bukuId: string) => {
    setOpenedPopupBook(prevBookId => (prevBookId === bukuId ? null : bukuId));
  };

  const getAverageRating = (bukuId: string) => {
    const relevantUlasan = ulasanData.filter(ulasan => ulasan.bukuId === bukuId);
    if (relevantUlasan.length === 0) {
      return "N/A";
    }
    const totalRating = relevantUlasan.reduce((acc, curr) => acc + parseFloat(curr.rating), 0);
    const averageRating = totalRating / relevantUlasan.length;
    return averageRating.toFixed(2); // averageRating.toFixed(1) akan dibulatkan menjadi satu angka desimal
  };

  const addKoleksi = async (bukuId: string) => {
    try {
      const userId = (session as any).token?.token?.user?.id;
      const response = await fetch('http://localhost:5000/koleksi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bukuId, userId }),
      });
      if (response.ok) {
        setCollectedBooks(prevState => [...prevState, bukuId]);

        const updatedCollectedBooks = [...collectedBooks, bukuId];
        localStorage.setItem('collectedBooks', JSON.stringify(updatedCollectedBooks));

        alert('Buku berhasil ditambahkan ke koleksi');
      } else {
        throw new Error('Gagal menambahkan buku ke koleksi');
      }
    } catch (error) {
      console.error('Error saat menambahkan buku ke koleksi:', error);
    }
  };

  const addUlasan = async (bukuId: string, rating: number, ulasan: string) => {
    try {
      const userId = (session as any).token?.token?.user?.id;
      const response = await fetch('http://localhost:5000/ulasan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, bukuId, rating, ulasan }),
      });
      if (response.ok) {
        fetchData();
      } else {
        throw new Error('Gagal membuat ulasan baru');
      }
    } catch (error) {
      console.error('Error saat membuat ulasan baru:', error);
    }
  };  
  
  const handleRatingClick = (index: number) => {
    setSelectedRating(index + 1);
  };

  const handleAddUlasan = () => {
  if (!selectedRating) {
    alert('Silakan beri rating untuk ulasan');
    return;
  }

  if (!ulasanText) {
    alert('Silakan isi ulasan');
    return;
  }

    addUlasan(openedPopupBook ?? '', selectedRating, ulasanText);
    setUlasanText("");
    setSelectedRating(null);
  };
  
  // const deleteKoleksi = async (bukuId: string) => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/koleksi/${bukuId}`, {
  //       method: 'DELETE',
  //     });
  //     if (response.ok) {
  //       setCollectedBooks(prevState => prevState.filter(id => id !== bukuId));

  //       const updatedCollectedBooks = collectedBooks.filter(id => id !== bukuId);
  //       localStorage.setItem('collectedBooks', JSON.stringify(updatedCollectedBooks));

  //       alert('Buku berhasil dihapus dari koleksi');
  //     }
  //   } catch (error) {
  //     console.error('Terjadi kesalahan saat menghapus koleksi:', error);
  //   }
  // };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="cards">
        {Array.isArray(listBuku) && listBuku.length > 0 ? (
          listBuku.map((item) => (
            <div className="card" key={item.bukuId}>
              <div className="card-header">
                {item.judul}
              </div>
              <div className="card-body">
                <div className="card-author">Penulis: {item.penulis}</div>
                <div className="card-publisher">Penerbit: {item.penerbit}</div>
                <div className="card-pubyear">Tahun Terbit: {item.tahunTerbit}</div>
                <div className="icon-container">
                  <div className="card-rating">Rating: {getAverageRating(item.bukuId)} <Star size={21} /></div>
                  <div className="icon-group">
                    {/* {session && (
                      <button>{(session as any).token?.token?.user?.username}</button>
                    )} */}
                    <span
                      className="bookmark-icon"
                      onClick={() => addKoleksi(item.bukuId)}>
                        <Bookmark
                          size={23}
                          color={collectedBooks.includes(item.bukuId) ? "black" : "grey"}
                          fill={collectedBooks.includes(item.bukuId) ? "black" : "none"}/>
                    </span>
                    <span className="review-icon" onClick={() => handlePopup(item.bukuId)}><MessageSquare size={23} /></span>
                    <span className="review-icon" ><FilePlus size={23} /></span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Tidak ada ulasan yang tersedia</p>
        )}
      </div>

      {listBuku.map((item) => (
        <div key={item.bukuId} className={`ulasan-popup ${openedPopupBook === item.bukuId ? 'ulasan-show' : ''}`}>
          {openedPopupBook === item.bukuId && (
            <>
              <div className="list-ulasan" id="listUlasan">
                {ulasanData.filter((ulasan) => ulasan.bukuId === item.bukuId).length > 0 ? (
                  ulasanData.map((ulasan) => (
                    ulasan.bukuId === item.bukuId && (
                      <div className="ulasan-popup-item" key={ulasan.ulasanId}>
                        <span className="nama">Abdul amin rais</span>
                        <span className="ulasan">{ulasan.ulasan}</span>
                        <span className="rating">Rating: {ulasan.rating}/5 <Star size={21} /></span>
                      </div>
                    )
                  ))
                ) : (
                  <p>Tidak ada ulasan yang tersedia</p>
                )}
              </div>
              <div className="form-ulasan">
                <span>
                  Rating: 
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={21}
                      style={{ color: (selectedRating !== null && index < selectedRating) ? "#f7d851" : "#9999" }}
                      onClick={() => handleRatingClick(index)}
                    />
                  ))}
                </span>
                <textarea
                  value={ulasanText}
                  onChange={(e) => setUlasanText(e.target.value)}
                  placeholder="Masukkan ulasan"
                  maxLength={200}
                  style= {{height: "65px"}}
                />
                <button onClick={handleAddUlasan}>Tambah Ulasan</button>
              </div>
            </>
          )}
        </div>
      ))}

    </>
  );
};

export default Cards;
