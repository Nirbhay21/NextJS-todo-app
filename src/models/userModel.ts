import mongoose, { InferSchemaType, Model } from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowerCase: true,
    trim: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

export type UserDocument = InferSchemaType<typeof userSchema> &
  mongoose.Document;

const User =
  (mongoose.models.User as Model<UserDocument>) ||
  mongoose.model<UserDocument>("User", userSchema);

export default User;
