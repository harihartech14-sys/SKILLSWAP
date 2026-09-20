import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import axios from 'axios';
import { Button } from './ui/Button';

const API_BASE = 'http://localhost:8080/api';

export function Chat({ exchangeId, currentUser, partner }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/exchanges/${exchangeId}/messages`);
      setMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Simple polling
    return () => clearInterval(interval);
  }, [exchangeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(`${API_BASE}/exchanges/${exchangeId}/messages`, {
        senderId: currentUser.id,
        content: newMessage.trim()
      });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="flex flex-col h-64 bg-slate-50 border-t border-slate-200 mt-4 rounded-b-lg overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {loading && <div className="text-center text-sm text-slate-400">Loading chat...</div>}
        {!loading && messages.length === 0 && <div className="text-center text-sm text-slate-400 italic">No messages yet. Say hi!</div>}
        
        {messages.map((msg, i) => {
          const isMe = msg.sender.id === currentUser.id;
          return (
            <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
              }`}>
                {msg.content}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 mx-1">
                {new Date(msg.sentAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="bg-white border-t border-slate-200 p-2 flex gap-2">
        <input 
          type="text" 
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder={`Message ${partner.name.split(' ')[0]}...`}
          className="flex-1 text-sm px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />
        <Button type="submit" variant="primary" size="sm" className="px-3" disabled={!newMessage.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
