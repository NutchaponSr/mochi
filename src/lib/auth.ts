import { api } from "@convex/api";
import { meta } from "@convex/meta";
import { convexBetterAuth } from "better-convex/auth-nextjs";

export const { handler } = convexBetterAuth({
  api,
  meta,
  convexSiteUrl: process.env.NEXT_PUBLIC_CONVEX_SITE_URL!,
});
