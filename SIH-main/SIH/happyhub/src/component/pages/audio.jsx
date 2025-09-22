import React, { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

export default function StressReliefAudios() {
  const [user, setUser] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audios, setAudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => setUser(currentUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAudios = async () => {
      const q = query(collection(db, "stressAudios"), orderBy("createdAt", "desc"));
      const querySnap = await getDocs(q);
      setAudios(querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchAudios();
  }, []);

  const handleFileChange = (file) => {
    if (file) setAudioFile(file);
  };

  const handleUpload = async () => {
    if (!user) return alert("Please log in first.");
    if (!audioFile) return alert("Select an audio file first.");

    try {
      const storagePath = `stressAudios/${user.uid}/${Date.now()}-${audioFile.name}`;
      const fileRef = ref(storage, storagePath);
      const uploadTask = uploadBytesResumable(fileRef, audioFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(prog);
        },
        (error) => {
          console.error("Upload error:", error);
          alert("Upload failed ❌");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

          await addDoc(collection(db, "stressAudios"), {
            userId: user.uid,
            userEmail: user.email,
            audioURL: downloadURL,
            storagePath,
            createdAt: serverTimestamp(),
          });

          alert("Audio uploaded successfully ✅");
          setAudioFile(null);
          setProgress(0);
          const q = query(collection(db, "stressAudios"), orderBy("createdAt", "desc"));
          const querySnap = await getDocs(q);
          setAudios(querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      );
    } catch (error) {
      console.error("Unexpected upload error:", error);
    }
  };

  const handleDelete = async (audio) => {
    if (!user || user.uid !== audio.userId) return alert("You can only delete your own audio.");

    try {
      const fileRef = ref(storage, audio.storagePath);
      await deleteObject(fileRef);
      await deleteDoc(doc(db, "stressAudios", audio.id));
      setAudios(audios.filter(a => a.id !== audio.id));
      alert("Audio deleted ✅");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete audio.");
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-16 bg-gradient-to-b from-purple-50 via-pink-50 to-yellow-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-purple-800">
          Connect & Share Your Stress Relief Tips 🎧
        </h2>

        {/* Upload Section */}
        {user ? (
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-10 text-center hover:shadow-2xl transition">
            <h3 className="text-lg font-semibold mb-4 text-purple-700">Share Your Audio</h3>

            <label
              htmlFor="audio-upload"
              className="block border-2 border-dashed border-purple-300 rounded-2xl p-6 cursor-pointer hover:border-purple-500 transition"
              onDrop={(e) => {
                e.preventDefault();
                handleFileChange(e.dataTransfer.files[0]);
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              {audioFile ? (
                <p className="text-green-600 font-medium">Selected: {audioFile.name}</p>
              ) : (
                <p className="text-purple-400">Drag & Drop or Click to select audio</p>
              )}
              <input
                id="audio-upload"
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
            </label>

            {progress > 0 && (
              <div className="w-full bg-purple-100 rounded-full h-3 mt-4">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}

            <button
              onClick={handleUpload}
              className="mt-4 bg-purple-700 text-white px-6 py-2 rounded-2xl hover:bg-purple-800 transition font-medium"
            >
              Upload
            </button>
          </div>
        ) : (
          <div className="text-center bg-white p-6 rounded-2xl shadow-lg">
            <p className="text-purple-700 font-medium">Please log in to share your audio tips.</p>
          </div>
        )}

        {/* Audio List */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold mb-4 text-purple-800">Listen to Others</h3>
          {loading ? (
            <p className="text-purple-600">Loading...</p>
          ) : audios.length > 0 ? (
            audios.map((audio) => (
              <div
                key={audio.id}
                className="bg-white p-6 rounded-2xl shadow-md space-y-3 flex flex-col hover:shadow-lg transition"
              >
                <p className="text-sm font-medium text-purple-600">{audio.userEmail}</p>
                <audio controls src={audio.audioURL} className="w-full rounded" />
                {user && user.uid === audio.userId && (
                  <button
                    onClick={() => handleDelete(audio)}
                    className="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition w-max"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-purple-500">No audios shared yet. Be the first to connect!</p>
          )}
        </div>
      </div>
    </div>
  );
}
