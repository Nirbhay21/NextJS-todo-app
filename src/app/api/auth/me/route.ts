import { getLoggedInUser } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import { UserDocument } from "@/models/userModel";

export async function GET() {
  await connectDB();

  let user: UserDocument;
  try {
    user = await getLoggedInUser();
  } catch {
    return Response.json(
      { error: { message: "Unauthorized: Invalid user session" } },
      { status: 401 }
    );
  }

  return Response.json({ user });
}
