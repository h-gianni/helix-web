// app/api/auth/webhook/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const headerPayload = headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error("❌ Missing svix headers");
      return new Response("Error occurred -- no svix headers", {
        status: 400,
      });
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("❌ Missing webhook secret");
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
      console.error("❌ Error verifying webhook:", err);
      return new Response("Error occurred", {
        status: 400,
      });
    }

    console.log("✅ Verified webhook event:", event.type);

    if (event.type === "user.created" || event.type === "user.updated") {
      const { id, email_addresses, first_name, last_name, external_accounts } = event.data;

      console.log("👤 Finding user with clerkId:", external_accounts);

      // Check if user signed in with Google
      const googleAccount = external_accounts?.find(
        (account) => account.provider === "google"
      );

      const email = googleAccount?.email_address || email_addresses[0]?.email_address;

      if (!email) {
        console.error("❌ No email found for user:", id);
        return new Response("No Email found. Error occurred", {
          status: 400,
        });
      }

      const user = await prisma.appUser.upsert({
        where: { clerkId: id },
        update: {
          email,
          name: `${first_name || ""} ${last_name || ""}`.trim() || null,
          customFields: {
            firstName: first_name,
            lastName: last_name,
            googleEmail: googleAccount?.email_address,
            lastUpdated: new Date().toISOString(),
          },
          updatedAt: new Date(),
          deletedAt: null, // Ensure user is not soft-deleted
        },
        create: {
          clerkId: id,
          email,
          name: `${first_name || ""} ${last_name || ""}`.trim() || null,
          customFields: {
            firstName: first_name,
            lastName: last_name,
            googleEmail: googleAccount?.email_address,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
          },
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          action: event.type === "user.created" ? "CREATE" : "UPDATE",
          entityType: "APP_USER",
          entityId: user.id,
          changes: body,
          performedBy: "CLERK_WEBHOOK"
        }
      });

      console.log(`✅ User ${event.type === "user.created" ? "created" : "updated"}:`, {
        id: user.id,
        email: user.email,
        name: user.name
      });

      return NextResponse.json({ success: true, user });
    }

    if (event.type === "user.deleted") {
      const { id } = event.data;
      
      // Soft delete the user
      const user = await prisma.appUser.update({
        where: { clerkId: id },
        data: {
          deletedAt: new Date(),
          customFields: {
            deletedBy: 'clerk-webhook',
            deletedAt: new Date().toISOString(),
          },
        },
      });

      // Create audit log
      await prisma.auditLog.create({
        data: {
          action: "DELETE",
          entityType: "APP_USER",
          entityId: user.id,
          changes: body,
          performedBy: "CLERK_WEBHOOK"
        }
      });

      console.log("✅ User soft deleted:", id);
      return NextResponse.json({ success: true });
    }

    console.log("✅ Webhook processed successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error in webhook:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}


// Health check endpoint
export async function GET() {
  return NextResponse.json(
    { message: "Webhook endpoint is working" },
    { status: 200 }
  );
}