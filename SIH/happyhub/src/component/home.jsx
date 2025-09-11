import React, { useState } from "react";

export default function MindRefresh() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I’m here to help you relax. How are you feeling today?" }
  ]);
  const [input, setInput] = useState("");
  const [emotionInput, setEmotionInput] = useState(""); // New state for emotion

  // Toggle chatbot
  const handleToggleChat = () => setChatOpen(!chatOpen);

  // Send message in chatbot
  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { sender: "user", text: input }]);

    // Placeholder bot response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "That’s interesting! Take a deep breath and focus on it." }
      ]);
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
      const response = await fetch("http://localhost:8000/predict_emotion", { // Your backend endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: emotionInput })
      });

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        { sender: "bot", text: `Emotion Prediction: ${data.prediction}` }
      ]);

      setEmotionInput("");
      setChatOpen(true);
    } catch (error) {
      console.error("Prediction error:", error);
    }
  };

  return (
    <section className="w-screen min-h-[80vh] mt-20 flex flex-col justify-start items-center
      bg-gradient-to-b from-[#D0EAE7] to-[#B6D6C8] text-center px-6 md:px-12 relative">

      {/* Main Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-8 mb-6">
        Refresh Your Mind
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
        <input
          type="text"
          value={emotionInput}
          onChange={(e) => setEmotionInput(e.target.value)}
          placeholder="Type how you feel..."
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={handlePredictEmotion}
          className="px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
        >
          Predict Emotion
        </button>
      </div>

      {/* Chat Toggle Button */}
      <button
        onClick={handleToggleChat}
        className="mb-4 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md z-40 relative"
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
