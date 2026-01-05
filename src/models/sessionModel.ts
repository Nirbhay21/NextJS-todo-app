import mongoose, { InferSchemaType, Model } from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true, // Add index for performance
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 7, // Session expires after 7 days
  },
});

type SessionType = InferSchemaType<typeof sessionSchema> & mongoose.Document;
const Session =
  (mongoose.models.Session as Model<SessionType>) ||
  mongoose.model<SessionType>("Session", sessionSchema);

export default Session;
