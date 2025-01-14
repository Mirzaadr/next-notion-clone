"use server";

import { db } from "@/lib/prisma";
import { auth } from "../auth";

export const createDocument = async ({
  parentId,
  title,
}: {
  parentId?: string | undefined;
  title?: string;
}) => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return { success: false };
  }
  try {
    const newDoc = await db.document.create({
      data: {
        title: title || "Untitled",
        userId: session.user?.id,
        parentId,
      },
    });
    return { success: true, documentId: newDoc.id };
  } catch (error) {
    console.error(JSON.stringify(error));
    return { success: false };
  }
};

export const archiveDocument = async ({
  documentId,
}: {
  documentId: string;
}) => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return { success: false };
  }
  const userId = session.user.id;
  try {
    const existingDoc = await db.document.findUnique({
      where: { id: documentId },
    });

    if (!existingDoc) {
      throw new Error("Not Found");
    }

    if (existingDoc.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveArchive = async (documentId: string) => {
      const children = await db.document.findMany({
        where: { parentId: documentId, userId },
      });

      for (const child of children) {
        await db.document.update({
          where: { id: child.id },
          data: { isArchived: true },
        });

        await recursiveArchive(child.id);
      }
    };

    const document = await db.document.update({
      where: { id: documentId },
      data: { isArchived: true },
    });

    recursiveArchive(documentId);
    return { success: true, data: document };
  } catch (error) {
    console.error(JSON.stringify(error));
    return { success: false };
  }
};

export const getSidebar = async ({
  parentId = null,
}: {
  parentId: string | null;
}) => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return { success: false, data: null };
  }
  const userId = session.user.id;
  try {
    const data = await db.document.findMany({
      where: { userId, parentId, isArchived: false },
      orderBy: { createdAt: "asc" },
    });
    return { success: true, data };
  } catch (error) {
    console.error(JSON.stringify(error));
    return { success: false, data: null };
  }
};
