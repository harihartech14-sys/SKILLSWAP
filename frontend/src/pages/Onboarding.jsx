import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SkillChip } from '../components/ui/SkillChip';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, BookOpen, GraduationCap, Sparkles, Plus } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

export function Onboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    bio: '',
    qualification: '',
    institution: '',
    year: ''
  });

  const [teachSkills, setTeachSkills] = useState([]);
  const [currentTeach, setCurrentTeach] = useState('');
  
  const [learnSkills, setLearnSkills] = useState([]);
  const [currentLearn, setCurrentLearn] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    if (step === 1) {
      if (!formData.name || !formData.username || !formData.email || !formData.password) {
        alert("Please fill in all mandatory fields (marked with *) before continuing.");
        return;
      }
    }

    if (step < 5) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        const userRes = await axios.post(`${API_BASE}/users/register`, formData);
        const userId = userRes.data.id;
        
        for (const skill of teachSkills) {
            await axios.post(`${API_BASE}/skills/user/${userId}`, { skillName: skill, skillType: 'TEACH' });
        }
        for (const skill of learnSkills) {
            await axios.post(`${API_BASE}/skills/user/${userId}`, { skillName: skill, skillType: 'LEARN' });
        }
        
        localStorage.setItem('skillswap_user', JSON.stringify(userRes.data));
        navigate('/dashboard');
      } catch (err) {
        console.error("Failed to register", err);
        alert("Registration failed. Please check the console.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateForm = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const addTeachSkill = (e) => {
    if(e) e.preventDefault();
    if (currentTeach.trim() && !teachSkills.includes(currentTeach.trim())) {
      setTeachSkills([...teachSkills, currentTeach.trim()]);
      setCurrentTeach('');
    }
  };

  const addLearnSkill = (e) => {
    if(e) e.preventDefault();
    if (currentLearn.trim() && !learnSkills.includes(currentLearn.trim())) {
      setLearnSkills([...learnSkills, currentLearn.trim()]);
      setCurrentLearn('');
    }
  };

  const removeTeachSkill = (skill) => {
    setTeachSkills(teachSkills.filter(s => s !== skill));
  };

  const removeLearnSkill = (skill) => {
    setLearnSkills(learnSkills.filter(s => s !== skill));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-xl w-full z-10">
        
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-8 px-4 relative">
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-200 rounded-full -z-10"></div>
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full -z-10 transition-all duration-500 ease-in-out" style={{ width: `${((step - 1) / 4) * 100}%`, maxWidth: 'calc(100% - 4rem)' }}></div>
          
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm ${
                step > num ? 'bg-indigo-600 text-white shadow-indigo-200' : 
                step === num ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-indigo-200 scale-110' : 
                'bg-white text-slate-400 border-2 border-slate-200'
              }`}>
                {step > num ? <Check className="w-5 h-5" /> : num}
              </div>
            </div>
          ))}
        </div>

        <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-0 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-2 pt-8 px-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mb-4 shadow-inner border border-indigo-100/50">
              {step === 1 && <BookOpen className="w-6 h-6" />}
              {step === 2 && <GraduationCap className="w-6 h-6" />}
              {step === 3 && <Sparkles className="w-6 h-6" />}
              {step === 4 && <Sparkles className="w-6 h-6" />}
              {step === 5 && <Check className="w-6 h-6" />}
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              {step === 1 && "Create your account"}
              {step === 2 && "Education & Background"}
              {step === 3 && "Skills you can teach"}
              {step === 4 && "Skills you want to learn"}
              {step === 5 && "Profile Complete!"}
            </CardTitle>
            <p className="text-sm text-slate-500 mt-2">
              {step === 1 && "Let's get started with your basic information."}
              {step === 2 && "Tell us a bit about your educational journey."}
              {step === 3 && "What are you good at? What can you offer?"}
              {step === 4 && "What new things do you want to explore?"}
              {step === 5 && "Review your profile before we finish."}
            </p>
          </CardHeader>
          
          <CardContent className="pt-6 px-8 pb-8">
            {/* Step Content */}
            <div className="min-h-[280px]">
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 text-left">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Full Name <span className="text-rose-500 font-bold">*</span></label>
                    <Input name="name" value={formData.name} onChange={updateForm} placeholder="e.g. Alice Smith" className="h-12 bg-white" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Username <span className="text-rose-500 font-bold">*</span></label>
                    <Input name="username" value={formData.username} onChange={updateForm} placeholder="e.g. alice_design" className="h-12 bg-white" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Email Address <span className="text-rose-500 font-bold">*</span></label>
                    <Input name="email" value={formData.email} onChange={updateForm} type="email" placeholder="e.g. alice@example.com" className="h-12 bg-white" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Password <span className="text-rose-500 font-bold">*</span></label>
                    <Input name="password" value={formData.password} onChange={updateForm} type="password" placeholder="Choose a strong password" className="h-12 bg-white" required />
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <Input name="qualification" value={formData.qualification} onChange={updateForm} placeholder="Highest Qualification / Degree" className="h-12 bg-white" />
                  <Input name="institution" value={formData.institution} onChange={updateForm} placeholder="Institution / College" className="h-12 bg-white" />
                  <Input name="year" value={formData.year} onChange={updateForm} type="number" placeholder="Graduation Year" min="1900" max="2100" className="h-12 bg-white" />
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={updateForm}
                    className="flex w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 min-h-[100px] resize-none shadow-sm placeholder:text-slate-400" 
                    placeholder="Short Bio - Tell us about yourself..."
                  />
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4 duration-300">
                  <form onSubmit={addTeachSkill} className="flex gap-2">
                    <Input 
                      value={currentTeach} 
                      onChange={e => setCurrentTeach(e.target.value)} 
                      placeholder="e.g. Java, Python, Figma..." 
                      className="h-12 bg-white shadow-sm"
                    />
                    <Button type="submit" variant="secondary" className="h-12 px-6"><Plus className="w-4 h-4 mr-1"/> Add</Button>
                  </form>
                  <div className="flex flex-wrap gap-2 justify-center mt-4 min-h-[160px] border border-slate-200 bg-slate-50/50 rounded-2xl p-6 shadow-inner">
                    {teachSkills.map(skill => (
                      <SkillChip key={skill} skill={skill} type="teach" onRemove={() => removeTeachSkill(skill)} />
                    ))}
                    {teachSkills.length === 0 && (
                      <div className="flex flex-col items-center justify-center w-full h-full text-slate-400">
                        <Sparkles className="w-8 h-8 mb-2 opacity-20" />
                        <span className="text-sm font-medium">Add skills you can teach</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-4 duration-300">
                  <form onSubmit={addLearnSkill} className="flex gap-2">
                    <Input 
                      value={currentLearn} 
                      onChange={e => setCurrentLearn(e.target.value)} 
                      placeholder="e.g. UI Design, Marketing..." 
                      className="h-12 bg-white shadow-sm"
                    />
                    <Button type="submit" variant="secondary" className="h-12 px-6"><Plus className="w-4 h-4 mr-1"/> Add</Button>
                  </form>
                  <div className="flex flex-wrap gap-2 justify-center mt-4 min-h-[160px] border border-slate-200 bg-slate-50/50 rounded-2xl p-6 shadow-inner">
                    {learnSkills.map(skill => (
                      <SkillChip key={skill} skill={skill} type="learn" onRemove={() => removeLearnSkill(skill)} />
                    ))}
                    {learnSkills.length === 0 && (
                      <div className="flex flex-col items-center justify-center w-full h-full text-slate-400">
                        <Sparkles className="w-8 h-8 mb-2 opacity-20" />
                        <span className="text-sm font-medium">Add skills you want to learn</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="text-center py-6 animate-in zoom-in-95 duration-300">
                  <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-700 rounded-2xl flex items-center justify-center font-bold text-3xl mx-auto mb-6 shadow-inner border border-indigo-50">
                    {formData.name ? formData.name.substring(0,2).toUpperCase() : 'ME'}
                  </div>
                  <h3 className="text-2xl font-bold mb-1 text-slate-900">{formData.name || 'Your Name'}</h3>
                  <p className="text-sm font-medium text-slate-500 mb-8">{formData.qualification || 'Qualification'} • {formData.year}</p>
                  
                  <div className="flex gap-4 justify-center bg-slate-50 p-4 rounded-2xl border border-slate-100 mx-auto max-w-xs">
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-indigo-600 mb-1">{teachSkills.length}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Teaching</div>
                    </div>
                    <div className="w-px bg-slate-200"></div>
                    <div className="text-center flex-1">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">{learnSkills.length}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Learning</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6 mt-6 border-t border-slate-100/80">
              <Button 
                variant="outline" 
                onClick={handleBack} 
                className={`flex-1 h-12 border-slate-200 hover:bg-slate-50 transition-opacity ${step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                disabled={isSubmitting || step === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button 
                variant="primary" 
                onClick={handleNext} 
                className="flex-[2] h-12 shadow-lg shadow-indigo-500/25" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : (step === 5 ? "Complete Profile" : <span className="flex items-center justify-center">Continue <ArrowRight className="w-4 h-4 ml-2" /></span>)}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
