import React, { useState } from "react";
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function ProfessionalAdminAvailability() {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [slotInterval, setSlotInterval] = useState(30); // in minutes
  const [slots, setSlots] = useState([]);

  // Generate slots from start to end time
  const generateSlots = () => {
    if (!startTime || !endTime) return alert("Select start and end time");

    const slotsArray = [];
    let [startH, startM] = startTime.split(":").map(Number);
    let [endH, endM] = endTime.split(":").map(Number);

    let current = new Date();
    current.setHours(startH, startM, 0, 0);

    const end = new Date();
    end.setHours(endH, endM, 0, 0);

    while (current <= end) {
      let hh = current.getHours().toString().padStart(2, "0");
      let mm = current.getMinutes().toString().padStart(2, "0");
      slotsArray.push(`${hh}:${mm}`);
      current.setMinutes(current.getMinutes() + slotInterval);
    }

    setSlots(slotsArray);
  };

  const saveAvailability = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return alert("Login as Admin/Counselor first");

      const counselorId = user.uid;

      if (!date || slots.length === 0)
        return alert("Select date and generate slots");

      await setDoc(doc(db, "availability", `${counselorId}_${date}`), {
        counselorId,
        date,
        slots,
        type: "internal", // admin sets internal by default
      });

      alert("Availability saved successfully!");
      setDate("");
      setStartTime("");
      setEndTime("");
      setSlots([]);
    } catch (error) {
      console.error("Error saving availability:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex justify-center items-center relative">
      <div className="w-full max-w-xl bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center space-y-6">
        <h2 className="text-3xl font-bold mb-2 text-center">Set Counselor Availability</h2>
        <p className="text-gray-600 text-center mb-6">
          Select date and time range to auto-generate available slots
        </p>

        {/* Date Picker */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-4 rounded-xl shadow-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
        />

        {/* Time Range */}
        <div className="w-full flex gap-4">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="flex-1 p-3 rounded-xl shadow-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="flex-1 p-3 rounded-xl shadow-lg border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
          />
        </div>

        {/* Interval */}
        <div className="w-full flex justify-between items-center">
          <label className="text-gray-700 font-medium">Slot Interval (minutes)</label>
          <input
            type="number"
            min="5"
            value={slotInterval}
            onChange={(e) => setSlotInterval(Number(e.target.value))}
            className="w-20 p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Generate Slots */}
        <button
          onClick={generateSlots}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition duration-200"
        >
          Generate Slots
        </button>

        {/* Display Slots */}
        {slots.length > 0 && (
          <div className="w-full grid grid-cols-3 gap-3 mt-4">
            {slots.map((slot, idx) => (
              <div key={idx} className="bg-gray-100 p-3 rounded-xl text-center font-medium shadow-sm">
                {slot}
              </div>
            ))}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={saveAvailability}
          className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition duration-200"
        >
          Save Availability
        </button>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-[10%] text-gray-500 text-sm text-center w-full">
        &copy; 2025 Counseling System. All rights reserved.
      </footer>
    </div>
  );
}
