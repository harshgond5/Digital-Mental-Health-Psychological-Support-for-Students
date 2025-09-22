// src/component/pages/MemoryJournal.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  getDocs,
  where,
  serverTimestamp,
} from "firebase/firestore";

export default function MemoryJournal() {
  const [user, setUser] = useState(null);
  const [story, setStory] = useState("");
  const [stories, setStories] = useState([]);
  const [picture, setPicture] = useState("");
  const [pictures, setPictures] = useState([]);

  // Track login and fetch data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchStories(currentUser.uid);
        await fetchPictures(currentUser.uid);
      } else {
        setStories([]);
        setPictures([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchStories = async (uid) => {
    const q = query(collection(db, "journal"), where("userId", "==", uid));
    const querySnap = await getDocs(q);
    setStories(querySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const fetchPictures = async (uid) => {
    const q = query(collection(db, "pictures"), where("userId", "==", uid));
    const querySnap = await getDocs(q);
    setPictures(querySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const addStory = async () => {
    if (!story.trim()) return alert("Please write something first.");
    if (!user) return alert("Please log in first.");

    if (stories.length >= 5) return alert("You can only save 5 memories.");

    try {
      const docRef = await addDoc(collection(db, "journal"), {
        story,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      setStories([...stories, { id: docRef.id, story, userId: user.uid }]);
      setStory("");
    } catch (err) {
      console.error(err);
      alert("Failed to add memory. Check your Firestore rules.");
    }
  };

  const deleteStory = async (id) => {
    try {
      await deleteDoc(doc(db, "journal", id));
      setStories(stories.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete memory.");
    }
  };

  const addPicture = async () => {
    if (!picture.trim()) return alert("Enter a picture URL");
    if (!user) return alert("Please log in first.");

    try {
      const docRef = await addDoc(collection(db, "pictures"), {
        url: picture,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      setPictures([...pictures, { id: docRef.id, url: picture, userId: user.uid }]);
      setPicture("");
    } catch (err) {
      console.error(err);
      alert("Failed to add picture.");
    }
  };

  const deletePicture = async (id) => {
    try {
      await deleteDoc(doc(db, "pictures", id));
      setPictures(pictures.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete picture.");
    }
  };

  if (!user) {
    return (
      <p className="p-6 mt-24 text-center text-gray-700">
        Please log in to view your journal.
      </p>
    );
  }

  return (
    <div
      className="min-h-screen p-6 mt-16 flex flex-col items-center"
      style={{
        background:
          "linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%), url('https://www.transparenttextures.com/patterns/cubes.png')",
        backgroundBlendMode: "overlay",
      }}
    >
      <h2 className="text-3xl font-bold text-white mb-10 drop-shadow-lg">
        My Stress Relief Journal
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-[90%]">
        {/* Memories */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/30 text-white p-6 rounded-2xl shadow-xl min-h-[70vh]">
          <h3 className="text-xl font-semibold mb-4">Your 5 Best Memories</h3>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Write your happy memory..."
            className="w-full border border-white/40 bg-white/20 text-white placeholder-white/70 rounded-lg p-3 mb-4"
          />
          <button
            onClick={addStory}
            className="bg-white/80 text-blue-700 px-4 py-2 rounded-lg shadow-md hover:bg-white hover:shadow-lg font-medium"
          >
            Add Memory
          </button>

          <ul className="mt-6 space-y-3">
            {stories.map((s) => (
              <li
                key={s.id}
                className="p-3 bg-white/30 rounded-lg shadow-md flex justify-between items-center"
              >
                <span>{s.story}</span>
                <button
                  onClick={() => deleteStory(s.id)}
                  className="text-red-300 hover:text-red-500"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Pictures */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/30 text-white p-6 rounded-2xl shadow-xl min-h-[70vh]">
          <h3 className="text-xl font-semibold mb-4">
            Pictures that make you smile 😊
          </h3>
          <input
            type="text"
            value={picture}
            onChange={(e) => setPicture(e.target.value)}
            placeholder="Enter image URL"
            className="w-full border border-white/40 bg-white/20 text-white placeholder-white/70 rounded-lg p-3 mb-4"
          />
          <button
            onClick={addPicture}
            className="bg-white/80 text-green-700 px-4 py-2 rounded-lg shadow-md hover:bg-white hover:shadow-lg font-medium"
          >
            Add Picture
          </button>

          <div className="grid grid-cols-2 gap-4 mt-6">
            {pictures.map((p) => (
              <div key={p.id} className="relative">
                <img
                  src={p.url}
                  alt="relief"
                  className="w-full h-40 object-cover rounded-lg shadow-md"
                />
                <button
                  onClick={() => deletePicture(p.id)}
                  className="absolute top-2 right-2 bg-red-500/80 text-white px-2 py-1 text-xs rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
