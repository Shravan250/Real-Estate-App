import prisma from "../lib/prisma.js";

export const addMessages = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    if (!chat.userIds.includes(tokenUserId)) {
      return res.status(403).json({ message: "Unauthorized action!" });
    }

    const message = await prisma.message.create({
      data: {
        chatId,
        userId: tokenUserId,
        text,
      },
    });

    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        seenBy: {
          set: Array.from(new Set([...chat.seenBy, tokenUserId])), // Ensure unique values
        },
        lastMessage: text,
      },
    });

    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};
