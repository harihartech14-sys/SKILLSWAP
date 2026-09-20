import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, Sparkles } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('skillswap_user')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Username and Password are required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const res = await axios.post(`${API_BASE}/users/login`, { username, password });
      
      localStorage.setItem('skillswap_user', JSON.stringify(res.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-6 group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">SkillSwap</span>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500">Enter your credentials to access your account</p>
        </div>

        <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.08)] bg-white/80 backdrop-blur-xl">
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="p-4 bg-rose-50 text-rose-600 text-sm font-medium rounded-xl border border-rose-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    placeholder="e.g. demo" 
                    className="pl-10 h-12 bg-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" 
                    className="pl-10 h-12 bg-white"
                  />
                </div>
              </div>
              
              <Button type="submit" variant="primary" className="w-full h-12 mt-2 shadow-lg shadow-indigo-500/25" disabled={isSubmitting}>
                {isSubmitting ? "Logging in..." : <span className="flex items-center justify-center gap-2">Log in <ArrowRight className="w-4 h-4" /></span>}
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">Or</span>
                </div>
              </div>

              <div className="text-center text-sm text-slate-600">
                Don't have an account? <Link to="/onboarding" className="text-indigo-600 font-bold hover:underline hover:text-indigo-700">Create one now</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
