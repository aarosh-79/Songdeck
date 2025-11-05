"use client";
import React, { useEffect, useState } from "react";

// Replace with your real backend API
const API_URL = "http://localhost:3000/api/requests";

export default function IncomingRequests() {
  const [requests, setRequests] = useState([]);

  // Fetch requests from backend
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        // Expecting backend to return [{ song, artist, requestedBy, time, id }]
        setRequests(data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };

    fetchRequests();
  }, []);

  // Handle Accept / Reject
  const handleAction = async (id, action) => {
    try {
      const res = await fetch(`${API_URL}/${id}/${action}`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to update request");

      // Remove from local list (optimistic update)
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
    }
  };

  return (
    <div className="p-10">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-2">Incoming Requests</h1>
      <p className="text-gray-500 mb-6">
        Review and manage song requests from your workspace.
      </p>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="py-3 px-4 font-semibold text-gray-700">Song</th>
              <th className="py-3 px-4 font-semibold text-gray-700">Artist</th>
              <th className="py-3 px-4 font-semibold text-gray-700">
                Requested By
              </th>
              <th className="py-3 px-4 font-semibold text-gray-700">Time</th>
              <th className="py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((req) => (
                <tr
                  key={req.id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">{req.song}</td>
                  <td className="py-3 px-4 text-indigo-600 cursor-pointer hover:underline">
                    {req.artist}
                  </td>
                  <td className="py-3 px-4 text-indigo-600 cursor-pointer hover:underline">
                    {req.requestedBy}
                  </td>
                  <td className="py-3 px-4">{req.time}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleAction(req.id, "accept")}
                      className="text-green-600 font-medium hover:underline mr-2"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(req.id, "reject")}
                      className="text-red-600 font-medium hover:underline"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No requests yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
