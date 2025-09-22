import React, { useState } from "react";

function EmotionPredictor() {
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState(null);

  const handlePredict = async () => {
    try {
      const response = await fetch("http://localhost:8000/predict_emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Debugging
      setEmotion(data.emotion); // ✅ matches new backend key
    } catch (error) {
      console.error("Error predicting emotion:", error);
    }
  };

  
}

export default EmotionPredictor;
