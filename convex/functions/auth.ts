import schema from "./schema";
import authConfig from './auth.config';

import { createApi, createClient, type AuthFunctions } from "better-convex/auth";

import { api, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { GenericCtx } from "../lib/crpc";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { MutationCtx, QueryCtx } from "./_generated/server";
import { requireActionCtx } from "@convex-dev/better-auth/utils";
import { buildEmailTemplate } from "./emailTemplates";
import { organization } from "better-auth/plugins";

const authFunctions: AuthFunctions = internal.auth;

export const authClient = createClient<DataModel, typeof schema>({
  authFunctions,
  schema,
  triggers: {
    user: {
      beforeCreate: async (_ctx, data) => {
        const username = data.name.trim() || data.email.split("@")[0] || `user-${Date.now()}`;

        return { ...data, username };
      },
    },
  },
});

export const createAuthOptions = (ctx: GenericCtx) => ({
  baseURL: process.env.SITE_URL!,
  database: authClient.httpAdapter(ctx),
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24 * 15, 
  },
  account: {
    accountLinking: {
      enabled: true,
      updateUserInfoOnLink: true,
      trustedProviders: ["google"],
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    expiresIn: 60 * 60,
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }) => {
      const link = new URL(url);

      link.searchParams.set("callbackUrl", "/auth/verify");

      await requireActionCtx(ctx).runAction(api.email.sendEmail, {
        to: user.email,
        ...buildEmailTemplate(
          link.toString(), 
          "Verify Your Email Address", 
          "Please verify your email address by using the code below or clicking the verification button."
        ),
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  trustedOrigins: [process.env.SITE_URL! || "http://localhost:3000"],
  plugins: [
    convex({
      authConfig,
      jwks: process.env.JWKS,
    }),
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 1,
      creatorRole: "owner",
    }),
  ]
}) satisfies BetterAuthOptions;

export const createAuth = (ctx: GenericCtx) => betterAuth(createAuthOptions(ctx));

export const getAuth = <Ctx extends QueryCtx | MutationCtx>(ctx: Ctx) => {
  return betterAuth({
    ...createAuthOptions(ctx),
    database: authClient.adapter(ctx, createAuthOptions),
  });
}

// Export trigger handlers for Convex
export const {
  beforeCreate,
  beforeDelete,
  beforeUpdate,
  onCreate,
  onDelete,
  onUpdate,
} = authClient.triggersApi();

// Export CRUD functions for Better Auth
export const {
  create,
  deleteMany,
  deleteOne,
  findMany,
  findOne,
  updateMany,
  updateOne,
  getLatestJwks,
  rotateKeys,
} = createApi(schema, createAuth, {
  skipValidation: true, // Smaller generated types
});
// Export auth instance for Better Auth CLI
// biome-ignore lint/suspicious/noExplicitAny: Required for CLI
export const auth = betterAuth(createAuthOptions({} as any));