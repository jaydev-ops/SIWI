import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Image,
  Inbox,
  FileCode,
  Settings,
  Users,
  History,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('siwi_admin_user') || '{"first_name": "Harshvardhan", "role": "SUPER_ADMIN"}');

  const handleLogout = () => {
    localStorage.removeItem('siwi_admin_token');
    localStorage.removeItem('siwi_admin_user');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'Media Library', path: '/admin/media', icon: Image },
    { name: 'Enquiries', path: '/admin/enquiries', icon: Inbox },
    { name: 'Page CMS', path: '/admin/pages', icon: FileCode },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
    { name: 'Admin Users', path: '/admin/users', icon: Users },
    { name: 'Audit Log', path: '/admin/audit-log', icon: History },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans">
      {/* Admin Topbar */}
      <header className="h-14 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1.5 rounded text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/admin" className="flex items-center gap-2.5">
            <img src="/assets/images/siwi-logo.png" alt="SIWI" className="w-7 h-7 object-contain" />
            <span className="font-serif text-xl tracking-wider text-brand-gold font-semibold">SIWI</span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 font-semibold px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">
              Console
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-600 dark:text-neutral-300 hover:text-brand-gold transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-2 pl-2 border-l border-neutral-200 dark:border-neutral-800">
            <div className="text-right hidden sm:block">
              <span className="block font-medium text-xs text-neutral-900 dark:text-neutral-200 leading-none">
                {user.first_name || 'Administrator'}
              </span>
              <span className="text-[10px] text-neutral-500 font-mono uppercase">{user.role || 'Admin'}</span>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-neutral-500 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Admin Sidebar */}
        <aside
          className={`fixed md:static inset-y-14 left-0 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 z-20 flex flex-col justify-between transition-transform duration-200 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="p-3 space-y-1 overflow-y-auto">
            <span className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">
              Management
            </span>
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    active
                      ? 'bg-neutral-900 text-white dark:bg-brand-gold dark:text-neutral-950 font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500">
            <p className="font-mono">SIWI Core v2.4</p>
            <p>SQLite Embedded Relational</p>
          </div>
        </aside>

        {/* Admin Main Body */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
