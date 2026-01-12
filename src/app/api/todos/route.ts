import { getLoggedInUser } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Todo from "@/models/todoModel";
import { User } from "better-auth";

export async function GET() {
  await connectDB();

  let user: User;

  try {
    user = await getLoggedInUser();
  } catch {
    return new Response(
      JSON.stringify({ message: "Unauthorized: Invalid user session" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 401,
      }
    );
  }

  try {
    const todos = await Todo.find({ userId: user.id }).lean();
    return Response.json(todos);
  } catch (error) {
    console.error("Error fetching todos from DB:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching todos from database" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  await connectDB();

  const body = await request.json();
  const { text } = body;

  let user: User;

  try {
    user = await getLoggedInUser();
  } catch {
    return new Response(
      JSON.stringify({ message: "Unauthorized: Invalid user session" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 401,
      }
    );
  }

  if (typeof text !== "string" || text.trim() === "") {
    return new Response(
      JSON.stringify({ message: "Invalid todo text provided" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    );
  }

  try {
    const todo = await Todo.create({ text: text.trim(), userId: user.id });
    return new Response(JSON.stringify(todo), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    });
  } catch (error) {
    console.error("Error creating todo in DB:", error);
    return new Response(
      JSON.stringify({ message: "Error creating todo in database" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
