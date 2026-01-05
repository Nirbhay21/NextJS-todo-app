import mongoose, { InferSchemaType, Model } from "mongoose";

const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true // Add index for performance
  },
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

type TodoType = InferSchemaType<typeof todoSchema> & mongoose.Document;

const Todo =
  (mongoose.models.Todo as Model<TodoType>) ||
  mongoose.model<TodoType>("Todo", todoSchema);

export default Todo;
