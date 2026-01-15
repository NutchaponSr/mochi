import z from "zod";
import { AuthCtx, authMutation } from "../lib/crpc";
import { CRPCError } from "better-convex/server";
import { MutationCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const create = authMutation
  .meta({ rateLimit: "organization/create" })
  .input(
    z.object({
      name: z.string(),
      slug: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const org = await ctx.auth.api.createOrganization({
      body: {
        name: input.name,
        slug: input.slug,
      },
      headers: ctx.auth.headers,
    });

    if (!org) {
      throw new CRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create organization" })
    }

    await setActiveOrganizationHandler(ctx, {
      organizationId: org.id as Id<"organization">,
    });

    return {
      id: org.id as Id<"organization">,
      slug: org.slug,
    };
  })

const setActiveOrganizationHandler = async (
  ctx: AuthCtx<MutationCtx>,
  args: { organizationId: Id<"organization"> }
) => {
  await ctx.auth.api.setActiveOrganization({
    body: {
      organizationId: args.organizationId,
    },
    headers: ctx.auth.headers,
  });

  return null;
}