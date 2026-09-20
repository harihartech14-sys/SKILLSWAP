import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowRight, Sparkles, Target, Users } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('skillswap_user')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-white relative overflow-hidden">
      {/* Premium Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-violet-50/50 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <header className="flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-xl fixed w-full z-50 border-b border-slate-100/50">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20">
              <span className="text-white font-bold text-lg leading-none">S</span>
            </div>
            <div className="text-xl font-bold tracking-tight text-slate-900">SkillSwap</div>
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
            Log in
          </Link>
          <Link to="/onboarding">
            <Button variant="primary" size="sm" className="shadow-lg shadow-indigo-500/25">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 z-10">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4" />
          <span>The new way to learn</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mb-6 leading-tight animate-in fade-in slide-in-from-bottom-5 duration-500">
          Share your skills. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            Learn together.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700 leading-relaxed">
          You know something. Someone wants to learn it. Someone else knows what you want to learn. 
          SkillSwap connects you to exchange skills without spending a dime.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-in fade-in slide-in-from-bottom-7 duration-1000">
          <Link to="/onboarding">
            <Button variant="primary" size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-xl shadow-indigo-500/25 group">
              Get Started <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Feature Cards Section */}
        <div className="mt-32 max-w-6xl w-full grid md:grid-cols-3 gap-8 px-4">
          <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-indigo-100/50">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Build your profile</h3>
            <p className="text-slate-500 leading-relaxed">Add the skills you can teach and the ones you want to learn. Set your availability.</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-violet-100/50">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Find a match</h3>
            <p className="text-slate-500 leading-relaxed">Our algorithm connects you with people who need what you have, and have what you need.</p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-emerald-100/50">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Swap skills</h3>
            <p className="text-slate-500 leading-relaxed">Send a request, start an exchange via video chat, and learn something new today.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
