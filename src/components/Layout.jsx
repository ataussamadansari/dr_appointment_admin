import { useState } from 'react';
import Navbar from './Navbar.jsx';
import NotificationToast from './NotificationToast.jsx';
import Sidebar from './Sidebar.jsx';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Content shifts right on desktop to make room for fixed sidebar */}
      <div className="lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
          {children}
        </main>
      </div>

      <NotificationToast />
    </div>
  );
}
