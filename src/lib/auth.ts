import { headers } from "next/headers";
import { auth } from "./betterAuth";

export async function getLoggedInUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session || !session.user) {
    throw new Error("No valid user session found");
  }
  return session.user;
}
