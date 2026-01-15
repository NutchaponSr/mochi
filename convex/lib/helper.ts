import { getSession } from "better-convex/auth";
import type { MutationCtx, QueryCtx } from '../functions/_generated/server';

import type { CtxWithTable, Ent, EntWriter } from "./ents";
import { Id } from "@convex/dataModel";
import { SessionUser } from "@convex/auth-shared";


const getSessionData = async (ctx: CtxWithTable<MutationCtx>) => {
  const session = await getSession(ctx);

  if (!session) return null;

  const activeOrganizationId = session.activeOrganizationId as Id<"organization"> | null;

  const [user] = await Promise.all([
    ctx.table("user").get(session.userId),
  ]);

  if (!user) return null;

  const activeOrganization = await (async () => {
    if (!activeOrganizationId) return null;

    const [activeOrg, currentMember] = await Promise.all([
      ctx.table("organization").getX(activeOrganizationId),
      ctx.table("member").get("organizationId_userId", activeOrganizationId, session.userId),
    ]);

    return {
      ...activeOrg.doc(),
      id: activeOrg._id,
      role: currentMember?.role || "member",
    };
  })();

  return {
    activeOrganization,
    session,
    user,
  } as const;
}

export const getSessionUser = async (ctx: CtxWithTable<QueryCtx>): Promise<(Ent<"user"> & SessionUser) | null> => {
  const {
    activeOrganization,
    session,
    user
  } = (await getSessionData(ctx as any)) ?? ({} as never);

  if (!user) return null;

  return Object.assign(user, {
    id: user._id,
    activeOrganization,
    session,
  }) as Ent<"user"> & SessionUser;
}

export const getSessionUserWriter = async (ctx: CtxWithTable<MutationCtx>): Promise<(EntWriter<"user"> & SessionUser) | null> => {
  const {
    activeOrganization,
    session,
    user
  } = (await getSessionData(ctx)) ?? ({} as never);

  if (!user) {
    return null;
  }

  return {
    ...user,
    id: user._id,
    delete: user.delete,
    doc: user.doc,
    edge: user.edge,
    edgeX: user.edgeX,
    patch: user.patch,
    replace: user.replace,
    session,
    activeOrganization
  }
}