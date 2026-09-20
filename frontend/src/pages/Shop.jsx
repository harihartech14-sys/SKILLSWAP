import React from 'react';
import { ShoppingBag, Sparkles, Gift, Lock } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export function Shop() {
  const stored = localStorage.getItem('skillswap_user');
  const user = stored ? JSON.parse(stored) : null;
  const credits = user?.credits || 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4">
      <div className="relative max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Glow effect behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/30 mb-2">
          <ShoppingBag className="w-14 h-14 text-white" />
          <div className="absolute -top-3 -right-3 bg-rose-500 text-white text-[11px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce">
            Coming Soon
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          The <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500">SkillSwap Shop</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 max-w-lg mx-auto leading-relaxed">
          We're crafting an exclusive store where you can redeem your hard-earned teaching credits for premium goodies, profile badges, and real-world merch.
        </p>

        <Card className="max-w-md mx-auto bg-white/60 backdrop-blur-xl border-indigo-100 shadow-xl overflow-hidden mt-8 relative z-10">
          <div className="h-2 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <span className="text-slate-600 font-semibold text-lg">Your Balance</span>
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100 shadow-inner">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span className="font-bold text-lg text-indigo-700">{credits} Credits</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 opacity-75 grayscale hover:grayscale-0 transition-all duration-500 cursor-not-allowed">
              <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 relative group transition-all hover:bg-white hover:shadow-md">
                <Lock className="w-4 h-4 absolute top-2 right-2 text-slate-400" />
                <Gift className="w-8 h-8 text-indigo-500" />
                <span className="text-xs font-bold text-slate-600">Pro Badge</span>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 relative group transition-all hover:bg-white hover:shadow-md">
                <Lock className="w-4 h-4 absolute top-2 right-2 text-slate-400" />
                <ShoppingBag className="w-8 h-8 text-violet-500" />
                <span className="text-xs font-bold text-slate-600">Swag</span>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 relative group transition-all hover:bg-white hover:shadow-md">
                <Lock className="w-4 h-4 absolute top-2 right-2 text-slate-400" />
                <Sparkles className="w-8 h-8 text-amber-500" />
                <span className="text-xs font-bold text-slate-600">Boosts</span>
              </div>
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100/50">
              <p className="text-sm font-semibold text-indigo-800 flex items-start text-left">
                <span className="mr-2">💡</span>
                <span>Save up your credits! Keep swapping skills and building your balance. Something awesome is on the way.</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
