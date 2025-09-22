import React, { useState } from "react";

export default function MindRefresh() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I’m here to help you relax. How are you feeling today?" }
  ]);
  const [input, setInput] = useState("");
  const [emotionInput, setEmotionInput] = useState("");
  const [lastEmotion, setLastEmotion] = useState(null); // Remember last predicted emotion

  // Toggle chatbot
  const handleToggleChat = () => setChatOpen(!chatOpen);

  // Emotion-based supportive responses
  const emotionResponses = {
    happy: "That's awesome! Keep focusing on what motivates you 🎉",
    sad: "I’m sorry you feel this way. Try writing down 3 good things today 💙",
    angry: "Take a slow breath. Sometimes a short walk helps calm your mind 🌿",
    stressed: "Pause for a minute, stretch, and drink some water. You’re doing well 🌸",
    fear: "It’s okay to feel afraid. Break the problem into small steps 🪴",
    neutral: "Stay steady. Use this calm moment to plan your next step ✨"
  };

  // Rule-based human-like responses for general chat
  const humanResponses = [
    "I understand, tell me more about it.",
    "That sounds interesting! How does that make you feel?",
    "Hmm, I get you. Want to try a small relaxation exercise?",
    "Thanks for sharing! Remember to take a deep breath 😊",
    "I see. Let's think of something positive together!"
  ];

  // Send message in chatbot
  const handleSend = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { sender: "user", text: input }]);

    // Friendly human-like bot response
    setTimeout(() => {
      let response = "";

      if (lastEmotion) {
        // If emotion known, combine with friendly advice
        response = `Since you're feeling ${lastEmotion}, ${emotionResponses[lastEmotion]}`;
      } else {
        // Random human-like response
        const idx = Math.floor(Math.random() * humanResponses.length);
        response = humanResponses[idx];
      }

      setMessages(prev => [...prev, { sender: "bot", text: response }]);
    }, 500);

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // Send text for emotion prediction
  const handlePredictEmotion = async () => {
    if (!emotionInput.trim()) return;

    try {
      const response = await fetch("http://localhost:8000/predict_emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: emotionInput })
      });

      const data = await response.json();
      const emotion = data.emotion || data.predicted_emotion;

      setLastEmotion(emotion); // Remember last emotion

      // Add prediction message
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: `Emotion Prediction: ${emotion}` },
        { sender: "bot", text: emotionResponses[emotion] || "I’m here for you 💜" }
      ]);

      setEmotionInput("");
      setChatOpen(true); // open chat when prediction arrives
    } catch (error) {
      console.error("Prediction error:", error);
    }
  };

  return (
    <section className="w-screen min-h-[80vh] mt-20 flex flex-col justify-start items-center
      bg-gradient-to-b from-[#D0EAE7] to-[#B6D6C8] text-center px-6 md:px-12 relative">

      {/* Main Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-8 mb-6">
        Welcome Users!!
      </h1>

      {/* Prompt Paragraph */}
      <p className="text-2xl md:text-3xl text-gray-700 leading-relaxed mb-8 max-w-3xl">
        Think of a place that makes you feel completely at peace — it could be a beach, forest, or your cozy room.  
        Visualize the sounds, colors, and feelings around you. Let your mind settle there for a few moments.
      </p>

      {/* Interactive Prompts */}
      <div className="flex flex-col md:flex-row gap-6 justify-center mb-8">
        <button className="bg-white/20 hover:bg-white/30 text-gray-800 px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all font-medium">
          Visualize Your Happy Place
        </button>
        <button className="bg-white/20 hover:bg-white/30 text-gray-800 px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all font-medium">
          Recall a Loving Moment
        </button>
        <button className="bg-white/20 hover:bg-white/30 text-gray-800 px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all font-medium">
          Focus on Gentle Breathing
        </button>
      </div>

      {/* Emotion Prediction Input */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        
        <button
          onClick={handlePredictEmotion}
          className="px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
        >
          Let's Evaluate Your Mood
        </button>
      </div>

      {/* Show last prediction result */}
      {lastEmotion && (
        <h3 className="text-xl text-gray-800 mt-4">
          Last Predicted Emotion: <span className="font-semibold">{lastEmotion}</span>
        </h3>
      )}

      {/* Chat Toggle Button */}
      <button
        onClick={handleToggleChat}
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md z-40 relative"
      >
        {chatOpen ? "Close Chat" : "Open Chat"}
      </button>

      {/* Floating Chatbox */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-[300px] md:w-[400px] bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-4 flex flex-col gap-4 z-50">
          <div className="h-60 overflow-y-auto flex flex-col gap-2 mb-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`px-4 py-2 rounded-lg max-w-[80%] ${
                  msg.sender === "bot" ? "bg-gray-200 self-start" : "bg-blue-200 self-end"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              onClick={handleSend}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </section>
  );
}


