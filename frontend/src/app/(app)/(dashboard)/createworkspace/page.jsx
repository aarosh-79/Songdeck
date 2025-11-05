"use client";

import { useState } from "react";

export default function CreateWorkspacePage() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceId, setWorkspaceId] = useState(generateWorkspaceId());
  const [songLengthLimit, setSongLengthLimit] = useState("");
  const [maxRequests, setMaxRequests] = useState("");

  function generateWorkspaceId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  } 

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      workspaceName,
      workspaceId,
      songLengthLimit,
      maxRequests,
    };

    console.log("Creating Workspace:", data);
    // Here you can make an API call (e.g., fetch('/api/workspaces', {...}))
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Create a Workspace</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Workspace Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Workspace Name
          </label>
          <input
            type="text"
            placeholder=""
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            className="w-full border rounded-md p-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Workspace ID */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Workspace ID
          </label>
          <input
            type="text"
            value={workspaceId}
            disabled
            className="w-full border rounded-md p-3 bg-gray-200 text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Workspace Settings */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Workspace Settings</h2>

          <div className="mb-4">
            <label className="block text-sm mb-1">
              Song Length Limit (minutes)
            </label>
            <input
              type="number"
              placeholder=""
              value={songLengthLimit}
              onChange={(e) => setSongLengthLimit(e.target.value)}
              className="w-full border rounded-md p-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Maximum Requests Per User
            </label>
            <input
              type="number"
              placeholder=""
              value={maxRequests}
              onChange={(e) => setMaxRequests(e.target.value)}
              className="w-full border rounded-md p-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-purple-900 text-white px-6 py-3 rounded-md hover:bg-purple-800"
          >
            Create Workspace
          </button>
        </div>
      </form>
    </div>
  );
}
