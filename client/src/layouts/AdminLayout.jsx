import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage users, posts, and comments
          </p>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
