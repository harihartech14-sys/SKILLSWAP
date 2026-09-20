import sys

def modify_profile():
    with open('frontend/src/pages/Profile.jsx', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Add Camera, X to lucide-react imports
    content = content.replace("import { Mail, GraduationCap, Building, Calendar, Check, Plus } from 'lucide-react';", 
                              "import { Mail, GraduationCap, Building, Calendar, Check, Plus, Camera, X } from 'lucide-react';")
    
    # 2. Add state and constants
    state_injection = '''
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
      setIsAvatarModalOpen(false);
      
      // Auto save
      try {
        setIsSaving(true);
        const payload = { ...formData, profilePicUrl: url };
        delete payload.userSkills;
        await axios.put(${API_BASE}/users/, payload);
        fetchProfile(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSaving(false);
      }
  };
'''
    content = content.replace('const [newLearn, setNewLearn] = useState(\\'\\');', 
                              'const [newLearn, setNewLearn] = useState(\\'\\');\\n' + state_injection)
    
    # 3. Update Avatar rendering
    avatar_html = '''
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
'''
    old_avatar_html = '''<div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center font-bold text-3xl mx-auto -mt-12 shadow-lg border-4 border-white text-indigo-700 overflow-hidden">
                {user.profilePicUrl ? (
                  <img src={user.profilePicUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name ? user.name.substring(0,2).toUpperCase() : 'US'
                )}
              </div>'''
    content = content.replace(old_avatar_html, avatar_html.strip())

    # 4. Remove URL input from Basic Information
    input_to_remove = '''<div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Profile Picture URL (optional)</label>
                <Input value={formData.profilePicUrl || ''} onChange={e => setFormData({...formData, profilePicUrl: e.target.value})} placeholder="https://example.com/avatar.jpg" className="max-w-md" />
              </div>'''
    content = content.replace(input_to_remove, '')
    
    # 5. Add Avatar Modal at the very end of return
    modal_html = '''
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">Choose Avatar</h3>
                    <button onClick={() => setIsAvatarModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 grid grid-cols-3 gap-4">
                    {AVATARS.map((url, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => handleAvatarSelect(url)}
                            className={spect-square rounded-2xl border-2 cursor-pointer overflow-hidden flex items-center justify-center font-bold text-2xl transition-all hover:scale-105 }
                        >
                            {url ? <img src={url} alt="Avatar" className="w-full h-full object-cover bg-indigo-50/30" /> : (user.name ? user.name.substring(0,2).toUpperCase() : 'US')}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}'''
    content = content.replace('</div>\\n  );\\n}', modal_html)
    
    with open('frontend/src/pages/Profile.jsx', 'w', encoding='utf-8') as f:
        f.write(content)

modify_profile()
