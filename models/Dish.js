// models/Dish.js
import mongoose from "mongoose";

const dishSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    ingredients: { type: [String], required: true },
    preparationSteps: { type: [String], required: true },
    cookingTime: { type: Number, required: true }, // minutes
    origin: { type: String, required: true },
    spiceLevel: { type: String, enum: ["mild", "medium", "hot", "extra-hot"], default: "mild" }
  },
  { timestamps: true }
);

dishSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export default mongoose.model("Dish", dishSchema);
