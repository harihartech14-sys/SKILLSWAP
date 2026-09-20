import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { SkillChip } from '../components/ui/SkillChip';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, CheckCircle, Flame, Sparkles } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

export function Dashboard() {
  const [user, setUser] = useState({ name: "Guest", credits: 0, averageRating: 0.0 });
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stored = localStorage.getItem('skillswap_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          const userRes = await axios.get(`${API_BASE}/users/${parsed.id}`);
          setUser(userRes.data || parsed);
          
          if (userRes.data && userRes.data.userSkills) {
             setTeachSkills(userRes.data.userSkills.filter(us => us.skillType === 'TEACH').map(us => us.skill.name));
             setLearnSkills(userRes.data.userSkills.filter(us => us.skillType === 'LEARN').map(us => us.skill.name));
          }
          
          // Fetch dynamic matches (top 2)
          const usersRes = await axios.get(`${API_BASE}/users`);
          const allUsers = usersRes.data.filter(u => u.id !== parsed.id);
          const mappedUsers = await Promise.all(allUsers.map(async (u) => {
             let matchPercentage = 0;
             try {
                 const matchRes = await axios.get(`${API_BASE}/match/${parsed.id}/${u.id}`);
                 matchPercentage = matchRes.data;
             } catch (e) {}
             const offers = u.userSkills?.filter(us => us.skillType === 'TEACH').map(us => us.skill.name) || [];
             const needs = u.userSkills?.filter(us => us.skillType === 'LEARN').map(us => us.skill.name) || [];
             return { ...u, match: matchPercentage, offers, needs };
          }));
          const sorted = mappedUsers.sort((a,b) => b.match - a.match).slice(0, 2);
          setMatches(sorted);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-sm font-medium text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="text-slate-500 mt-2 text-lg">Here's what's happening with your SkillSwap journey.</p>
        </div>
        <Link to="/discover">
          <Button variant="primary" className="shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-4 h-4 mr-2" /> Find Matches
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Star className="w-16 h-16 text-amber-500" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center space-x-2 text-slate-500 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Star className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-sm font-medium">Rating</span>
            </div>
            <div className="text-4xl font-bold text-slate-900 tracking-tight">{user.averageRating ? user.averageRating.toFixed(1) : 'New'}</div>
          </CardContent>
        </Card>
        
        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-16 h-16 text-indigo-500" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center space-x-2 text-slate-500 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Clock className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="text-sm font-medium">Pending Requests</span>
            </div>
            <div className="text-4xl font-bold text-slate-900 tracking-tight">0</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle className="w-16 h-16 text-emerald-500" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center space-x-2 text-slate-500 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-sm font-medium">Exchanges</span>
            </div>
            <div className="text-4xl font-bold text-slate-900 tracking-tight">0</div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Flame className="w-16 h-16 text-orange-500" />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center space-x-2 text-slate-500 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <div className="text-orange-600 font-bold leading-none">$</div>
              </div>
              <span className="text-sm font-medium">Credits</span>
            </div>
            <div className="text-4xl font-bold text-slate-900 tracking-tight">{user.credits || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recommended Matches</h2>
            <Link to="/discover" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
              View all <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {matches.length === 0 && (
              <Card className="bg-slate-50/50 border-dashed border-slate-200 shadow-none">
                <CardContent className="p-12 text-center text-slate-500">
                  <Sparkles className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                  <p>Find more users to connect with in the Discover section.</p>
                </CardContent>
              </Card>
            )}
            
            {matches.map(m => (
            <Card key={m.id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 border border-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-xl shadow-inner">
                      {m.name ? m.name.substring(0,2).toUpperCase() : 'US'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        {m.name} 
                        {m.match > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            {m.match}% Match
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-slate-500 mt-0.5">{m.qualification || 'SkillSwap Member'}</p>
                    </div>
                  </div>
                  <div className="flex-1 w-full sm:w-auto text-left sm:text-right">
                    <div className="text-sm text-slate-500 mb-3 sm:mb-2 space-y-1 sm:space-y-0">
                      <div className="sm:inline-block mr-4">
                        Needs: <span className="font-medium text-slate-700">{m.needs?.slice(0,2).join(', ') || 'None'}</span>
                      </div>
                      <div className="sm:inline-block">
                        Offers: <span className="font-medium text-slate-700">{m.offers?.slice(0,2).join(', ') || 'None'}</span>
                      </div>
                    </div>
                    <Link to={`/user/${m.id}`}>
                      <Button variant="secondary" size="sm" className="w-full sm:w-auto">View Profile</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-b from-white to-slate-50/50">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle>Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Skills I can teach</h4>
                  <div className="flex flex-wrap gap-2">
                    {teachSkills.length === 0 ? (
                      <span className="text-sm text-slate-400 italic">No skills added</span>
                    ) : (
                      teachSkills.map(s => <SkillChip key={s} skill={s} type="teach" />)
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Skills I want to learn</h4>
                  <div className="flex flex-wrap gap-2">
                    {learnSkills.length === 0 ? (
                      <span className="text-sm text-slate-400 italic">No skills added</span>
                    ) : (
                      learnSkills.map(s => <SkillChip key={s} skill={s} type="learn" />)
                    )}
                  </div>
                </div>
                <div className="pt-6 mt-2 border-t border-slate-100">
                  <Link to="/profile">
                    <Button variant="outline" className="w-full">Edit Profile</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
