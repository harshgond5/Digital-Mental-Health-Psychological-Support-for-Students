import React, { useState } from "react";

function EmotionPredictor() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const handlePredict = async () => {
    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    setResult(data.predicted_emotion);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Emotion Predictor</h2>
      <textarea
        rows="4"
        cols="50"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your text here..."
      />
      <br />
      <button onClick={handlePredict}>Predict Emotion</button>
      {result && (
        <h3 style={{ marginTop: "20px" }}>
          Predicted Emotion: {result}
        </h3>
      )}
    </div>
  );
}

export default EmotionPredictor;
