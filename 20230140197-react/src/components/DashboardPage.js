import React from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-blue-200 flex flex-col items-center justify-center p-8">
      
      <div className="flex space-x-6 items-center">
        
        <h1 className="text-3xl font-bold text-black-300 mb-4">
          Login Sukses!
        </h1>

        <p className="text-lg text-gray-700 mb-8">
          Halo Selamat Datang di Halaman Dashboard.
        </p>

        <button
          onClick={handleLogout}
          className="py-2 px-6 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Logout
        </button>
      </div>

    </div>
  );
}

export default DashboardPage;
