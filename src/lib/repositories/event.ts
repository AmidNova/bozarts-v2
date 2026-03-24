import { prisma } from "@/lib/prisma";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import type { CreateEventInput, UpdateEventInput } from "@/lib/schemas/event";

export const eventRepository = {
  async findAll(page = 1, pageSize = DEFAULT_PAGE_SIZE) {
    const where = { endDate: { gte: new Date() } };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          creator: { select: { id: true, name: true, firstName: true, image: true } },
          _count: { select: { participants: true } },
        },
        orderBy: { startDate: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.event.count({ where }),
    ]);

    return {
      events,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  async findById(id: string) {
    return prisma.event.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, firstName: true, image: true } },
        participants: {
          include: {
            participant: { select: { id: true, name: true, firstName: true, image: true } },
          },
          orderBy: { registeredAt: "desc" },
        },
      },
    });
  },

  async create(creatorId: string, data: CreateEventInput) {
    return prisma.event.create({
      data: {
        ...data,
        creatorId,
      },
    });
  },

  async register(eventId: string, participantId: string) {
    return prisma.eventParticipant.create({
      data: { eventId, participantId },
    });
  },

  async unregister(eventId: string, participantId: string) {
    return prisma.eventParticipant.delete({
      where: {
        eventId_participantId: { eventId, participantId },
      },
    });
  },

  async isRegistered(eventId: string, participantId: string) {
    const count = await prisma.eventParticipant.count({
      where: { eventId, participantId },
    });
    return count > 0;
  },

  async findByCreatorId(creatorId: string) {
    return prisma.event.findMany({
      where: { creatorId },
      include: {
        _count: { select: { participants: true } },
      },
      orderBy: { startDate: "desc" },
    });
  },

  async update(id: string, creatorId: string, data: UpdateEventInput) {
    return prisma.event.update({
      where: { id, creatorId },
      data,
    });
  },

  async delete(id: string, creatorId: string) {
    return prisma.event.delete({
      where: { id, creatorId },
    });
  },
};
