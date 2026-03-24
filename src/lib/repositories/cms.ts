import { prisma } from "@/lib/prisma";

export const cmsRepository = {
  // ─── CGU Sections ─────────────────────────────────────────────

  async findAllCgu() {
    return prisma.cguSection.findMany({ orderBy: { order: "asc" } });
  },

  async findCguById(id: string) {
    return prisma.cguSection.findUnique({ where: { id } });
  },

  async createCgu(data: { title: string; content: string }) {
    const maxOrder = await prisma.cguSection.aggregate({ _max: { order: true } });
    return prisma.cguSection.create({
      data: { ...data, order: (maxOrder._max.order ?? -1) + 1 },
    });
  },

  async updateCgu(id: string, data: { title?: string; content?: string }) {
    return prisma.cguSection.update({ where: { id }, data });
  },

  async deleteCgu(id: string) {
    return prisma.cguSection.delete({ where: { id } });
  },

  async reorderCgu(orderedIds: string[]) {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.cguSection.update({ where: { id }, data: { order: index } })
      )
    );
  },

  // ─── FAQ Entries ──────────────────────────────────────────────

  async findAllFaq() {
    return prisma.faqEntry.findMany({ orderBy: { order: "asc" } });
  },

  async findFaqById(id: string) {
    return prisma.faqEntry.findUnique({ where: { id } });
  },

  async createFaq(data: { question: string; answerTitle: string; answerContent: string }) {
    const maxOrder = await prisma.faqEntry.aggregate({ _max: { order: true } });
    return prisma.faqEntry.create({
      data: { ...data, order: (maxOrder._max.order ?? -1) + 1 },
    });
  },

  async updateFaq(
    id: string,
    data: { question?: string; answerTitle?: string; answerContent?: string }
  ) {
    return prisma.faqEntry.update({ where: { id }, data });
  },

  async deleteFaq(id: string) {
    return prisma.faqEntry.delete({ where: { id } });
  },

  async reorderFaq(orderedIds: string[]) {
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.faqEntry.update({ where: { id }, data: { order: index } })
      )
    );
  },
};
