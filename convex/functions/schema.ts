import { defineEnt, defineEntSchema } from "convex-ents";
import { v } from "convex/values";

const schema = defineEntSchema({
  user: defineEnt({
    name: v.string(),
    email: v.string(),
  }).index("email", ["email"]),
});

export default schema;
