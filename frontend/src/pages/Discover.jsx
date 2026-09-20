import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Search, Sparkles, Check } from 'lucide-react';
import { SkillChip } from '../components/ui/SkillChip';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

export function Discover() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [requestingId, setRequestingId] = useState(null);
  const [requestSuccess, setRequestSuccess] = useState(null);
  
  const currentUser = JSON.parse(localStorage.getItem('skillswap_user'));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE}/users`);
        const allUsers = res.data;
        
        const mappedUsers = await Promise.all(allUsers
          .filter(u => !currentUser || u.id !== currentUser.id)
          .map(async (u) => {
             let matchPercentage = 0;
             if (currentUser && currentUser.id) {
                 try {
                     const matchRes = await axios.get(`${API_BASE}/match/${currentUser.id}/${u.id}`);
                     matchPercentage = matchRes.data;
                 } catch (e) {
                     console.error("Match fetch failed", e);
                 }
             }

             const offers = u.userSkills?.filter(us => us.skillType === 'TEACH').map(us => us.skill.name) || [];
             const needs = u.userSkills?.filter(us => us.skillType === 'LEARN').map(us => us.skill.name) || [];
             
             return {
                 ...u,
                 match: matchPercentage,
                 offers,
                 needs,
                 avatar: u.name ? u.name.substring(0,2).toUpperCase() : 'US',
                 color: 'indigo'
             };
          }));
          
        setUsers(mappedUsers.sort((a,b) => b.match - a.match));
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRequest = async (receiverId) => {
    if (!currentUser) return alert("Please login first");
    setRequestingId(receiverId);
    try {
        await axios.post(`${API_BASE}/exchanges/request`, {
            requesterId: currentUser.id,
            receiverId: receiverId,
            requestedSkillId: 1
        });
        setRequestSuccess(receiverId);
        setTimeout(() => setRequestSuccess(null), 3000);
    } catch (err) {
        console.error(err);
        alert("Failed to send request.");
    } finally {
        setRequestingId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.offers.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
    u.needs.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Discover</h1>
          <p className="text-slate-500 mt-2 text-lg">Find people who can teach what you want to learn.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input 
            className="pl-11 h-12 text-base rounded-2xl shadow-sm border-slate-200 bg-white" 
            placeholder="Search by skill or name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
            <p className="text-sm font-medium text-slate-500">Discovering matches...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-500 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <Sparkles className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No matches found</h3>
              <p>Try adjusting your search terms or adding more skills to your profile.</p>
            </div>
          )}
          {filteredUsers.map(user => (
            <Card key={user.id} className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-slate-100 flex flex-col h-full">
              <CardContent className="p-6 flex flex-col flex-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-700 flex items-center justify-center font-bold text-xl shadow-inner border border-indigo-50">
                      {user.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 line-clamp-1">{user.name}</h3>
                      <p className="text-sm text-slate-500 line-clamp-1">{user.qualification || 'SkillSwap Member'}</p>
                    </div>
                  </div>
                  {user.match > 0 && (
                    <div className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm ${user.match >= 50 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'}`}>
                      {user.match}% Match
                    </div>
                  )}
                </div>
                
                <div className="space-y-4 mb-6 flex-1">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Offers</div>
                    <div className="flex flex-wrap gap-1.5">
                      {user.offers.map(s => <SkillChip key={s} skill={s} type="teach" />)}
                      {user.offers.length === 0 && <span className="text-xs text-slate-400 italic">None</span>}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Needs</div>
                    <div className="flex flex-wrap gap-1.5">
                      {user.needs.map(s => <SkillChip key={s} skill={s} type="learn" />)}
                      {user.needs.length === 0 && <span className="text-xs text-slate-400 italic">None</span>}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-5 border-t border-slate-100/80 mt-auto">
                  <Link to={`/user/${user.id}`} className="flex-1">
                    <Button variant="secondary" className="w-full h-10 text-sm">View Profile</Button>
                  </Link>
                  <Button 
                    variant={requestSuccess === user.id ? 'success' : 'primary'} 
                    className={`flex-1 h-10 text-sm ${requestSuccess === user.id ? 'pointer-events-none' : ''}`}
                    onClick={() => handleRequest(user.id)}
                    disabled={requestingId === user.id}
                  >
                    {requestingId === user.id ? 'Sending...' : requestSuccess === user.id ? <><Check className="w-4 h-4 mr-1.5"/> Sent!</> : 'Request'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
