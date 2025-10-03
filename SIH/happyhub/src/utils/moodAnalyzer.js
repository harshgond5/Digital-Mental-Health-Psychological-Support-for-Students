// A simple keyword-based mood analyzer
const keywords = {
  // Critical (Score 9-10)
  awful: 10, terrible: 10, horrible: 10, hate: 10, depressed: 10, hopeless: 10,
  // Moderate (Score 4-8)
  sad: 6, stressed: 7, anxious: 7, worried: 6, bad: 5, lonely: 6, okay: 4, fine: 4,
  // Normal (Score 1-3)
  happy: 2, great: 1, amazing: 1, wonderful: 1, excited: 2, good: 3, calm: 3, relaxed: 2,
};

const responses = {
  critical: "I'm really sorry to hear that you're feeling this way. It sounds incredibly tough. Please know that it's okay to seek help.",
  moderate: "It sounds like you're going through a difficult time. Remember to be kind to yourself. Is there anything specific on your mind?",
  normal: "That's great to hear! I'm glad you're feeling positive today. Keep that energy going!",
  default: "Thank you for sharing. Every feeling is valid. Let's talk more if you'd like.",
};

export const analyzeMood = (text) => {
  const lowerText = text.toLowerCase();
  let totalScore = 5; // Start with a neutral-moderate score
  let wordsFound = 0;

  for (const word in keywords) {
    if (lowerText.includes(word)) {
      totalScore = keywords[word]; // For simplicity, take the score of the most impactful word found
      wordsFound++;
      break; // Stop after finding the first major keyword
    }
  }

  // Determine category and bot response
  let mood = 'Moderate';
  let botResponse = responses.default;

  if (totalScore >= 9) {
    mood = 'Critical';
    botResponse = responses.critical;
  } else if (totalScore <= 3) {
    mood = 'Normal';
    botResponse = responses.normal;
  } else { // Handles scores 4-8
    mood = 'Moderate';
    botResponse = responses.moderate;
  }

  return {
    mood,
    score: totalScore,
    botResponse,
  };
};