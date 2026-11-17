'use client';
import { useState } from 'react';

const initialConversations = [
  { id: 'conv-100', tenantId: 'tenant-a', name: '+91 98765 43210', lastMessage: 'Your Order has shipped' },
  { id: 'conv-101', tenantId: 'tenant-a', name: '+91 91234 56789', lastMessage: 'Delivery update: Out for delivery' },
  { id: 'conv-102', tenantId: 'tenant-b', name: '+91 99887 76655', lastMessage: 'Your OTP is 4829' },
  { id: 'conv-103', tenantId: 'tenant-b', name: '+91 97711 22334', lastMessage: 'Payment confirmed successfully' },
];

const initialMessages = {
  'conv-100': [
    { id: 'msg-123', text: 'Your Order has shipped', status: 'DELIVERED', sender: 'system', time: '08:30 AM' },
  ],
  'conv-101': [
    { id: 'msg-124', text: 'Your package is out for delivery.', status: 'SENT', sender: 'system', time: '09:15 AM' },
  ],
  'conv-102': [
    { id: 'msg-125', text: 'Your OTP is 4829', status: 'READ', sender: 'system', time: '10:00 AM' },
  ],
  'conv-103': [
    { id: 'msg-126', text: 'Payment confirmed successfully', status: 'DELIVERED', sender: 'system', time: '11:20 AM' },
  ],
};

export default function MessagingDashboard() {
  const [conversations] = useState(initialConversations);
  const [activeConv, setActiveConv] = useState(initialConversations[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsgId = `msg-${Date.now()}`;
    const newMessage = {
      id: newMsgId,
      text: inputText,
      status: 'QUEUED',
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentConvId = activeConv.id;

    setMessages((prev) => ({
      ...prev,
      [currentConvId]: [...(prev[currentConvId] || []), newMessage],
    }));
    setInputText('');

    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [currentConvId]: prev[currentConvId].map((msg) =>
          msg.id === newMsgId ? { ...msg, status: 'SENT' } : msg
        ),
      }));
    }, 1500);

    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [currentConvId]: prev[currentConvId].map((msg) =>
          msg.id === newMsgId ? { ...msg, status: 'DELIVERED' } : msg
        ),
      }));
    }, 3000);

    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [currentConvId]: prev[currentConvId].map((msg) =>
          msg.id === newMsgId ? { ...msg, status: 'READ' } : msg
        ),
      }));
    }, 4500);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'QUEUED':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'SENT':
        return 'bg-blue-950 text-blue-400 border-blue-800';
      case 'DELIVERED':
        return 'bg-purple-950 text-purple-400 border-purple-800';
      case 'READ':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <div className="w-96 border-r border-gray-800 bg-gray-950 flex flex-col shadow-xl">
        <div className="p-5 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">Messaging Hub</h1>
          <p className="text-xs text-gray-400 mt-1">Tenant: <span className="text-emerald-400 font-mono">{activeConv.tenantId}</span></p>
        </div>
        <div className="overflow-y-auto flex-1 p-3 space-y-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConv(conv)}
              className={`w-full text-left p-4 rounded-xl transition-all ${activeConv.id === conv.id ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40' : 'hover:bg-gray-900 text-gray-300'
                }`}
            >
              <div className="font-semibold text-sm text-white">{conv.name}</div>
              <div className="text-xs truncate opacity-75 mt-1">{conv.lastMessage}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-900">
        <div className="p-5 border-b border-gray-800 bg-gray-950 flex justify-between items-center shadow-sm">
          <div>
            <h2 className="font-bold text-lg text-white">{activeConv.name}</h2>
            <p className="text-xs text-gray-400">Conversation ID: {activeConv.id}</p>
          </div>
          <span className="text-xs bg-emerald-950 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-800 font-medium">
            System Connected
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {(messages[activeConv.id] || []).map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-md p-4 rounded-2xl shadow-md ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200 border border-gray-700/50'
                  }`}
              >
                <p className="text-sm">{msg.text}</p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-700/50 text-[10px] opacity-90 gap-6">
                  <span>{msg.time}</span>
                  <span className={`font-mono uppercase px-2 py-0.5 rounded border tracking-wide font-semibold ${getStatusBadgeClass(msg.status)}`}>
                    {msg.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800 bg-gray-950 flex gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-600/20"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}