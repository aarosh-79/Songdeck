import { prisma } from "../lib/prisma.js";

// Request a new song
export const requestSong = async (req, res) => {
  try {
    const { title, artist, requestedBy } = req.body;
    const { workspaceId } = req.params;

    if (!title || !artist) {
      return res.status(400).json({ message: "Title and artist are required" });
    }

    const song = await prisma.song.create({
      data: {
        title,
        artist,
        requestedBy: requestedBy || "Anonymous",
        votes: 0,
        workspaceId,
      },
    });

    res.status(201).json({ message: "Song added successfully", song });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add song" });
  }
};

// Get all songs for a workspace
export const getSongs = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const songs = await prisma.song.findMany({
      where: { workspaceId },
      orderBy: { votes: "desc" },
    });

    res.json({ songs });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch songs" });
  }
};

// Vote for a song
export const voteSong = async (req, res) => {
  try {
    const { songId } = req.body;

    if (!songId) {
      return res.status(400).json({ message: "Song ID is required" });
    }

    const updatedSong = await prisma.song.update({
      where: { id: songId },
      data: {
        votes: { increment: 1 },
      },
    });

    res.json({ message: "Vote added successfully", song: updatedSong });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to vote" });
  }
};

// Get queue (songs sorted by votes)
export const getQueue = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const queue = await prisma.song.findMany({
      where: { workspaceId },
      orderBy: { votes: "desc" },
    });

    res.json({ queue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch queue" });
  }
};
