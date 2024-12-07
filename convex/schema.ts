import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  workspaces: defineTable({
    description: v.string(),
    userId: v.string(),
    name: v.string(),
    shapes: v.string(),
    document: v.string(),
  }),
});
