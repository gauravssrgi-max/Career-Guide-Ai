/**
 * Chat Page — AI Career Mentor Interface
 * 
 * This component provides a real-time chat interface where students
 * can interact with the AI career mentor. Features include:
 * - Suggested starter questions for quick access
 * - Auto-scrolling message feed
 * - Typing indicator while AI processes
 * - Formatted numbered responses with highlighted career names
 * 
 * @author Gaurav Kumar Shah
 */
'use client';
import { useState, useRef, useEffect } from 'react';
import api from '../../lib/api';
import styles from './Chat.module.css';

const suggestions = [
  'What career is best for me?',
  'How much does a software engineer earn in India?',
  'I\'m confused about my career — help me!',
  'Tell me about data science careers',
  'What exams should I prepare for engineering?',
];

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const newMessages = [...messages, { role: 'user', content: msg }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setIsSidebarOpen(false);

    try {
      const res = await api.chat(newMessages);
      setMessages([...newMessages, { role: 'assistant', content: res.data.response }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again! 😊' }]);
    }
    setLoading(false);
  };

  return (
    <div className={styles.chatPage}>
      <div className={styles.container}>
        {/* Sidebar */}
        <div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{fontSize:'0.9rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em',color:'var(--text-tertiary)'}}>💡 Try asking</h3>
            <button className="mobile-show" onClick={() => setIsSidebarOpen(false)} style={{ fontSize: '1.2rem' }}>✕</button>
          </div>
          {suggestions.map((s, i) => (
            <button key={i} className={styles.suggestion} onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className={styles.chatArea}>
          <div className={styles.chatHeader}>
            <button className={styles.mobileMenuBtn} onClick={() => setIsSidebarOpen(true)}>
              ☰
            </button>
            <div className={styles.avatar}>🤖</div>
            <div>
              <h2 style={{fontSize:'1rem',fontWeight:700}}>AI Career Mentor</h2>
              <span className="text-xs" style={{color:'var(--success)',fontWeight:600}}>● Online</span>
            </div>
          </div>

          <div ref={chatRef} className={styles.messages}>
            {messages.length === 0 && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <span style={{fontSize:'4rem',marginBottom:20}}>🎯</span>
                <h3 className="heading-md">Hi! I'm your AI Career Mentor</h3>
                <p className="text-sm" style={{color:'var(--text-secondary)',maxWidth:400,marginTop:8}}>
                  Ask me anything about careers, exams, salaries, or your future. I'm here to help you find your path! 😊
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.msgRow} ${msg.role === 'user' ? styles.msgUser : ''}`}>
                {msg.role === 'assistant' && <div className={styles.avatar}>🤖</div>}
                <div className={`${styles.bubble} ${msg.role === 'user' ? styles.userBubble : styles.aiBubble}`}>
                  {msg.content.replace(/\*\*/g,'').replace(/\*/g,'').split('\n').filter(l => l.trim()).map((line, j) => {
                    const numbered = line.match(/^(\d+)\.\s*(.+?)(\s*[-–—]\s*)(.+)$/);
                    if (numbered) {
                      return (
                        <p key={j} style={{marginTop: j > 0 ? 12 : 0, lineHeight: 1.7}}>
                          <span style={{color: msg.role === 'user' ? 'white' : 'var(--accent)',fontWeight:800}}>{numbered[1]}.</span>{' '}
                          <span style={{fontWeight:700,color: msg.role === 'user' ? 'white' : 'var(--text-primary)'}}>{numbered[2].trim()}</span>
                          <span style={{color: msg.role === 'user' ? 'rgba(255,255,255,0.9)' : 'var(--text-secondary)'}}> — {numbered[4].trim()}</span>
                        </p>
                      );
                    }
                    return <p key={j} style={{marginTop: j > 0 ? 12 : 0, lineHeight: 1.7}}>{line}</p>;
                  })}
                </div>
              </div>
            ))}
            {loading && (
              <div className={styles.msgRow}>
                <div className={styles.avatar}>🤖</div>
                <div className={`${styles.bubble} ${styles.aiBubble}`}>
                  <div className="flex" style={{ gap: 4 }}>
                    <div className="spinner-dot" />
                    <div className="spinner-dot" style={{animationDelay:'0.2s'}} />
                    <div className="spinner-dot" style={{animationDelay:'0.4s'}} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.inputArea}>
            <div className={styles.inputWrapper}>
              <input 
                className={styles.chatInput} 
                value={input} 
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask anything about careers..." 
              />
              <button className={styles.sendBtn} onClick={() => sendMessage()} disabled={!input.trim() || loading}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spinner-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        .spinner-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--accent);
          animation: spinner-pulse 1.4s infinite;
        }
      `}</style>
    </div>
  );
}
