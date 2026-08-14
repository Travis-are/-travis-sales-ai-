import { useState, useRef, useEffect } from 'react';

export default function ChatWidget({ 
  businessName = 'Travis Prompt AI', 
  industry = 'professional',
  greeting,
  quickReplies: customQuickReplies,
  embedded = false,
  config = {}
}) {
  const [isOpen, setIsOpen] = useState(embedded);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [sessionId] = useState(() => 'sess_' + Date.now());
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const defaultGreeting = greeting || `Hello, I'm the AI assistant for ${businessName}. I can help answer questions, provide information, understand what you need, and guide you toward the right next step. If your request requires a team member, I can pass it to a human. What can I help you with today?`;
  
  const defaultQuickReplies = customQuickReplies || [
    'I want information',
    "I'm interested in a product or service",
    'I want a price or quote',
    'I want to book an appointment',
    'I have a question',
    'I want to speak with a human'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage(defaultGreeting, true);
      }, embedded ? 300 : 600);
    }
  }, [isOpen]);

  const addBotMessage = (text, showQR = false) => {
    setMessages(prev => [...prev, { 
      role: 'bot', 
      text, 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }]));
    setShowQuickReplies(showQR);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { 
      role: 'user', 
      text, 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    }]));
    setShowQuickReplies(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userText = input.trim();
    setInput('');
    addUserMessage(userText);
    setIsTyping(true);

    try {
      const conversationHistory = messages.map(m => ({
        role: m.role === 'bot' ? 'assistant' : 'user',
        content: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...conversationHistory, { role: 'user', content: userText }],
          sessionId
        })
      });

      const data = await res.json();
      
      if (data.reply) {
        addBotMessage(data.reply, false);
        
        if (data.leadData && (data.leadData.email || data.leadData.phone)) {
          saveLead(data.leadData, data.leadScore);
        }
        
        if (messages.length > 4 && messages.length % 4 === 0) {
          setShowQuickReplies(true);
        }
      } else {
        addBotMessage("I'm having trouble connecting right now. Please leave your email and I'll have a team member reach out within 24 hours.", false);
      }
    } catch (err) {
      console.error(err);
      addBotMessage("I'm experiencing a brief technical issue. Could you share your email or WhatsApp so our team can reach you directly?", false);
    } finally {
      setIsTyping(false);
    }
  };

  const saveLead = async (leadData, leadScore) => {
    if (leadCaptured) return;
    
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...leadData,
          score: leadScore?.score || 0,
          status: leadScore?.status || 'COLD',
          signals: leadScore?.signals || [],
          sessionId,
          source: 'chatbot'
        })
      });
      setLeadCaptured(true);
    } catch (e) {
      console.error('Failed to save lead:', e);
    }
  };

  const handleQuickReply = (text) => {
    setInput(text);
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {!embedded && (
        <button className="launcher" onClick={() => setIsOpen(!isOpen)} aria-label="Open chat">
          {isOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          )}
        </button>
      )}

      <div className={`chat-window ${isOpen ? 'open' : ''} ${embedded ? 'embedded' : ''}`}>
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="chat-avatar">{businessName.charAt(0)}</div>
            <div>
              <div className="chat-header-title">{businessName} AI</div>
              <div className="chat-header-status">
                <span className="status-dot"></span>
                Online now
              </div>
            </div>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              <div className="message-bubble">
                {msg.text}
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message bot">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          
          {showQuickReplies && messages.length > 0 && (
            <div className="quick-replies">
              {defaultQuickReplies.map((reply, i) => (
                <button key={i} className="quick-reply" onClick={() => handleQuickReply(reply)}>
                  {reply}
                </button>
              ))}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder={isTyping ? "AI is typing..." : "Type your message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
          />
          <button 
            className="chat-send" 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>

        {!embedded && (
          <div className="chat-footer">
            <span>AI Assistant</span>
            <span className="footer-dot">·</span>
            <a href="#" onClick={(e) => { e.preventDefault(); addBotMessage("I'm connecting you to a human team member. Please leave your contact details and someone will reach out within 24 hours.", false); }}>
              Speak to human
            </a>
          </div>
        )}
      </div>

      <style jsx>{`
        .launcher {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #e8e8e8;
          color: #0a0a0a;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
          z-index: 1000;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .launcher:hover { transform: scale(1.05); }
        .launcher:active { transform: scale(0.95); }

        .chat-window {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 380px;
          max-width: calc(100vw - 40px);
          height: 560px;
          max-height: calc(100vh - 120px);
          background: #141414;
          border: 1px solid #2a2a2a;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          z-index: 999;
          opacity: 0;
          transform: translateY(20px) scale(0.95);
          pointer-events: none;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        .chat-window.open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: all;
        }
        .chat-window.embedded {
          position: relative;
          bottom: auto;
          right: auto;
          width: 100%;
          max-width: 100%;
          height: 100vh;
          max-height: 100vh;
          border-radius: 0;
          opacity: 1;
          transform: none;
          pointer-events: all;
        }
        @media (max-width: 480px) {
          .chat-window {
            bottom: 0;
            right: 0;
            width: 100vw;
            max-width: 100vw;
            height: 100vh;
            max-height: 100vh;
            border-radius: 0;
            border: none;
          }
        }

        .chat-header {
          padding: 16px 20px;
          border-bottom: 1px solid #2a2a2a;
          display: flex;
          align-items: center;
          background: #141414;
        }
        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .chat-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e8e8e8;
          color: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }
        .chat-header-title {
          font-size: 15px;
          font-weight: 600;
          color: #f0f0f0;
        }
        .chat-header-status {
          font-size: 12px;
          color: #888;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #27ae60;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }

        .message {
          display: flex;
          max-width: 85%;
          animation: msgIn 0.3s ease;
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .message.bot { align-self: flex-start; }
        .message.user { align-self: flex-end; margin-left: auto; }

        .message-bubble {
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.5;
          color: #f0f0f0;
          background: #1c1c1c;
          border: 1px solid #2a2a2a;
          border-top-left-radius: 4px;
          position: relative;
        }
        .message.user .message-bubble {
          background: #e8e8e8;
          color: #0a0a0a;
          border-top-right-radius: 4px;
          border-top-left-radius: 12px;
        }
        .message-time {
          display: block;
          font-size: 10px;
          color: #666;
          margin-top: 4px;
          text-align: right;
        }
        .message.user .message-time {
          color: #888;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 16px;
          background: #1c1c1c;
          border: 1px solid #2a2a2a;
          border-radius: 12px;
          border-top-left-radius: 4px;
        }
        .typing-indicator span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #555;
          animation: bounce 1.4s infinite ease-in-out;
        }
        .typing-indicator span:nth-child(1) { animation-delay: 0s; }
        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }

        .quick-replies {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding-left: 0;
          margin-top: 4px;
          margin-bottom: 8px;
        }
        .quick-reply {
          padding: 8px 14px;
          border-radius: 20px;
          border: 1px solid #333;
          background: transparent;
          color: #aaa;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .quick-reply:hover {
          background: #2a2a2a;
          border-color: #555;
          color: #f0f0f0;
        }
        .quick-reply:active {
          transform: scale(0.97);
        }

        .chat-input-area {
          padding: 12px 16px 16px;
          border-top: 1px solid #2a2a2a;
          display: flex;
          gap: 8px;
          align-items: center;
          background: #141414;
        }
        .chat-input {
          flex: 1;
          padding: 10px 14px;
          border-radius: 20px;
          border: 1px solid #2a2a2a;
          background: #0a0a0a;
          color: #f0f0f0;
          font-size: 14px;
          outline: none;
          font-family: inherit;
        }
        .chat-input:focus { border-color: #555; }
        .chat-input::placeholder { color: #555; }
        .chat-send {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: #e8e8e8;
          color: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: opacity 0.2s;
          flex-shrink: 0;
        }
        .chat-send:hover { opacity: 0.85; }
        .chat-send:disabled { opacity: 0.3; cursor: not-allowed; }

        .chat-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 8px;
          font-size: 11px;
          color: #555;
          border-top: 1px solid #2a2a2a;
        }
        .chat-footer a {
          color: #888;
          text-decoration: none;
        }
        .chat-footer a:hover {
          color: #f0f0f0;
        }
        .footer-dot {
          color: #333;
        }
      `}</style>
    </>
  );
}
