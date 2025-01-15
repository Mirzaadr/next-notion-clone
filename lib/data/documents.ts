"use server";

import { db } from "@/lib/prisma";
import { auth } from "../auth";
import { Document } from "@prisma/client";

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
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data };
  } catch (error) {
    console.error(JSON.stringify(error));
    return { success: false, data: null };
  }
};

export const getTrash = async () => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return { success: false, data: null };
  }
  const userId = session.user.id;
  try {
    const data = await db.document.findMany({
      where: { userId, isArchived: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data };
  } catch (error) {
    console.error(JSON.stringify(error));
    return { success: false, data: null };
  }
};

export const restoreDocument = async ({
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
          data: { isArchived: false },
        });

        await recursiveArchive(child.id);
      }
    };

    const options: Partial<Document> = {
      isArchived: false,
    };

    if (existingDoc.parentId) {
      const parent = await db.document.findUnique({
        where: { id: existingDoc.parentId },
      });
      if (parent?.isArchived) {
        options.parentId = undefined;
      }
    }

    const document = await db.document.update({
      where: { id: documentId },
      data: options,
    });

    recursiveArchive(documentId);
    return { success: true, data: document };
  } catch (error) {
    console.error(JSON.stringify(error));
    return { success: false };
  }
};

export const removeDocument = async ({
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

    await db.document.delete({
      where: { id: documentId },
    });

    return { success: true };
  } catch (error) {
    console.error(JSON.stringify(error));
    return { success: false };
  }
};

export const getSearch = async () => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return { success: false, data: null };
  }
  const userId = session.user.id;
  try {
    const data = await db.document.findMany({
      where: { userId, isArchived: false },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data };
  } catch (error) {
    console.error(JSON.stringify(error));
    return { success: false, data: null };
  }
};

export const getDocumentById = async ({
  documentId,
}: {
  documentId: string;
}) => {
  const session = await auth();

  // const userId = session.user.id;
  try {
    const document = await db.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new Error("Not Found");
    }

    if (document.isPublished && !document.isArchived) {
      return { success: true, data: document };
    }

    if (!session || !session.user?.id) {
      throw new Error("Not Authorized");
    }

    const userId = session.user.id;

    if (document.userId !== userId) {
      throw new Error("Not Authorized");
    }

    return { success: true, data: document };
  } catch (error) {
    console.error(JSON.stringify(error));
    return { success: false, data: null };
  }
};

export const updateDocument = async (args: {
  id: string;
  title?: string;
  content?: string;
  coverImage?: string;
  icon?: string;
  isPublished?: boolean;
}) => {
  const { id, ...rest } = args;
  const session = await auth();
  try {
    if (!session || !session.user?.id) {
      throw new Error("Unauthenticated");
    }
    const userId = session.user.id;

    const existingDoc = await db.document.findUnique({
      where: { id },
    });

    if (!existingDoc) {
      throw new Error("Not Found");
    }

    if (existingDoc.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await db.document.update({
      where: { id },
      data: { ...rest },
    });

    return { success: true, data: document };
  } catch (error) {
    console.error(JSON.stringify(error));
    return { success: false, data: null };
  }
};

export const removeDocumentIcon = async ({ id }: { id: string }) => {
  const session = await auth();
  try {
    if (!session || !session.user?.id) {
      throw new Error("Unauthenticated");
    }
    const userId = session.user.id;

    const existingDoc = await db.document.findUnique({
      where: { id },
    });

    if (!existingDoc) {
      throw new Error("Not Found");
    }

    if (existingDoc.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await db.document.update({
      where: { id },
      data: { icon: undefined },
    });

    return { success: true, data: document };
  } catch (error) {
    console.error(JSON.stringify(error));
    return { success: false, data: null };
  }
};
