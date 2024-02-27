import { useState } from 'react';
import { Sidebar, Bell, User } from 'react-feather';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  handleCollapse: (shouldCollapse: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleCollapse }) => {
  const [isPopupOpen, setPopupOpen] = useState({
    notification: false,
    profile: false,
  });
  const pathname = usePathname();

  const handleNavbarClick = () => {
    handleCollapse(false);
    setPopupOpen({ notification: false, profile: false });
  };

  const handleBellClick = () => {
    setPopupOpen((prev) => ({ ...prev, notification: !prev.notification }));
    setPopupOpen((prev) => ({ ...prev, profile: false }));
  };

  const handleProfileClick = () => {
    setPopupOpen((prev) => ({ ...prev, profile: !prev.profile }));
    setPopupOpen((prev) => ({ ...prev, notification: false }));
  };

  let title = '';
  if (pathname === '/peminjaman') {
    title = 'Peminjam';
  } else if (pathname === '/data') {
    title = 'Barang';
  } else {
    title = 'Page Not Found';
  }

  return (
    <div className="flex justify-between items-center bg-white text-gray-700 py-4 px-6 border-b border-gray-300 fixed top-0 left-0 w-full z-50">
      <div className="navbar-left">
        <a className="navbar-collapse" onClick={handleNavbarClick}>
          <Sidebar />
        </a>
        <span>PusPin</span>
        <div className="border-r-2 border-solid border-gray-700 mx-4 self-stretch h-9"></div>
        <span className='judul'>{title}</span>
      </div>
      <div className="navbar-right">
        <button>
          {/* You can add user data here */}
          User
        </button>

        <div className="navbar-notification" onClick={handleBellClick}>
          <Bell />
          <span className="notification-badge">1</span>
          {isPopupOpen.notification && (
            <div className="absolute right-0 top-12 bg-white border border-gray-300 shadow-md p-4 z-50 rounded-lg min-w-300">
              <div className="notification-content">
                <p>This is notification popup content</p>
                <div className="notification-actions">
                  <a href="#" onClick={(e) => { e.preventDefault(); }}>Confirm</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); }}>View</a>
                </div>
              </div>
              <div className="notification-content">
                <p>This is notification popup content</p>
                <div className="notification-actions">
                  <a href="#" onClick={(e) => { e.preventDefault(); }}>Confirm</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); }}>View</a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="profile" onClick={handleProfileClick}>
          <User />
          {isPopupOpen.profile && (
            <div className="profile-popup">
              <div className="profile-content">
                <a href="#" onClick={(e) => { e.preventDefault(); }}>Edit Profile</a>
                <a href="#" onClick={(e) => { e.preventDefault(); }}>Settings</a>
                <a href="#" onClick={() => console.log('Logged out')}>Logout</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
