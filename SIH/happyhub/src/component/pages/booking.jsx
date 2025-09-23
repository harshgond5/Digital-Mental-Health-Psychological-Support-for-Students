import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, updateDoc, arrayRemove, addDoc } from "firebase/firestore";

export default function CenteredProfessionalBookCounselor() {
  const [selectedDate, setSelectedDate] = useState("");
  const [internalAvailability, setInternalAvailability] = useState([]);
  const [externalAvailability, setExternalAvailability] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAvailability = async (date) => {
    if (!date) return;
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "availability"));
      const internal = [];
      const external = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.date === date && data.slots.length > 0) {
          if (data.type === "internal") internal.push({ ...data, id: docSnap.id });
          else if (data.type === "external") external.push({ ...data, id: docSnap.id });
        }
      });

      setInternalAvailability(internal);
      setExternalAvailability(external);
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
    setLoading(false);
  };

  const bookSlot = async (counselorId, slot, docId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Please login to book a slot!");
        return;
      }

      await updateDoc(doc(db, "availability", docId), { slots: arrayRemove(slot) });
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        counselorId,
        date: selectedDate,
        slot,
      });

      alert(`Booked ${slot} with ${counselorId}`);
      fetchAvailability(selectedDate);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchAvailability(selectedDate); }, [selectedDate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex justify-center items-center relative">
      <div className="w-full max-w-6xl p-8 rounded-3xl bg-white shadow-2xl flex flex-col items-center space-y-10">
        
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Book a Counselor</h1>
          <p className="text-gray-600 mb-4">Professional support for your mental health</p>
          <div className="flex flex-col md:flex-row justify-center gap-6 text-blue-700 font-medium">
            <p>24/7 Helpline: <a href="tel:1800123456" className="underline">1800-123-456</a></p>
            <p>Free Counseling Resources: <a href="https://www.mhrd.gov.in" target="_blank" className="underline">Click Here</a></p>
          </div>
        </header>

        <div className="w-full max-w-lg">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-4 rounded-xl shadow-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
          />
        </div>

        {/* Internal Counselors */}
        <section className="w-full">
          <h2 className="text-3xl font-semibold text-center mb-6">Internal Counselors</h2>
          {loading ? (
            <p className="text-center text-gray-500">Loading slots...</p>
          ) : internalAvailability.length === 0 ? (
            <p className="text-center text-gray-500">No slots available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {internalAvailability.map((c) => (
                <div key={c.id} className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
                  <h3 className="font-bold text-xl mb-1">{c.counselorName}</h3> {/* ✅ Display Admin username */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    {c.slots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => bookSlot(c.counselorId, slot, c.id)}
                        className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition duration-200"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* External Counselors */}
        <section className="w-full">
          <h2 className="text-3xl font-semibold text-center mb-6">External Expert Counselors</h2>
          {loading ? (
            <p className="text-center text-gray-500">Loading slots...</p>
          ) : externalAvailability.length === 0 ? (
            <p className="text-center text-gray-500">No slots available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {externalAvailability.map((c) => (
                <div key={c.id} className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
                  <h3 className="font-bold text-xl mb-1">{c.counselorName || c.counselorId}</h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {c.slots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => bookSlot(c.counselorId, slot, c.id)}
                        className="px-5 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition duration-200"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      <footer className="absolute bottom-[10%] text-gray-500 text-sm text-center w-full">
        &copy; 2025 Counseling System. All rights reserved.
      </footer>
    </div>
  );
}
