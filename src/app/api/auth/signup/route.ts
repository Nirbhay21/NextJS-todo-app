import { connectDB } from "@/lib/connectDB";
import User from "@/models/userModel";
import { MongooseError } from "mongoose";
import { MongoServerError } from "mongodb";
import bcrypt from "bcrypt";

const validateSignupData = (data: {
  fullname: unknown;
  email: unknown;
  password: unknown;
}) => {
  const { fullname, email, password } = data;
  const errors: Record<string, string> = {};

  if (!fullname || typeof fullname !== "string" || !fullname.trim()) {
    errors.fullname = "Full name is required";
  }

  if (!email || typeof email !== "string") {
    errors.email = "Email is required";
  }

  if (!password || typeof password !== "string") {
    errors.password = "Password is required";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters long";
  }
  return errors;
};

export async function POST(request: Request) {
  await connectDB();

  let body: { fullname: string; email: string; password: string };

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

  const { fullname, email, password } = body;

  const errors = validateSignupData({ fullname, email, password });

  if (Object.keys(errors).length > 0) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input data",
          fields: errors,
        },
      },
      {
        status: 422,
      }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });
    return Response.json(
      {
        message: "New user created successfully",
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      return Response.json(
        {
          error: {
            code: "DUPLICATE_EMAIL",
            message: "Email already exists",
          },
        },
        { status: 409 }
      );
    }

    if (error instanceof MongooseError) {
      return Response.json(
        {
          error: {
            code: "DATABASE_ERROR",
            message: error.message,
          },
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        error: {
          code: "UNKNOWN_ERROR",
          message: "Something went wrong",
        },
      },
      { status: 500 }
    );
  }
}
