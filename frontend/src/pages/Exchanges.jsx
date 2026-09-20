import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MessageCircle, Calendar, Video, CheckCircle2, Star, Clock, Send } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const Chat = ({ exchangeId, currentUser, partner }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const res = await axios.get(`${API_BASE}/chat/${exchangeId}`);
            setMessages(res.data);
        } catch (err) {
            console.error("Failed to load messages", err);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [exchangeId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            await axios.post(`${API_BASE}/chat/${exchangeId}`, {
                senderId: currentUser.id,
                content: newMessage.trim()
            });
            setNewMessage('');
            fetchMessages();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col h-[450px] bg-slate-50/50 border-t border-slate-100">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-slate-400 mt-10 flex flex-col items-center">
                        <MessageCircle className="w-10 h-10 mb-2 opacity-50" />
                        <p className="text-sm font-medium">No messages yet.</p>
                        <p className="text-xs">Say hi to start the conversation!</p>
                    </div>
                )}
                {messages.map(msg => {
                    const isMe = msg.sender.id === currentUser.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'}`}>
                                <div className="text-[11px] font-medium opacity-70 mb-1 tracking-wider uppercase">
                                    {isMe ? 'You' : partner.name}
                                </div>
                                <div className="text-sm leading-relaxed">{msg.content}</div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
                <div className="flex gap-3">
                    <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..." 
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                    />
                    <Button type="submit" variant="primary" className="h-12 w-12 rounded-xl p-0 flex items-center justify-center shadow-indigo-500/25">
                        <Send className="w-5 h-5 -ml-1 mt-0.5" />
                    </Button>
                </div>
            </form>
        </div>
    );
};

export function Exchanges() {
  const [exchanges, setExchanges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openChat, setOpenChat] = useState({});
  const [openSchedule, setOpenSchedule] = useState({});
  
  const currentUser = JSON.parse(localStorage.getItem('skillswap_user'));

  const fetchExchanges = async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE}/exchanges/user/${currentUser.id}`);
      setExchanges(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExchanges();
  }, []);

  const handleComplete = async (id) => {
    if(!window.confirm("Are you sure you want to mark this exchange as completed?")) return;
    try {
        await axios.post(`${API_BASE}/exchanges/${id}/complete`);
        fetchExchanges();
    } catch (err) {
        console.error(err);
        alert("Failed to complete exchange.");
    }
  };

  const handleReview = async (exchangeId, revieweeId) => {
     const score = prompt("Enter a score from 1 to 5:");
     if (!score) return;
     const parsed = parseInt(score);
     if (isNaN(parsed) || parsed < 1 || parsed > 5) {
         alert("Invalid score"); return;
     }
     const comment = prompt("Enter a brief review comment (optional):");
     
     try {
         await axios.post(`${API_BASE}/exchanges/${exchangeId}/review`, {
             reviewerId: currentUser.id,
             revieweeId: revieweeId,
             score: parsed,
             comment: comment || ""
         });
         alert("Review submitted!");
     } catch (err) {
         console.error(err);
         alert("Failed to submit review.");
     }
  };

  const toggleChat = (id) => {
      setOpenChat(prev => ({...prev, [id]: !prev[id]}));
  };

  const toggleScheduleForm = (id) => {
      setOpenSchedule(prev => ({...prev, [id]: !prev[id]}));
  };

  const submitSchedule = async (id, e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const meetingLink = formData.get('meetingLink');
      const scheduledTimeStr = formData.get('scheduledTime');
      
      const scheduledTime = scheduledTimeStr ? new Date(scheduledTimeStr).toISOString() : null;

      try {
          await axios.put(`${API_BASE}/exchanges/${id}/schedule`, {
              meetingLink,
              scheduledTime
          });
          alert("Session scheduled successfully!");
          setOpenSchedule(prev => ({...prev, [id]: false}));
          fetchExchanges();
      } catch (err) {
          console.error(err);
          alert("Failed to schedule session.");
      }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-sm font-medium text-slate-500">Loading your exchanges...</p>
        </div>
      </div>
    );
  }

  const activeExchanges = exchanges.filter(ex => ex.status === 'IN_PROGRESS');
  const completedExchanges = exchanges.filter(ex => ex.status === 'COMPLETED');

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Exchanges</h1>
        <p className="text-slate-500 mt-2 text-lg">Manage your active sessions and view past SkillSwap exchanges.</p>
      </div>

      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Active Sessions</h2>
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">{activeExchanges.length}</span>
        </div>
        <div className="space-y-6">
          {activeExchanges.length === 0 && (
            <Card className="bg-slate-50/50 border-dashed border-slate-200 shadow-none">
              <CardContent className="p-12 text-center text-slate-500">
                <Video className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-1">No active exchanges</h3>
                <p>Accept an incoming request or wait for yours to be accepted to start exchanging skills.</p>
              </CardContent>
            </Card>
          )}
          {activeExchanges.map(ex => {
            const isReceiver = currentUser.id === ex.request.receiver.id;
            const partner = ex.request.requester.id === currentUser.id ? ex.request.receiver : ex.request.requester;
            return (
            <Card key={ex.id} className="border-indigo-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-shadow hover:shadow-lg">
              <CardContent className="p-0">
                <div className="p-8 flex flex-col lg:flex-row gap-8 items-start lg:items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-bl-full -z-10 opacity-50"></div>
                  
                  <div className="flex items-center gap-5 w-full lg:w-auto shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-700 flex items-center justify-center font-bold text-3xl shadow-inner border border-indigo-50 shrink-0">
                      {partner.name ? partner.name.substring(0,2).toUpperCase() : 'US'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">Exchange with {partner.name}</h3>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                        <Clock className="w-3.5 h-3.5" /> Started {new Date(ex.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full lg:w-auto">
                    {(ex.meetingLink || ex.scheduledTime) ? (
                      <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-indigo-50 shadow-sm flex flex-col sm:flex-row gap-4 sm:items-center">
                         {ex.scheduledTime && (
                           <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                             <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                               <Calendar className="w-4 h-4 text-indigo-600" />
                             </div>
                             {new Date(ex.scheduledTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                           </div>
                         )}
                         {ex.meetingLink && (
                           <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium sm:ml-auto">
                             <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                               <Video className="w-4 h-4 text-emerald-600" />
                             </div>
                             <a href={ex.meetingLink.startsWith('http') ? ex.meetingLink : `https://${ex.meetingLink}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-700 hover:underline transition-colors truncate max-w-[200px] inline-block align-bottom">
                               Join Meeting
                             </a>
                           </div>
                         )}
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-amber-700 bg-amber-50 px-4 py-3 rounded-xl border border-amber-100 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Session not scheduled yet. {isReceiver ? 'Please set a time.' : 'Waiting for partner to schedule.'}
                      </div>
                    )}
                  </div>
                  
                  <div className="shrink-0 flex flex-wrap lg:flex-col gap-3 w-full lg:w-auto mt-2 lg:mt-0">
                    {isReceiver && (
                        <Button variant="ghost" className="text-indigo-700 bg-indigo-50 hover:bg-indigo-100 flex-1 lg:flex-none border border-indigo-100" onClick={() => toggleScheduleForm(ex.id)}>
                            <Calendar className="w-4 h-4 mr-2" /> {ex.meetingLink || ex.scheduledTime ? 'Reschedule' : 'Schedule'}
                        </Button>
                    )}
                    <Button variant={openChat[ex.id] ? 'secondary' : 'outline'} className="flex items-center justify-center flex-1 lg:flex-none border-slate-200" onClick={() => toggleChat(ex.id)}>
                        <MessageCircle className="w-4 h-4 mr-2" /> {openChat[ex.id] ? 'Hide Chat' : 'Chat'}
                    </Button>
                    <Button variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex-1 lg:flex-none" onClick={() => handleComplete(ex.id)}>
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Complete
                    </Button>
                  </div>
                </div>
                
                {openSchedule[ex.id] && isReceiver && (
                  <form onSubmit={(e) => submitSchedule(ex.id, e)} className="bg-indigo-50/50 border-t border-indigo-100 p-8 flex flex-col gap-6 animate-in slide-in-from-top-2">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900">Schedule Session</h4>
                      <p className="text-sm text-slate-500">Set a time and provide a meeting link for this exchange.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Date & Time</label>
                            <input required type="datetime-local" name="scheduledTime" defaultValue={ex.scheduledTime ? new Date(ex.scheduledTime).toISOString().slice(0, 16) : ''} className="px-4 py-3 border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 shadow-sm" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-slate-700">Meeting Link (Zoom, Meet, etc.)</label>
                            <input required type="url" name="meetingLink" defaultValue={ex.meetingLink || ''} placeholder="https://meet.google.com/..." className="px-4 py-3 border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 shadow-sm" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={() => toggleScheduleForm(ex.id)}>Cancel</Button>
                        <Button type="submit" variant="primary">Save Schedule</Button>
                    </div>
                  </form>
                )}
                {openChat[ex.id] && <Chat exchangeId={ex.id} currentUser={currentUser} partner={partner} />}
              </CardContent>
            </Card>
          )})}
        </div>
      </section>

      <section className="pt-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Completed Exchanges</h2>
        <div className="space-y-4">
          {completedExchanges.length === 0 && (
            <Card className="bg-slate-50/50 border-dashed border-slate-200 shadow-none">
              <CardContent className="p-8 text-center text-slate-500">
                <p>No completed exchanges yet.</p>
              </CardContent>
            </Card>
          )}
          {completedExchanges.map(ex => {
            const partner = ex.request.requester.id === currentUser.id ? ex.request.receiver : ex.request.requester;
            return (
            <Card key={ex.id} className="bg-slate-50/80 border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5 w-full sm:w-auto">
                  <div className="w-14 h-14 rounded-2xl bg-slate-200/80 text-slate-600 flex items-center justify-center font-bold text-xl shadow-inner shrink-0 grayscale opacity-80">
                    {partner.name ? partner.name.substring(0,2).toUpperCase() : 'US'}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Exchange with {partner.name}</h3>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Completed on {new Date(ex.completedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-auto">
                    <Button variant="secondary" className="w-full sm:w-auto border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100" onClick={() => handleReview(ex.id, partner.id)}>
                      <Star className="w-4 h-4 mr-2 text-amber-500" /> Rate Partner
                    </Button>
                </div>
              </CardContent>
            </Card>
          )})}
        </div>
      </section>
    </div>
  );
}
