import { getLoggedInUser } from "@/lib/auth";
import { connectDB } from "@/lib/connectDB";
import Todo from "@/models/todoModel";
import { User } from "better-auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await params;

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
    const todo = await Todo.findById({ _id: id, userId: user.id });
    if (!todo) {
      return new Response(JSON.stringify({ message: "Todo not found" }), {
        headers: { "Content-Type": "application/json" },
        status: 404,
      });
    }
    return new Response(JSON.stringify(todo), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching todo from DB:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching todo from database" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { text, completed } = await request.json();

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

    if (
      typeof text === "string" &&
      text.trim() !== "" &&
      completed === undefined
    ) {
      try {
        await Todo.findOneAndUpdate(
          { _id: id, userId: user.id },
          { text: text.trim() }
        );
        return new Response(
          JSON.stringify({ message: "Todo text updated successfully" }),
          {
            headers: { "Content-Type": "application/json" },
            status: 200,
          }
        );
      } catch (error) {
        console.error("Error updating todo in DB:", error);
        return new Response(
          JSON.stringify({ message: "Error updating todo in database" }),
          {
            headers: { "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
    } else if (typeof completed === "boolean" && text === undefined) {
      try {
        await Todo.updateOne({ _id: id }, { completed: completed });
        return new Response(
          JSON.stringify({
            message: "Todo completion status updated successfully",
          }),
          {
            headers: { "Content-Type": "application/json" },
            status: 200,
          }
        );
      } catch (error) {
        console.error("Error updating todo in DB:", error);
        return new Response(
          JSON.stringify({ message: "Error updating todo in database" }),
          {
            headers: { "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
    } else {
      if (text !== undefined && completed !== undefined) {
        return new Response(
          JSON.stringify({
            message:
              "Only one field (text or completed) can be updated at a time",
          }),
          {
            headers: { "Content-Type": "application/json" },
            status: 400,
          }
        );
      } else {
        return new Response(
          JSON.stringify({ message: "Invalid fields to update" }),
          {
            headers: { "Content-Type": "application/json" },
            status: 400,
          }
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ message: "Invalid JSON body", error: error.message }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;

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
    await Todo.deleteOne({ _id: id, userId: user.id });
    return new Response(
      JSON.stringify({ message: "Todo deleted successfully" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting todo from DB:", error);
    return new Response(
      JSON.stringify({ message: "Error deleting todo from database" }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}
