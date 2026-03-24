import { prisma } from "@/lib/prisma";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { SendMessageInput } from "@/lib/schemas/message";

export const messageRepository = {
  async send(senderId: string, data: SendMessageInput) {
    return prisma.message.create({
      data: {
        subject: data.subject,
        content: data.content,
        senderId,
        receiverId: data.receiverId,
      },
    });
  },

  /** Get conversations list (latest message per correspondent) */
  async getConversations(userId: string, page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    // Get all messages involving this user, grouped by correspondent
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: { select: { id: true, name: true, firstName: true, image: true } },
        receiver: { select: { id: true, name: true, firstName: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Group by correspondent and keep latest message
    const conversationMap = new Map<string, typeof messages[number]>();
    for (const msg of messages) {
      const correspondentId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!conversationMap.has(correspondentId)) {
        conversationMap.set(correspondentId, msg);
      }
    }

    const all = Array.from(conversationMap.values());
    const total = all.length;
    const paginated = all.slice((page - 1) * pageSize, page * pageSize);

    return {
      conversations: paginated,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  /** Get messages between two users */
  async getThread(userId: string, correspondentId: string) {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: correspondentId },
          { senderId: correspondentId, receiverId: userId },
        ],
      },
      include: {
        sender: { select: { id: true, name: true, firstName: true, image: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    // Mark unread messages as read
    await prisma.message.updateMany({
      where: {
        senderId: correspondentId,
        receiverId: userId,
        read: false,
      },
      data: { read: true },
    });

    return messages;
  },

  async countUnread(userId: string) {
    return prisma.message.count({
      where: { receiverId: userId, read: false },
    });
  },

  /** Get correspondent info */
  async getCorrespondent(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, firstName: true, image: true },
    });
  },
};
