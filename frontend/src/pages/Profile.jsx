import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SkillChip } from '../components/ui/SkillChip';
import { Mail, GraduationCap, Building, Calendar, Check, Plus, Camera, X } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

export function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [newTeach, setNewTeach] = useState('');
  const [newLearn, setNewLearn] = useState('');
  
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const AVATARS = [
    '', // Default Initials
    'https://api.dicebear.com/9.x/notionists/svg?seed=Felix',
    'https://api.dicebear.com/9.x/notionists/svg?seed=Aneka',
    'https://api.dicebear.com/9.x/notionists/svg?seed=Jack',
    'https://api.dicebear.com/9.x/notionists/svg?seed=Jude',
    'https://api.dicebear.com/9.x/notionists/svg?seed=Aidan',
    'https://api.dicebear.com/9.x/notionists/svg?seed=Brooklynn',
    'https://api.dicebear.com/9.x/notionists/svg?seed=Molly',
    'https://api.dicebear.com/9.x/notionists/svg?seed=Sasha',
  ];

  const handleAvatarSelect = async (url) => {
      setFormData(prev => ({...prev, profilePicUrl: url}));
      setUser(prev => ({...prev, profilePicUrl: url}));
      setIsAvatarModalOpen(false);
      
      try {
        setIsSaving(true);
        const payload = { ...formData, profilePicUrl: url };
        delete payload.userSkills;
        const res = await axios.put(`${API_BASE}/users/${user.id}`, payload);
        localStorage.setItem('skillswap_user', JSON.stringify(res.data));
        window.dispatchEvent(new Event('storage')); // trigger navbar update
        fetchProfile(false);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSaving(false);
      }
  };

  const handleFileUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              handleAvatarSelect(reader.result);
          };
          reader.readAsDataURL(file);
      }
  };
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('skillswap_user'));

  const fetchProfile = async (showLoading = true) => {
    if (!currentUser) return;
    try {
      if (showLoading) setIsLoading(true);
      const res = await axios.get(`${API_BASE}/users/${currentUser.id}`);
      setUser(res.data);
      setFormData(res.data);
      if (res.data.userSkills) {
          setTeachSkills(res.data.userSkills.filter(us => us.skillType === 'TEACH').map(us => ({ id: us.id, name: us.skill.name })));
          setLearnSkills(res.data.userSkills.filter(us => us.skillType === 'LEARN').map(us => ({ id: us.id, name: us.skill.name })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
        setIsSaving(true);
        const payload = { ...formData };
        delete payload.userSkills; // Avoid Jackson parsing issues with nested collections

        await axios.put(`${API_BASE}/users/${user.id}`, payload);
        fetchProfile(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
        console.error(err);
        alert("Failed to update profile");
    } finally {
        setIsSaving(false);
    }
  };

  const addSkill = async (skillName, type) => {
    if (!skillName.trim()) return;
    try {
        await axios.post(`${API_BASE}/skills/user/${user.id}`, { skillName: skillName.trim(), skillType: type });
        fetchProfile(false);
        if (type === 'TEACH') setNewTeach('');
        else setNewLearn('');
    } catch (err) {
        console.error(err);
        alert("Failed to add skill");
    }
  };
  
  const removeSkill = async (userSkillId) => {
     try {
         await axios.delete(`${API_BASE}/skills/user-skill/${userSkillId}`);
         fetchProfile(false);
     } catch (err) {
         console.error(err);
         alert("Failed to remove skill.");
     }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-sm font-medium text-slate-500">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Profile</h1>
          <p className="text-slate-500 mt-2 text-lg">Manage your personal information and skill preferences.</p>
        </div>
        {saveSuccess && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg border border-emerald-100 shadow-sm animate-in fade-in slide-in-from-top-4">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Changes saved successfully</span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-none shadow-md">
            <div className="h-24 bg-gradient-to-r from-indigo-500 to-violet-600"></div>
            <CardContent className="p-6 text-center relative pt-0">
              <div 
                className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center font-bold text-3xl mx-auto -mt-12 shadow-lg border-4 border-white text-indigo-700 overflow-hidden relative group cursor-pointer"
                onClick={() => setIsAvatarModalOpen(true)}
              >
                {user.profilePicUrl ? (
                  <img src={user.profilePicUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name ? user.name.substring(0,2).toUpperCase() : 'US'
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-4">{user.name}</h2>
              <p className="text-sm text-indigo-600 font-medium mb-6">@{user.username}</p>
              
              <div className="flex flex-col gap-3 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400" /> 
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-4 h-4 text-slate-400" /> 
                  <span className="truncate">{user.qualification || 'No qualification set'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-slate-400" /> 
                  <span className="truncate">{user.institution || 'No institution set'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader className="border-b border-slate-100/50 pb-4">
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <Input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="max-w-md" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Bio</label>
                <textarea 
                  className="flex w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all min-h-[120px] resize-y"
                  placeholder="Tell others about yourself..."
                  value={formData.bio || ''} 
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                />
              </div>
              <div className="flex justify-end">
                <Button variant="primary" onClick={handleUpdate} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-slate-100/50 pb-4">
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Qualification</label>
                  <Input value={formData.qualification || ''} onChange={e => setFormData({...formData, qualification: e.target.value})} placeholder="e.g. B.Tech Computer Science" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Institution</label>
                  <Input value={formData.institution || ''} onChange={e => setFormData({...formData, institution: e.target.value})} placeholder="e.g. Stanford University" />
                </div>
                <div className="space-y-2 sm:col-span-1">
                  <label className="text-sm font-semibold text-slate-700">Graduation Year</label>
                  <Input value={formData.year || ''} onChange={e => setFormData({...formData, year: e.target.value})} type="number" placeholder="e.g. 2024" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="primary" onClick={handleUpdate} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-slate-100/50 pb-4">
              <CardTitle>My Skills</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3">Skills I can teach</h4>
                <div className="flex flex-wrap gap-2 mb-4 p-4 rounded-xl bg-slate-50 border border-slate-100 min-h-[72px]">
                  {teachSkills.map(us => <SkillChip key={us.id} skill={us.name} type="teach" onRemove={() => removeSkill(us.id)} />)}
                  {teachSkills.length === 0 && <span className="text-slate-400 text-sm m-auto">No teaching skills added yet</span>}
                </div>
                <div className="flex gap-2">
                  <Input value={newTeach} onChange={e => setNewTeach(e.target.value)} placeholder="e.g. Python, React..." className="max-w-xs" onKeyDown={(e) => e.key === 'Enter' && addSkill(newTeach, 'TEACH')} />
                  <Button variant="secondary" onClick={() => addSkill(newTeach, 'TEACH')}>
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
              
              <div className="pt-8 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-3">Skills I want to learn</h4>
                <div className="flex flex-wrap gap-2 mb-4 p-4 rounded-xl bg-slate-50 border border-slate-100 min-h-[72px]">
                  {learnSkills.map(us => <SkillChip key={us.id} skill={us.name} type="learn" onRemove={() => removeSkill(us.id)} />)}
                  {learnSkills.length === 0 && <span className="text-slate-400 text-sm m-auto">No learning skills added yet</span>}
                </div>
                <div className="flex gap-2">
                  <Input value={newLearn} onChange={e => setNewLearn(e.target.value)} placeholder="e.g. Machine Learning..." className="max-w-xs" onKeyDown={(e) => e.key === 'Enter' && addSkill(newLearn, 'LEARN')} />
                  <Button variant="secondary" onClick={() => addSkill(newLearn, 'LEARN')}>
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">Choose Avatar</h3>
                    <button onClick={() => setIsAvatarModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {AVATARS.map((url, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => handleAvatarSelect(url)}
                                className={`aspect-square rounded-2xl border-2 cursor-pointer overflow-hidden flex items-center justify-center font-bold text-2xl transition-all hover:scale-105 ${formData.profilePicUrl === url || (!formData.profilePicUrl && url === '') ? 'border-indigo-600 shadow-md shadow-indigo-500/20' : 'border-slate-100 hover:border-indigo-300'}`}
                            >
                                {url ? <img src={url} alt="Avatar" className="w-full h-full object-cover bg-indigo-50/30" /> : (user.name ? user.name.substring(0,2).toUpperCase() : 'US')}
                            </div>
                        ))}
                    </div>
                    
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-slate-500">Or</span>
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <input type="file" id="avatar-upload" hidden accept="image/*" onChange={handleFileUpload} />
                        <label 
                            htmlFor="avatar-upload" 
                            className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl text-sm font-medium text-slate-600 hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-600 cursor-pointer transition-all"
                        >
                            <Camera className="w-5 h-5 mr-2" />
                            Upload from device
                        </label>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
