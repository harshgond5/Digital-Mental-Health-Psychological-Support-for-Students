import cv2
from deepface import DeepFace
import sqlite3
import time

# Load face cascade classifier
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
cap = cv2.VideoCapture(0)

emotion_detected = None
detection_done = False  # Flag to track first detection

while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    rgb_frame = cv2.cvtColor(gray_frame, cv2.COLOR_GRAY2RGB)

    faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    for (x, y, w, h) in faces:
        face_roi = rgb_frame[y:y + h, x:x + w]

        try:
            result = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=False)
            emotion_detected = result[0]['dominant_emotion']

            # Draw rectangle and label
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 0, 255), 2)
            cv2.putText(frame, emotion_detected, (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 0, 255), 2)

            print("Captured Emotion:", emotion_detected)
            detection_done = True  # First emotion detected
            break
        except Exception as e:
            print("Error:", e)

    # Show video feed
    cv2.imshow("Real-time Emotion Detection", frame)

    # Stop live capture if 'q' pressed or emotion detected
    if (cv2.waitKey(1) & 0xFF == ord('q')) or detection_done:
        break

# Wait 15 seconds to show the detected emotion
if detection_done:
    print("Showing captured emotion for 15 seconds...")
    cv2.waitKey(15000)  # Wait in milliseconds

cap.release()
cv2.destroyAllWindows()

# Save emotion to DB
if emotion_detected:
    conn = sqlite3.connect("wellness.db")
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS emotions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        emotion TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    """)

    cursor.execute("INSERT INTO emotions (emotion) VALUES (?)", (emotion_detected,))
    conn.commit()
    conn.close()

    print("✅ Emotion saved to wellness.db:", emotion_detected)
else:
    print("⚠️ No emotion detected.")
