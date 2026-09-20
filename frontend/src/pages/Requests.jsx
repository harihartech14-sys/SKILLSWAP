import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Inbox, Send, ArrowRight, Check, X, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

export function Requests() {
  const [activeTab, setActiveTab] = useState('incoming');
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentUser = JSON.parse(localStorage.getItem('skillswap_user'));

  const fetchRequests = async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      const incomingRes = await axios.get(`${API_BASE}/exchanges/requests/incoming/${currentUser.id}`);
      const sentRes = await axios.get(`${API_BASE}/exchanges/requests/sent/${currentUser.id}`);
      setIncomingRequests(incomingRes.data);
      setSentRequests(sentRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
        await axios.post(`${API_BASE}/exchanges/request/${id}/${action}`);
        fetchRequests();
        window.dispatchEvent(new Event('requestsUpdated'));
    } catch (err) {
        console.error(err);
        alert(`Failed to ${action} request`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-sm font-medium text-slate-500">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Exchange Requests</h1>
        <p className="text-slate-500 mt-2 text-lg">Manage your incoming and outgoing SkillSwap requests.</p>
      </div>

      <div className="flex border-b border-slate-200/60 bg-white/50 backdrop-blur-sm sticky top-16 z-10 rounded-t-2xl">
        <button
          className={`flex-1 sm:flex-none px-6 py-4 text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'incoming' ? 'border-indigo-600 text-indigo-700 bg-indigo-50/30' : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
          onClick={() => setActiveTab('incoming')}
        >
          <Inbox className="w-4 h-4" /> Incoming 
          <span className={`ml-1.5 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'incoming' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
            {incomingRequests.length}
          </span>
        </button>
        <button
          className={`flex-1 sm:flex-none px-6 py-4 text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${activeTab === 'sent' ? 'border-indigo-600 text-indigo-700 bg-indigo-50/30' : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
          onClick={() => setActiveTab('sent')}
        >
          <Send className="w-4 h-4" /> Sent
          <span className={`ml-1.5 inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'sent' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
            {sentRequests.length}
          </span>
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'incoming' && incomingRequests.length === 0 && (
          <Card className="bg-slate-50/50 border-dashed border-slate-200 shadow-none">
            <CardContent className="p-12 text-center text-slate-500 flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No incoming requests</h3>
              <p>When someone wants to learn from you, it will appear here.</p>
            </CardContent>
          </Card>
        )}
        
        {activeTab === 'incoming' && incomingRequests.map(req => (
          <Card key={req.id} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5 w-full sm:w-auto">
                  <Link to={`/user/${req.requester?.id}`}>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-700 flex items-center justify-center font-bold text-xl shadow-inner border border-indigo-50 hover:scale-105 transition-transform cursor-pointer">
                      {req.requester?.name ? req.requester.name.substring(0,2).toUpperCase() : 'US'}
                    </div>
                  </Link>
                  <div>
                    <Link to={`/user/${req.requester?.id}`} className="font-bold text-lg text-slate-900 hover:text-indigo-600 transition-colors">
                      {req.requester?.name}
                    </Link>
                    <div className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span> Wants to exchange skills with you
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                  <Button variant="outline" className="flex-1 sm:flex-none h-10 border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50" onClick={() => handleAction(req.id, 'reject')}>
                    <X className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Decline</span>
                  </Button>
                  <Button variant="primary" className="flex-1 sm:flex-none h-10 shadow-indigo-500/25" onClick={() => handleAction(req.id, 'accept')}>
                    <Check className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Accept Request</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {activeTab === 'sent' && sentRequests.length === 0 && (
          <Card className="bg-slate-50/50 border-dashed border-slate-200 shadow-none">
            <CardContent className="p-12 text-center text-slate-500 flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <Send className="w-8 h-8 text-slate-400 ml-1" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No sent requests</h3>
              <p className="mb-4">You haven't requested any skill exchanges yet.</p>
              <Link to="/discover">
                <Button variant="secondary">Find matches <ArrowRight className="w-4 h-4 ml-2" /></Button>
              </Link>
            </CardContent>
          </Card>
        )}
        
        {activeTab === 'sent' && sentRequests.map(req => (
          <Card key={req.id} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5 w-full sm:w-auto">
                  <Link to={`/user/${req.receiver?.id}`}>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 flex items-center justify-center font-bold text-xl shadow-inner border border-slate-50 hover:scale-105 transition-transform cursor-pointer">
                      {req.receiver?.name ? req.receiver.name.substring(0,2).toUpperCase() : 'US'}
                    </div>
                  </Link>
                  <div>
                    <div className="font-bold text-lg text-slate-900">
                      Sent to <Link to={`/user/${req.receiver?.id}`} className="hover:text-indigo-600 transition-colors">{req.receiver?.name}</Link>
                    </div>
                    <div className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Awaiting response
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 w-full sm:w-auto items-center justify-between sm:justify-end mt-4 sm:mt-0">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                    req.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 
                    req.status === 'REJECTED' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 
                    'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {req.status === 'PENDING' && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 animate-pulse"></div>}
                    {req.status}
                  </span>
                  {req.status === 'PENDING' && (
                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleAction(req.id, 'reject')}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
