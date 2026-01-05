import { verifyCookie } from "@/lib/auth";
import Session from "@/models/sessionModel";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  const signedSessionId = cookieStore.get("sid")?.value;

  if (signedSessionId) {
    const isVerified = verifyCookie(signedSessionId);

    if (!isVerified) {
      return Response.json(
        { error: { message: "Invalid session cookie" } },
        { status: 400 }
      );
    }

    const sessionId = signedSessionId.split(".")[0];

    try {
      await Session.findByIdAndDelete(sessionId);
      cookieStore.delete("sid");
    } catch {
      return Response.json(
        { error: { message: "Failed to logout user" } },
        { status: 500 }
      );
    }
  }

  return Response.json({ message: "Logged out successfully" });
}
