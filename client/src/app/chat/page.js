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

// Quick suggestions shown in the sidebar to help students get started

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

    try {
      const res = await api.chat(newMessages);
      setMessages([...newMessages, { role: 'assistant', content: res.data.response }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again! 😊' }]);
    }
    setLoading(false);
  };

  return (
    <div style={S.page}>
      <div style={S.container}>
        {/* Sidebar */}
        <div style={S.sidebar}>
          <h3 style={{fontSize:'0.9rem',fontWeight:600,marginBottom:16}}>💡 Try asking:</h3>
          {suggestions.map((s, i) => (
            <button key={i} style={S.suggestion} onClick={() => sendMessage(s)}>
              {s}
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div style={S.chatArea}>
          <div style={S.chatHeader}>
            <span style={{fontSize:'1.3rem'}}>🤖</span>
            <div>
              <h2 style={{fontSize:'1rem',fontWeight:600}}>AI Career Mentor</h2>
              <span className="text-xs" style={{color:'var(--success)'}}>● Online</span>
            </div>
          </div>

          <div ref={chatRef} style={S.messages}>
            {messages.length === 0 && (
              <div style={S.empty}>
                <span style={{fontSize:'3rem'}}>🎯</span>
                <h3 style={{marginTop:16}}>Hi! I'm your AI Career Mentor</h3>
                <p className="text-sm" style={{color:'var(--text-secondary)',maxWidth:400}}>
                  Ask me anything about careers, exams, salaries, or your future. I'm here to help! 😊
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{...S.msgRow, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'}}>
                {msg.role === 'assistant' && <div style={S.avatar}>🤖</div>}
                <div style={{...S.bubble, ...(msg.role === 'user' ? S.userBubble : S.aiBubble)}}>
                  {msg.content.replace(/\*\*/g,'').replace(/\*/g,'').split('\n').filter(l => l.trim()).map((line, j) => {
                    const numbered = line.match(/^(\d+)\.\s*(.+?)(\s*[-–—]\s*)(.+)$/);
                    if (numbered) {
                      return (
                        <p key={j} style={{marginTop: j > 0 ? 10 : 0, lineHeight: 1.7}}>
                          <span style={{color:'var(--accent)',fontWeight:700}}>{numbered[1]}.</span>{' '}
                          <span style={{fontWeight:700,color:'var(--text-primary)'}}>{numbered[2].trim()}</span>
                          <span style={{color:'var(--text-secondary)'}}> — {numbered[4].trim()}</span>
                        </p>
                      );
                    }
                    return <p key={j} style={{marginTop: j > 0 ? 10 : 0, lineHeight: 1.7}}>{line}</p>;
                  })}
                </div>
              </div>
            ))}
            {loading && (
              <div style={S.msgRow}>
                <div style={S.avatar}>🤖</div>
                <div style={{...S.bubble, ...S.aiBubble}}>
                  <div style={S.typing}><span /><span /><span /></div>
                </div>
              </div>
            )}
          </div>

          <div style={S.inputArea}>
            <input style={S.chatInput} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask anything about careers..." />
            <button style={S.sendBtn} onClick={() => sendMessage()} disabled={!input.trim() || loading}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { height: 'calc(100vh - 64px)', display: 'flex', overflow: 'hidden' },
  container: { display: 'flex', width: '100%', maxWidth: 1100, margin: '0 auto' },
  sidebar: { width: 260, padding: '24px 16px', borderRight: '1px solid var(--border)', overflowY: 'auto', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 },
  suggestion: { textAlign: 'left', padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit', lineHeight: 1.4 },
  chatArea: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  chatHeader: { display: 'flex', alignItems: 'center', gap: 12, padding: '16px 24px', borderBottom: '1px solid var(--border)' },
  messages: { flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 },
  empty: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
  msgRow: { display: 'flex', gap: 10, alignItems: 'flex-start' },
  avatar: { width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-gradient-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 },
  bubble: { maxWidth: '75%', padding: '12px 16px', borderRadius: 'var(--radius-lg)', fontSize: '0.9rem', lineHeight: 1.6, wordBreak: 'break-word' },
  userBubble: { background: 'var(--accent)', color: 'white', borderBottomRightRadius: 4 },
  aiBubble: { background: 'var(--bg-tertiary)', borderBottomLeftRadius: 4 },
  inputArea: { display: 'flex', gap: 8, padding: '16px 24px', borderTop: '1px solid var(--border)' },
  chatInput: { flex: 1, padding: '12px 16px', background: 'var(--bg-tertiary)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-full)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', transition: 'border 0.2s' },
  sendBtn: { width: 44, height: 44, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none', transition: 'transform 0.2s' },
  typing: { display: 'flex', gap: 4, padding: '4px 0' },
};

// Add typing animation CSS dynamically
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    div[style*="typing"] span {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--text-tertiary); display: inline-block;
      animation: pulse 1.4s infinite;
    }
    div[style*="typing"] span:nth-child(2) { animation-delay: 0.2s; }
    div[style*="typing"] span:nth-child(3) { animation-delay: 0.4s; }
  `;
  document.head.appendChild(style);
}
