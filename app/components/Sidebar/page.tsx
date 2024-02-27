import { Settings, Bookmark, BookOpen, Database } from 'react-feather';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <ul>
      <li>
        <Link href="/">Home</Link>
      </li>
      <hr />
      <li>
        <Link href="/data">
          <Database className='mr-2' size={20} strokeWidth={1.5} />Data Management
        </Link>
      </li>
      <hr />
      <li>
        <Link href="/peminjaman">
          <BookOpen className='mr-2' size={20} strokeWidth={1.5} />Loan Records
        </Link>
      </li>
      <hr />
      <li>
        <Link href="/koleksi">
          <Bookmark className='mr-2' size={20} strokeWidth={1.5} />Book Collection
        </Link>
      </li>
      <hr />
      <li>
        <Link href="/pengaturan">
          <Settings className='mr-2' size={20} strokeWidth={1.5} />Settings
        </Link>
      </li>
    </ul>
  );
};

export default Sidebar;
