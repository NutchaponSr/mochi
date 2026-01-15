import { getHeaders, getSession } from "better-convex/auth";
import { CRPCError, initCRPC } from "better-convex/server";
import {
  query,
  mutation,
  internalQuery,
  internalMutation,
  action,
  internalAction,
} from "../functions/_generated/server";
import type {
  ActionCtx,
  MutationCtx,
  QueryCtx,
} from "../functions/_generated/server";
import type { DataModel, Id } from "../functions/_generated/dataModel";
import { type CtxWithTable, Ent, EntWriter, getCtxWithTable } from "./ents";
import { SessionUser } from "@convex/auth-shared";
import { getAuth } from "../functions/auth";
import type { Auth } from "convex/server";
import { getSessionUserWriter } from "./helper";

export type GenericCtx = QueryCtx | MutationCtx | ActionCtx;

export type CtxUser<Ctx extends MutationCtx | QueryCtx = QueryCtx> = SessionUser & (Ctx extends MutationCtx ? EntWriter<"user"> : Ent<"user">);

export type AuthCtx<Ctx extends MutationCtx | QueryCtx = QueryCtx> = CtxWithTable<Ctx> & {
  auth: Auth & ReturnType<typeof getAuth> & { headers: Headers };
  user: CtxUser<Ctx>;
  userId: Id<"user">;
}

type Meta = {
  auth?: 'optional' | 'required';
  role?: 'admin';
  rateLimit?: string;
  dev?: boolean;
};

const c = initCRPC
  .dataModel<DataModel>()
  .context({
    query: (ctx) => getCtxWithTable(ctx),
    mutation: (ctx) => getCtxWithTable(ctx),
  })
  .meta<Meta>()
  .create({
    query,
    internalQuery,
    mutation,
    internalMutation,
    action,
    internalAction,
  });

// const devMiddleware = c.middleware<object>(({ meta, next, ctx }) => {
//   if (meta.dev && process.env.NODE_ENV === 'production') {
//     throw new CRPCError({
//       code: 'FORBIDDEN',
//       message: 'This function is only available in development',
//     });
//   }
//   return next({ ctx });
// });

function requireAuth<T>(user: T | null): T {
  if (!user) {
    throw new CRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }

  return user;
}

export const authMutation = c.mutation
  .meta({ auth: "required" })
  // .use(devMiddleware)
  .use(async ({ ctx, next }) => {
    const user = requireAuth(await getSessionUserWriter(ctx));

    return next({
      ctx: {
        ...ctx,
        auth: {
          ...ctx.auth,
          ...getAuth(ctx),
          headers: await getHeaders(ctx, user.session),
        },
        user,
        userId: user.id,
      },
    });
  })

export const publicQuery = c.query;
export const publicMutation = c.mutation;
export const publicAction = c.action;
