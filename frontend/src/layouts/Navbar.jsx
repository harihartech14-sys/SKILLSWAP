import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Discover', path: '/discover' },
    { name: 'Requests', path: '/requests' },
    { name: 'Exchanges', path: '/exchanges' },
    { name: 'Shop', path: '/shop' },
    { name: 'Profile', path: '/profile' },
  ];

  const [user, setUser] = useState(null);
  const [hasPendingRequests, setHasPendingRequests] = useState(false);

  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem('skillswap_user');
      if (stored) setUser(JSON.parse(stored));
    };
    loadUser();
    window.addEventListener('storage', loadUser);
    return () => window.removeEventListener('storage', loadUser);
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      if (user && user.id) {
        try {
          const res = await axios.get(`http://localhost:8080/api/exchanges/requests/incoming/${user.id}`);
          const pending = res.data.some(req => req.status === 'PENDING');
          setHasPendingRequests(pending);
        } catch (err) {
          console.error("Error fetching notifications", err);
        }
      }
    };
    fetchRequests();
    const interval = setInterval(fetchRequests, 15000); // Check every 15s
    
    window.addEventListener('requestsUpdated', fetchRequests);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('requestsUpdated', fetchRequests);
    };
  }, [user]);

  const initials = user && user.name ? user.name.substring(0,2).toUpperCase() : 'ME';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:shadow-lg group-hover:scale-105 transition-all">
                <span className="text-white font-bold text-lg leading-none">S</span>
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">SkillSwap</span>
            </Link>
            
            <div className="hidden space-x-1 md:flex">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {item.name}
                    {item.name === 'Requests' && hasPendingRequests && (
                      <span className="absolute top-2 right-1.5 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center space-x-5">
            <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-semibold text-slate-700 leading-none">{user?.name || 'User'}</span>
                <span className="text-xs font-medium text-indigo-500 mt-1">{user?.credits || 0} Credits</span>
              </div>
              <Link to="/profile" className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 border border-indigo-200/50 flex items-center justify-center text-indigo-700 font-bold hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer" title={user?.name}>
                {user?.profilePicUrl ? <img src={user.profilePicUrl} alt="Avatar" className="w-full h-full object-cover" /> : initials}
              </Link>
            </div>
            {user && (
              <button 
                onClick={() => {
                  localStorage.removeItem('skillswap_user');
                  setUser(null);
                  window.dispatchEvent(new Event('storage'));
                  navigate('/login', { replace: true });
                }}
                className="text-sm font-medium text-slate-400 hover:text-rose-600 transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
