import cv2
from deepface import DeepFace
from flask import Flask, render_template, Response, jsonify, redirect, url_for
import time
import sqlite3
from datetime import datetime

app = Flask(__name__)

# ----------------- Database Setup -----------------
DB_NAME = "emotions.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS emotions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            emotion TEXT
        )
    ''')
    conn.commit()
    conn.close()

def save_emotion_to_db(emotion):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("INSERT INTO emotions (timestamp, emotion) VALUES (?, ?)",
              (datetime.now().strftime("%Y-%m-%d %H:%M:%S"), emotion))
    conn.commit()
    conn.close()
    print(f"Saved emotion: {emotion}")  # Debug print

def get_emotion_history(limit=10):
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute("SELECT timestamp, emotion FROM emotions ORDER BY id DESC LIMIT ?", (limit,))
    data = c.fetchall()
    conn.close()
    return data

# ----------------- Global Variables -----------------
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
cap = None
emotion_detected = None
static_frame = None
detection_done = False
start_time = None

# ----------------- Camera Functions -----------------
def start_camera():
    global cap, emotion_detected, static_frame, detection_done, start_time
    if cap and cap.isOpened():
        return  # Already running

    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        cap = cv2.VideoCapture(1)
    if not cap.isOpened():
        print("Error: Cannot open camera.")
        cap = None
        return

    emotion_detected = None
    static_frame = None
    detection_done = False
    start_time = None

def stop_camera():
    global cap
    if cap and cap.isOpened():
        cap.release()
    cap = None

# ----------------- Video Frame Generator -----------------
def generate_frames():
    global cap, emotion_detected, static_frame, detection_done, start_time

    detection_start_time = None  # for 2-second delay

    while True:
        if cap is None or not cap.isOpened():
            time.sleep(0.1)
            continue

        success, frame = cap.read()
        if not success:
            continue

        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        rgb_frame = cv2.cvtColor(gray_frame, cv2.COLOR_GRAY2RGB)

        # Initialize detection_start_time on first frame
        if detection_start_time is None:
            detection_start_time = time.time()

        frame_to_show = frame

        # Only detect emotion if not already done AND 2 seconds passed
        if not detection_done and time.time() - detection_start_time >= 2:
            faces = face_cascade.detectMultiScale(gray_frame, 1.1, 5)
            if len(faces) > 0:
                x, y, w, h = faces[0]  # capture first face only
                face_roi = rgb_frame[y:y+h, x:x+w]
                try:
                    result = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=False)
                    emotion_detected = result[0]['dominant_emotion']
                    save_emotion_to_db(emotion_detected)

                    # Draw rectangle and emotion text
                    cv2.rectangle(frame, (x, y), (x+w, y+h), (0,0,255), 2)
                    cv2.putText(frame, emotion_detected, (x, y-10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,0,255), 2)

                    # Save static frame and stop further detection
                    static_frame = frame.copy()
                    detection_done = True
                    start_time = time.time()
                    frame_to_show = static_frame
                except Exception as e:
                    print("Error analyzing face:", e)

        # After detection is done, keep showing the static frame
        elif detection_done:
            frame_to_show = static_frame if static_frame is not None else frame

        # Encode frame for MJPEG streaming
        ret, buffer = cv2.imencode('.jpg', frame_to_show)
        if not ret:
            continue

        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')


   

# ----------------- Flask Routes -----------------
@app.route('/')
def index():
    return render_template('index.html', emotion=emotion_detected or "Waiting...")

@app.route('/video')
def video():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/start')
def start():
    start_camera()
    return redirect(url_for('index'))

@app.route('/recapture')
def recapture():
    stop_camera()
    start_camera()
    return redirect(url_for('index'))

@app.route('/get_emotion')
def get_emotion():
    return jsonify({'emotion': emotion_detected or "Waiting..."})

@app.route('/history')
def history():
    data = get_emotion_history(limit=10)
    return render_template('history.html', history=data)

# ----------------- Main -----------------
if __name__ == '__main__':
    init_db()
    app.run(debug=False, threaded=True)
