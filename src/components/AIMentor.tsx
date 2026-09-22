'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './AIMentor.module.css';

interface Message {
  role: 'mentor' | 'user';
  text: string;
}

const MENTOR_RESPONSES: { [key: string]: string } = {
  default: "That's a great question. Let me help you think through it. What aspect would you like to explore first?",
  prompt: "For better prompts, remember the RCTF framework: Role, Context, Task, Format. Which element do you think is missing from your current prompt?",
  what: "Let me break this down simply. Think about it from a practical perspective — how would you explain this concept to a friend who knows nothing about AI?",
  help: "Of course! I'm here to guide you, not just give answers. Tell me what you're working on and I'll help you figure it out step by step.",
  stuck: "That's completely normal — everyone gets stuck. Let's take a step back. What do you already understand about this topic? Start from there.",
  wrong: "Don't worry about getting it wrong — that's how learning works. The important thing is understanding *why* the correct answer is right. Want me to explain?",
  how: "Great question! Let me give you a hint rather than the answer directly — that way it sticks better. Think about what the end goal is, then work backwards.",
  error: "Errors are informative! They tell you exactly what went wrong. What does the error message say?",
  good: "Excellent work! You're thinking like an AI professional already. Keep this approach as you tackle the next lesson.",
};

function getMentorResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(MENTOR_RESPONSES)) {
    if (key !== 'default' && lower.includes(key)) return response;
  }
  return MENTOR_RESPONSES.default;
}

export default function AIMentor() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'mentor', text: "Hello! I'm your AI Mentor. I'm here to help you understand lessons, improve your prompts, and guide you through exercises. What are you working on?" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  function handleSend() {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', text: input.trim() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const response = getMentorResponse(userMsg.text);
      setMessages(m => [...m, { role: 'mentor', text: response }]);
      setTyping(false);
    }, 1000 + Math.random() * 800);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={styles.fab}
        aria-label="Open AI Mentor"
        id="ai-mentor-btn"
      >
        {open ? '✕' : 'AI MENTOR'}
      </button>

      {/* Chat panel */}
      {open && (
        <div className={styles.panel} role="dialog" aria-label="AI Mentor Chat">
          <div className={styles.panelHeader}>
            <div className={styles.mentorAvatar}>AI</div>
            <div>
              <p className={styles.mentorName}>AI Mentor</p>
              <p className={styles.mentorStatus}>● Online</p>
            </div>
            <button onClick={() => setOpen(false)} className={styles.closeBtn} aria-label="Close">✕</button>
          </div>

          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.msg} ${msg.role === 'user' ? styles.msgUser : styles.msgMentor}`}>
                <p>{msg.text}</p>
              </div>
            ))}
            {typing && (
              <div className={`${styles.msg} ${styles.msgMentor} ${styles.typing}`}>
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask your mentor..."
              className={styles.chatInput}
              id="mentor-chat-input"
              aria-label="Message to AI Mentor"
            />
            <button onClick={handleSend} className={styles.sendBtn} disabled={!input.trim()} id="mentor-send-btn">→</button>
          </div>
        </div>
      )}
    </>
  );
}
