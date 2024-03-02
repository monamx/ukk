import { Settings, Bookmark, BookOpen, Database, Users, List } from 'react-feather';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <ul>
      <li>
        <Link href="/">Home</Link>
      </li>
      <hr />
      <li>
        <Link href="/dashboard/buku">
          <Database className='mr-2' size={20} strokeWidth={1.5} />Data Management
        </Link>
      </li>
      <hr />
      <li>
        <Link href="/dashboard/user">
          <Users className='mr-2' size={20} strokeWidth={1.5} />Users
        </Link>
      </li>
      <hr />
      <li>
        <Link href="/dashboard/peminjaman">
          <BookOpen className='mr-2' size={20} strokeWidth={1.5} />Loan Records
        </Link>
      </li>
      <hr />
      <li>
        <Link href="/dashboard/list">
          <List className='mr-2' size={20} strokeWidth={1.5} />Lists
        </Link>
      </li>
      <hr />
      <li>
        <Link href="/dashboard/koleksi">
          <Bookmark className='mr-2' size={20} strokeWidth={1.5} />Book Collection
        </Link>
      </li>
      {/* <hr />
      <li>
        <Link href="/pengaturan">
          <Settings className='mr-2' size={20} strokeWidth={1.5} />Settings
        </Link>
      </li> */}
    </ul>
  );
};

export default Sidebar;
