// routes/dishes.js
import express from "express";
import Dish from "../models/Dish.js";

const router = express.Router();

// GET all dishes
router.get("/", async (_req, res) => {
  try {
    const dishes = await Dish.find().lean();
    const mapped = dishes.map(d => ({ ...d, id: d._id.toString(), _id: undefined }));
    res.json(mapped);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// GET a dish by name
router.get("/:name", async (req, res) => {
  try {
    const dish = await Dish.findOne({ name: req.params.name.trim() }).lean();
    if (!dish) return res.status(404).json({ error: "Dish not found" });
    dish.id = dish._id.toString();
    delete dish._id;
    res.json(dish);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// POST create dish
router.post("/", async (req, res) => {
  try {
    const { name, ingredients, preparationSteps, cookingTime, origin, spiceLevel } = req.body;
    if (
      !name ||
      !Array.isArray(ingredients) ||
      !Array.isArray(preparationSteps) ||
      typeof cookingTime !== "number" ||
      !origin
    ) return res.status(400).json({ error: "Missing/invalid fields" });

    const created = await Dish.create({
      name: name.trim(),
      ingredients,
      preparationSteps,
      cookingTime,
      origin,
      spiceLevel
    });

    res.status(201).json(created.toJSON());
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: "Dish already exists (name unique)" });
    res.status(500).json({ error: "Server error" });
  }
});

// PUT update by id
router.put("/:id", async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.name) updates.name = updates.name.trim();

    const updated = await Dish.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ error: "Dish not found" });
    res.json(updated.toJSON());
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: "Dish name already exists" });
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE by id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Dish.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Dish not found" });
    res.json({ message: "Dish deleted", id: req.params.id });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
