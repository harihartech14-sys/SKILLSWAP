import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SkillChip } from '../components/ui/SkillChip';
import { Star, GraduationCap, Building, ArrowLeft, Check } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

export function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [matchPct, setMatchPct] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  
  const currentUser = JSON.parse(localStorage.getItem('skillswap_user'));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE}/users/${id}`);
        setProfileUser(res.data);
        
        if (currentUser) {
            const matchRes = await axios.get(`${API_BASE}/match/${currentUser.id}/${id}`);
            setMatchPct(matchRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [id, currentUser]);

  const handleRequest = async () => {
    if (!currentUser || !profileUser) return;
    
    // Determine which skill to request
    const profileTeachSkills = profileUser.userSkills?.filter(us => us.skillType === 'TEACH') || [];
    if (profileTeachSkills.length === 0) {
        alert("This user doesn't have any skills to teach.");
        return;
    }
    
    let requestedSkillId = profileTeachSkills[0].skill.id;
    
    // Try to find overlap with what current user wants to learn
    const currentUserRes = await axios.get(`${API_BASE}/users/${currentUser.id}`);
    const currentUserSkills = currentUserRes.data.userSkills || [];
    
    if (currentUserSkills.length > 0) {
        const myLearnSkills = currentUserSkills.filter(us => us.skillType === 'LEARN').map(us => us.skill.name);
        const overlap = profileTeachSkills.find(us => myLearnSkills.includes(us.skill.name));
        if (overlap) {
            requestedSkillId = overlap.skill.id;
        }
    }
    
    try {
        setRequesting(true);
        await axios.post(`${API_BASE}/exchanges/request`, {
            requesterId: currentUser.id,
            receiverId: profileUser.id,
            requestedSkillId: requestedSkillId
        });
        setRequestSuccess(true);
        setTimeout(() => setRequestSuccess(false), 3000);
    } catch (err) {
        alert("Failed to send request.");
    } finally {
        setRequesting(false);
    }
  };

  if (isLoading || !profileUser) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-sm font-medium text-slate-500">Loading user profile...</p>
        </div>
      </div>
    );
  }

  const teachSkills = profileUser.userSkills?.filter(us => us.skillType === 'TEACH').map(us => us.skill.name) || [];
  const learnSkills = profileUser.userSkills?.filter(us => us.skillType === 'LEARN').map(us => us.skill.name) || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center space-x-4 mb-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 px-2">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-none shadow-md">
            <div className="h-32 bg-gradient-to-br from-indigo-500 to-violet-600 relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            </div>
            <CardContent className="p-6 text-center relative pt-0">
              <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center font-bold text-4xl mx-auto -mt-14 shadow-lg border-4 border-white text-indigo-700">
                {profileUser.name ? profileUser.name.substring(0,2).toUpperCase() : 'US'}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mt-5">{profileUser.name}</h2>
              <p className="text-sm font-medium text-indigo-600 mb-6">@{profileUser.username}</p>
              
              <div className="flex flex-col gap-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-left">
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-amber-500" /> 
                  <span className="font-semibold text-slate-900">{profileUser.averageRating ? profileUser.averageRating.toFixed(1) : 'New'} <span className="text-slate-500 font-normal">Rating</span></span>
                </div>
                {profileUser.qualification && (
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-slate-400" /> 
                    <span className="truncate">{profileUser.qualification}</span>
                  </div>
                )}
                {profileUser.institution && (
                  <div className="flex items-center gap-3">
                    <Building className="w-4 h-4 text-slate-400" /> 
                    <span className="truncate">{profileUser.institution}</span>
                  </div>
                )}
              </div>

              {currentUser && currentUser.id !== profileUser.id && (
                <div className="space-y-4">
                  {matchPct > 0 && (
                    <div className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-100 shadow-sm">
                      {matchPct}% Skill Match
                    </div>
                  )}
                  <Button 
                    variant={requestSuccess ? 'success' : 'primary'} 
                    className={`w-full shadow-lg ${requestSuccess ? 'pointer-events-none' : 'shadow-indigo-500/25'}`} 
                    onClick={handleRequest} 
                    disabled={requesting}
                  >
                    {requesting ? 'Sending...' : requestSuccess ? <><Check className="w-4 h-4 mr-2"/> Request Sent!</> : 'Request SkillSwap'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b border-slate-100/50 pb-4">
              <CardTitle>About {profileUser.name.split(' ')[0]}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                {profileUser.bio || <span className="text-slate-400 italic">No bio provided by this user yet.</span>}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-slate-100/50 pb-4">
              <CardTitle>Skills Profile</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div>
                <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Can Teach</h4>
                <div className="flex flex-wrap gap-2">
                  {teachSkills.map(s => <SkillChip key={s} skill={s} type="teach" />)}
                  {teachSkills.length === 0 && <span className="text-slate-400 text-sm italic">None listed</span>}
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Wants to Learn</h4>
                <div className="flex flex-wrap gap-2">
                  {learnSkills.map(s => <SkillChip key={s} skill={s} type="learn" />)}
                  {learnSkills.length === 0 && <span className="text-slate-400 text-sm italic">None listed</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
