import { cookies } from "next/headers";
import { connectDB } from "./connectDB";
import User from "@/models/userModel";
import { createHmac } from "crypto";
import Session from "@/models/sessionModel";

export async function getLoggedInUser() {
  await connectDB();
  const cookieStore = await cookies();

  const signedSessionId = cookieStore.get("sid")?.value;
  const sessionId = signedSessionId?.split(".")[0];

  if (!sessionId) {
    throw new Error("Not authenticated");
  }

  if (!verifyCookie(signedSessionId)) {
    throw new Error("Not authenticated");
  }

  try {
    const session = await Session.findById(sessionId);

    if (!session) {
      throw new Error("Not authenticated");
    }

    const user = await User.findById(session.userId).select("-password -__v");

    if (!user) {
      throw new Error("Not authenticated");
    }

    return user;
  } catch {
    throw new Error("Not authenticated");
  }
}

export function signCookie(cookie: string) {
  const SECRET_KEY = process.env.SECRET_KEY as string;

  const signature = createHmac("sha512", SECRET_KEY)
    .update(cookie)
    .digest("hex");
  return `${cookie}.${signature}`;
}

export function verifyCookie(signedCookie: string) {
  const SECRET_KEY = process.env.SECRET_KEY as string;
  const [cookie, signatureFromCookie] = signedCookie.split(".");

  const signature = createHmac("sha512", SECRET_KEY)
    .update(cookie)
    .digest("hex");

  return signature === signatureFromCookie;
}
