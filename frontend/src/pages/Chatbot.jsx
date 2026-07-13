import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Sparkles, BookOpen, Terminal, Brain, Trash2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { chatbotAPI } from '../services/api';

// Reusing same markdown formatter for chatbot replies
const renderMarkdown = (text) => {
  if (!text) return '';
  let html = text;

  // Escape HTML entities to prevent XSS but keep basic tags we generate
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Match headers (###)
  html = html.replace(/^### (.*$)/gim, '<h3 style="font-size:1.15rem; margin: 16px 0 8px 0; color:#fff; font-family:var(--font-display);">$1</h3>');
  html = html.replace(/^#### (.*$)/gim, '<h4 style="font-size:1.0rem; margin: 12px 0 6px 0; color:#8b5cf6;">$1</h4>');

  // Match Code Blocks
  html = html.replace(/```(javascript|html|css|jsx|python)?\n([\s\S]*?)\n```/gim, (match, lang, code) => {
    return `<pre style="background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.06); padding:12px; border-radius:8px; overflow-x:auto; margin: 12px 0; font-family:'Courier New', monospace; font-size:0.85rem; color:#e4e4e7;"><code style="white-space:pre-wrap;">${code.trim()}</code></pre>`;
  });

  // Match Inline Code
  html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.08); padding:2px 6px; border-radius:4px; font-family:monospace; color:#f43f5e; font-size:0.85rem;">$1</code>');

  // Match Lists
  html = html.replace(/^\- (.*$)/gim, '<li style="margin-left: 16px; margin-bottom: 6px; color:var(--text-muted); font-size:0.9rem;">$1</li>');

  // Match bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#fff;">$1</strong>');

  // Block Math: \[\sum ...\]
  html = html.replace(/\\\[([\s\S]*?)\\\]/g, '<div style="background:rgba(139,92,246,0.05); padding:12px; border-radius:8px; margin:12px 0; text-align:center; font-family:serif; font-size:1rem; color:#c084fc;">$1</div>');
  // Inline Math: \(E=mc^2\)
  html = html.replace(/\\\((.*?)\\\)/g, '<span style="font-family:serif; font-style:italic; color:#c084fc; padding: 0 4px;">$1</span>');

  // Format linebreaks (double breaks to paragraph, single to br)
  html = html.replace(/\n\n/g, '</p><p style="margin-bottom:12px; line-height:1.5; color:var(--text-muted); font-size:0.92rem;">');
  
  return `<p style="margin-bottom:12px; line-height:1.5; color:var(--text-muted); font-size:0.92rem;">${html}</p>`;
};

const suggestedPrompts = [
  { text: 'Explain React Hooks & State', icon: <Sparkles size={14} /> },
  { text: 'How do JS Promises work?', icon: <Terminal size={14} /> },
  { text: 'Tips for GATE CS preparation', icon: <Terminal size={14} /> },
  { text: 'Formula list for JEE Calculus', icon: <BookOpen size={14} /> },
  { text: 'UPSC Indian Polity GS facts', icon: <Brain size={14} /> }
];

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `### Hello! I am your AI Study Companion. 🎓🤖

I am here to guide you on your educational journey. You can ask me anything about:
- **React & Front-End Design**
- **JavaScript & Backend Programming**
- **Python & Data Science**
- **AI & Machine Learning Concepts**
- **Learning techniques and study tips**

How can I help you learn today? Feel free to ask a specific programming question!`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const userMsg = textToSend.trim();
    if (!userMsg) return;

    // Add user message to state
    const newUserMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMsg
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setLoading(true);

    try {
      // Package message history
      const historyPayload = messages.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const data = await chatbotAPI.sendMessage(userMsg, historyPayload);
      
      const newAssistantMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply
      };
      
      setMessages(prev => [...prev, newAssistantMessage]);
    } catch (error) {
      console.error('Error sending message to chatbot API', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: '⚠️ **System Error**: I encountered an error communicating with my neural core. Please try asking again in a few moments.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear this study session logs?')) {
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: `### Chat History Reset. 🎓🤖\n\nHow can I help you learn today? Feel free to ask a specific programming question!`
        }
      ]);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', height: 'calc(100vh - 70px)', overflow: 'hidden' }}>
      
      {/* Sidebar - Person details & recommendations */}
      <div 
        style={{ 
          background: 'rgba(20, 20, 25, 0.4)', 
          backdropFilter: 'blur(10px)', 
          borderRight: '1px solid var(--card-border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          height: '100%'
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ background: 'var(--primary-gradient)', padding: '6px', borderRadius: '8px', display: 'flex' }}>
              <Bot size={18} color="white" />
            </div>
            <h3 style={{ fontSize: '1.05rem' }}>AI Study Core</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.5', marginBottom: '24px' }}>
            An interactive educational model optimized to explain software design, algorithmic concepts, and active recall.
          </p>

          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'white', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '12px' }}>
            Suggested Prompts
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt.text)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  transition: 'var(--transition-smooth)'
                }}
                className="glass-panel-hover"
              >
                <div style={{ color: 'var(--accent-color)' }}>
                  {prompt.icon}
                </div>
                <span>{prompt.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Clear Chats Footer */}
        <button
          onClick={handleClearChat}
          style={{
            background: 'none',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            color: '#ef4444',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '0.8rem',
            transition: 'var(--transition-smooth)'
          }}
          className="glass-panel-hover"
        >
          <Trash2 size={14} />
          Reset Chat Logs
        </button>
      </div>

      {/* Main Messaging Window */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* Messages Stream area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '30px 40px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              
              return (
                <div 
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    animation: 'fadeIn 0.3s ease-out'
                  }}
                >
                  <div 
                    style={{
                      maxWidth: '85%',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      flexDirection: isUser ? 'row-reverse' : 'row'
                    }}
                  >
                    {/* Message Icon */}
                    <div 
                      style={{
                        background: isUser ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)',
                        border: isUser ? 'none' : '1px solid var(--card-border)',
                        padding: '8px',
                        borderRadius: '50%',
                        color: isUser ? 'white' : 'var(--accent-color)',
                        flexShrink: 0
                      }}
                    >
                      <Bot size={16} />
                    </div>

                    {/* Chat Bubble container */}
                    <div 
                      style={{
                        background: isUser ? 'rgba(99, 102, 241, 0.15)' : 'rgba(20, 20, 25, 0.6)',
                        border: '1px solid',
                        borderColor: isUser ? 'rgba(99, 102, 241, 0.3)' : 'var(--card-border)',
                        padding: '16px 20px',
                        borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                        boxShadow: isUser ? '0 4px 20px rgba(99, 102, 241, 0.05)' : '0 4px 20px rgba(0,0,0,0.15)',
                        backdropFilter: 'blur(8px)'
                      }}
                    >
                      {isUser ? (
                        <p style={{ fontSize: '0.92rem', lineHeight: '1.5', color: '#fff', whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                      ) : (
                        <div 
                          className="chat-reply-markdown" 
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator spinner */}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', padding: '8px', borderRadius: '50%', color: 'var(--accent-color)' }}>
                    <Bot size={16} />
                  </div>
                  <div className="bounce-dots" style={{ background: 'rgba(20, 20, 25, 0.6)', border: '1px solid var(--card-border)', padding: '12px 20px', borderRadius: '4px 16px 16px 16px', display: 'flex', gap: '6px', alignItems: 'center', height: '38px' }}>
                    <span style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%' }} />
                    <span style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%' }} />
                    <span style={{ width: '6px', height: '6px', background: 'white', borderRadius: '50%' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar Section */}
        <div style={{ borderTop: '1px solid var(--card-border)', padding: '24px 40px', background: 'rgba(9, 9, 11, 0.5)' }}>
          <form onSubmit={handleFormSubmit} style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Ask a question about programming, machine learning layers, or React structures..."
              className="form-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              style={{ flex: 1 }}
            />
            <button 
              type="submit" 
              className="gradient-btn" 
              disabled={loading || !input.trim()}
              style={{ padding: '0 20px' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default Chatbot;
