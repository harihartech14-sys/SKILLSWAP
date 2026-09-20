import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Outlet />
      </main>
    </div>
  );
}
