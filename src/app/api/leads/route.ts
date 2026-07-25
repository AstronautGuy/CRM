import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { contacts } from "~/server/db/schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { organizationId, firstName, lastName, email, phone, jobTitle } = body;

    if (!organizationId || !firstName || !lastName || !email) {
      return NextResponse.json({ error: "Missing required lead fields." }, { status: 400 });
    }

    const [lead] = await db
      .insert(contacts)
      .values({
        organizationId,
        firstName,
        lastName,
        email,
        phone: phone || null,
        jobTitle: jobTitle || null,
        status: "NEW",
      })
      .returning();

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
