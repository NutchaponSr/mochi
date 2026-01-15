import type { createAuth } from "../functions/auth";
import type { Doc, Id } from "../functions/_generated/dataModel";

export type Auth = ReturnType<typeof createAuth>;
export type SessionUser = Omit<Doc<"user">, "_creationTime" | "_id"> & {
  id: Id<"user">;
  activeOrganization: | (Omit<Doc<"organization">, "_id"> & {
    id: Id<"organization">;
    role: Doc<"member">["role"];
  }) | null;
  session: Doc<"session">;
}