import { prisma } from "../lib/prisma.js";
import { z } from "zod";

export const setCurrentStream = async (req, res, next) => {
	try {
		const validation = z
			.object({
				streamId: z.string().uuid("Stream ID must be a valid UUID"),
				spaceId: z.string().uuid("Space ID must be a valid UUID"),
			})
			.safeParse(req.body);

		if (!validation.success) {
			return res.status(400).json({
				message: "Validation failed",
				errors: validation.error.errors,
			});
		}

		const { streamId, spaceId } = validation.data;

		const stream = await prisma.stream.findUnique({
			where: { id: streamId },
		});

		if (!stream) {
			return res.status(404).json({ message: "Stream not found" });
		}

		if (stream.spaceId !== spaceId) {
			return res
				.status(400)
				.json({ message: "Stream does not belong to this workspace" });
		}

		await prisma.currentStream.deleteMany({
			where: { spaceId },
		});

		const currentStream = await prisma.currentStream.create({
			data: {
				streamId,
				spaceId,
				userId: stream.userId, 
			},
			include: {
				stream: {
					include: {
						user: true,
						addedByUser: true,
					},
				},
				space: true,
			},
		});

		await prisma.stream.update({
			where: { id: streamId },
			data: {
				played: true,
				playedTs: new Date(),
			},
		});

		res.status(200).json({
			message: "Current stream set successfully",
			data: currentStream,
		});
	} catch (error) {
		next(error);
	}
};

export const getCurrentStream = async (req, res, next) => {
	try {
		const { spaceId } = req.params;

		const currentStream = await prisma.currentStream.findFirst({
			where: { spaceId },
			include: {
				stream: {
					include: {
						user: true,
						addedByUser: true,
					},
				},
				space: true,
			},
		});

		if (!currentStream) {
			return res.status(200).json({
				data: null,
				message: "No current stream for this workspace",
			});
		}

		res.json({
			data: currentStream,
		});
	} catch (error) {
		next(error);
	}
};

export const endCurrentStream = async (req, res, next) => {
	try {
		const { spaceId } = req.params;

		const deletedCurrentStream = await prisma.currentStream.deleteMany({
			where: { spaceId },
		});

		if (deletedCurrentStream.count === 0) {
			return res.status(404).json({ message: "No current stream to end" });
		}

		res.json({
			message: "Current stream ended successfully",
		});
	} catch (error) {
		next(error);
	}
};

export const getCurrentStreamByUser = async (req, res, next) => {
	try {
		const { userId } = req.params;

		const currentStream = await prisma.currentStream.findFirst({
			where: { userId },
			include: {
				stream: {
					include: {
						user: true,
						addedByUser: true,
					},
				},
				space: true,
			},
		});

		res.json({
			data: currentStream,
		});
	} catch (error) {
		next(error);
	}
};
