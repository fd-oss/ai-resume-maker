import { Link, useNavigate } from 'react-router-dom';
import { FileText, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 font-bold text-sky-700 text-lg">
        <FileText size={22} />
        AI Resume Maker
      </Link>
      <div className="flex items-center gap-3">
        <Link to="/editor/new" className="btn-primary flex items-center gap-1.5 text-sm">
          <Plus size={16} />
          New Resume
        </Link>
        <span className="text-sm text-gray-500">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
