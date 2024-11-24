// app/api/auth/webhook/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// type UserWebhookEvent = {
//   data: {
//     id: string;
//     email_addresses: Array<{
//       email_address: string;
//       verification: { status: string };
//     }>;
//     first_name: string | null;
//     last_name: string | null;
//     external_accounts: Array<{
//       provider: string;
//       email_address: string;
//     }>;
//   };
//   type: string;
// };

export async function POST(request: Request) {
  try {
    const headerPayload = headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Error occurred -- no svix headers", {
        status: 400,
      });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing webhook secret");
    }
    const wh = new Webhook(webhookSecret);
    let event: WebhookEvent;

    try {
      event = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred", {
        status: 400,
      });
    }

    if (event.type === "user.created" || event.type === "user.updated") {
      const { id, email_addresses, first_name, last_name, external_accounts } =
        event.data;

      // Check if user signed in with Google
      const googleAccount = external_accounts?.find(
        (account) => account.provider === "google"
      );

      const email =
        googleAccount?.email_address || email_addresses[0]?.email_address;

      if (!email) {
        return new Response("No Email found. Error occurred", {
          status: 400,
        });
      }

      const user = await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email,
          name: `${first_name || ""} ${last_name || ""}`.trim(),
        },
        create: {
          clerkId: id,
          email,
          name: `${first_name || ""} ${last_name || ""}`.trim(),
        },
      });
      console.log("🟢 [DEBUG] User upserted:", user);
      return NextResponse.json({ success: true, user });
    }
  } catch (error) {
    console.error("❌ [DEBUG] Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Webhook endpoint is working" },
    { status: 200 }
  );
}
