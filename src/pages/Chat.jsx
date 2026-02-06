import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const Chat = () => {
  const { influencerId } = useParams();
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'influencer',
      text: 'Halo! Terima kasih sudah menghubungi saya 👋',
      time: '10:00',
    },
    {
      id: 2,
      sender: 'influencer',
      text: 'Ada yang bisa saya bantu untuk campaign Anda?',
      time: '10:00',
    },
    {
      id: 3,
      sender: 'user',
      text: 'Halo Kak Rina! Saya tertarik untuk kolaborasi promosi skincare local brand kami',
      time: '10:05',
    },
    {
      id: 4,
      sender: 'influencer',
      text: 'Wah menarik! Boleh tau lebih detail tentang produknya?',
      time: '10:06',
    },
  ]);

  const influencer = {
    id: 1,
    name: 'Rina Wijaya',
    username: '@rinawijaya_',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rina',
    isOnline: true,
    lastSeen: 'Online',
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate reply
    setTimeout(() => {
      const reply = {
        id: messages.length + 2,
        sender: 'influencer',
        text: 'Terima kasih atas informasinya! Saya akan segera review dan kabari balik ya 😊',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, reply]);
    }, 2000);
  };

  const quickReplies = [
    'Bisa minta rate card?',
    'Berapa lama pengerjaan?',
    'Ada slot kosong?',
    'Mau tanya tentang layanan',
  ];

  return (
    <div className="min-h-screen pt-20 bg-slate-900">
      <div className="container-custom h-[calc(100vh-5rem)]">
        <div className="glass h-full rounded-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to={`/influencer/${influencer.id}`} className="text-white/60 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="relative">
                <img src={influencer.avatar} alt={influencer.name} className="w-12 h-12 rounded-full" />
                {influencer.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-accent-500 rounded-full border-2 border-slate-900" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">{influencer.name}</h3>
                <p className="text-sm text-accent-400">{influencer.lastSeen}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Date Separator */}
            <div className="flex items-center justify-center">
              <span className="bg-white/10 px-4 py-1 rounded-full text-xs text-white/50">Hari Ini</span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end space-x-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {msg.sender === 'influencer' && (
                    <img src={influencer.avatar} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />
                  )}
                  <div>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-br-md'
                          : 'bg-white/10 text-white rounded-bl-md'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                    <p className={`text-xs text-white/40 mt-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                      {msg.time}
                      {msg.sender === 'user' && (
                        <span className="ml-1">✓✓</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 border-t border-white/10">
            <div className="flex overflow-x-auto space-x-2 pb-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(reply)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm text-white/70 whitespace-nowrap transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-4">
              <button type="button" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1 input-field"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="p-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
