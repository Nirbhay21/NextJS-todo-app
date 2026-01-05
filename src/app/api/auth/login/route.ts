import { signCookie } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Session from "@/models/sessionModel";
import User from "@/models/userModel";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";

const validateLoginData = (data: { email: unknown; password: unknown }) => {
  const { email, password } = data;
  const errors: Record<string, string> = {};
  if (!email || typeof email !== "string") {
    errors.email = "Email is required";
  }
  if (!password || typeof password !== "string") {
    errors.password = "Password is required";
  }
  return errors;
};

export async function POST(request: Request) {
  await connectDB();
  const cookieStore = await cookies();

  let body: { email: string; password: string };

  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        error: {
          code: "INVALID_JSON",
          message: "Request body is not valid JSON",
        },
      },
      { status: 400 }
    );
  }

  const { email, password } = body;
  const errors = validateLoginData({ email, password });

  if (Object.keys(errors).length > 0) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input data",
          fields: errors,
        },
      },
      { status: 422 }
    );
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return Response.json(
        {
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password",
          },
        },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user?.password);

    if (!isPasswordValid) {
      return Response.json(
        {
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password",
          },
        },
        { status: 401 }
      );
    }

    const session = await Session.create({ userId: user?._id });
    const totalSessions = await Session.countDocuments({ userId: user._id });

    if (totalSessions > 2) {
      await Session.findOneAndDelete(
        { userId: user._id },
        { sort: { createdAt: 1 } }
      );
    }

    if (user) {
      const signedSessionId = signCookie(session._id.toString());

      cookieStore.set("sid", signedSessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
      return Response.json(
        {
          message: "Login successful",
          user: { id: user._id, fullname: user.fullname, email: user.email },
        },
        { status: 200 }
      );
    } else {
      return Response.json(
        {
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid email or password",
          },
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error during user login:", error);
    return Response.json(
      {
        error: {
          code: "SERVER_ERROR",
          message: "Error during login process",
        },
      },
      { status: 500 }
    );
  }
}
