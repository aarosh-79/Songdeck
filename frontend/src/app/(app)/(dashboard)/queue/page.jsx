"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function QueuePage() {
  const [nowPlaying, setNowPlaying] = useState(null);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const response = await fetch("/api/songs"); // Replace with your backend API route
        const data = await response.json();

        setNowPlaying(data.nowPlaying);
        setQueue(data.upcoming);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSongs();
  }, []);

  const handleVote = async (id) => {
    try {
      // Update votes in backend
      await fetch(`/api/vote/${id}`, {
        method: "POST",
      });

      // Update local state after voting
      setQueue((prev) =>
        prev.map((song) =>
          song.id === id ? { ...song, votes: song.votes + 1 } : song
        )
      );
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  if (loading) return <p className="p-8 text-gray-600">Loading songs...</p>;

  return (
    <div className="p-8">
      {/* Now Playing */}
      {nowPlaying && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Now Playing</h2>
          <div className="flex gap-6 items-center">
            <Image
              src={nowPlaying.cover}
              alt={nowPlaying.title}
              width={200}
              height={200}
              className="rounded-xl shadow"
            />
            <div>
              <h3 className="text-xl font-semibold">{nowPlaying.title}</h3>
              <p className="text-gray-600">{nowPlaying.artist}</p>
              <p className="text-sm text-gray-500">
                Album: "{nowPlaying.album}"
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Upcoming</h2>
        <div className="space-y-4">
          {queue.length > 0 ? (
            queue.map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between border-b pb-3"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={song.cover}
                    alt={song.title}
                    width={64}
                    height={64}
                    className="rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg font-medium">{song.title}</h3>
                    <p className="text-sm text-gray-600">{song.artist}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-semibold">
                    {song.votes}
                  </span>
                  <Button onClick={() => handleVote(song.id)}>Vote</Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No songs in the queue.</p>
          )}
        </div>
      </section>
    </div>
  );
}
