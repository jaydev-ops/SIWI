import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GlobalTradeFlare } from './GlobalTradeFlare';

export const PublicLayout: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-ivoryLight text-brand-ink dark:bg-brand-ink dark:text-brand-ivory transition-colors duration-200 relative isolate">
      {/* Subtle Global Trade Flare & Ambient Navigation Mesh (Dark Mode Only) */}
      <GlobalTradeFlare />

      <Navbar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
