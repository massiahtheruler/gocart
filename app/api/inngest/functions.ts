import prisma from "@/lib/prismadb";
import { inngest } from "@/inngest/client";

export const syncUserCreation = inngest.createFunction(
  { id: "sync-user.created", triggers: [{ event: "clerk/user.created" }] },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.create({
      data: {
        id: data.id,
        email: data.email_addresses?.[0]?.email_address ?? "",
        name: [data.first_name, data.last_name].filter(Boolean).join(" "),
        image: data.image_url,
      },
    });
  },
);

export const syncUserUpdate = inngest.createFunction(
  { id: "sync-user.updated", triggers: [{ event: "clerk/user.updated" }] },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: data.email_addresses?.[0]?.email_address ?? "",
        name: [data.first_name, data.last_name].filter(Boolean).join(" "),
        image: data.image_url,
      },
    });
  },
);

export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user.deleted", triggers: [{ event: "clerk/user.deleted" }] },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.delete({
      where: { id: data.id },
    });
  },
);
