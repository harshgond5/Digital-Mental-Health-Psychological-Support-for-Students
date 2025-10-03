import React, { useState, useEffect, useRef } from 'react';
import 'react-chatbot-kit/build/main.css';
import { analyzeMood } from '../utils/moodAnalyzer'; // We'll simplify this to one function
import './Chatbot.css';

const ChatbotComponent = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hello! How are you feeling today?" },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null); // Ref for the messages container

  // Auto-scroll to the bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // FIXED: No space in function name
  const handleUserMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = { type: 'user', text: inputValue };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      // Get mood and response from the simplified utility
      const { mood, score, botResponse } = analyzeMood(inputValue);
      const moodReport = `(Mood: ${mood}, Score: ${score}/10)`;
      const finalBotResponse = { type: 'bot', text: `${botResponse} ${moodReport}` };
      
      setMessages([...newMessages, finalBotResponse]);
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleUserMessage(); // FIXED: Call the corrected function
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>Mood Companion</h2>
        {/* The close button now uses a CSS class */}
        <button onClick={onClose} className="chatbot-close-btn">×</button>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.text}
          </div>
        ))}
        {/* Improved typing indicator */}
        {isTyping && (
          <div className="message bot typing-indicator">
            <span></span><span></span><span></span>
          </div>
        )}
        {/* Empty div to help with auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbot-input-area">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={isTyping}
        />
        <button onClick={handleUserMessage} disabled={isTyping || !inputValue.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatbotComponent;