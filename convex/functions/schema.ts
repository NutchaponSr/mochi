import { v } from 'convex/values';
import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents';

const schema = defineEntSchema({
  user: defineEnt({
    name: v.string(),
    email: v.string(),
    emailVerified: v.boolean(),
    image: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    username: v.optional(v.string()),
  })
    .index('email', ['email'])
    .edges('sessions', { to: 'session', ref: "userId" })
    .edges('accounts', { to: 'account', ref: "userId" })
    .edges('members', { to: 'member', ref: 'userId' })
    .edges('invitations', { to: 'invitation', ref: 'inviterId' }),

  session: defineEnt({
    token: v.string(),
    expiresAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    activeOrganizationId: v.optional(v.string()),
    activeTeamId: v.optional(v.string()),
  })
    .index('token', ['token'])
    .edge('user', { to: 'user', field: 'userId' }),

  account: defineEnt({
    accountId: v.string(),
    providerId: v.string(),
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    idToken: v.optional(v.string()),
    accessTokenExpiresAt: v.optional(v.number()),
    refreshTokenExpiresAt: v.optional(v.number()),
    scope: v.optional(v.string()),
    password: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('accountId', ['accountId'])
    .edge('user', { to: 'user', field: 'userId' }),

  verification: defineEnt({
    identifier: v.string(),
    value: v.string(),
    expiresAt: v.number(),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index('identifier', ['identifier']),

  jwks: defineEnt({
    publicKey: v.string(),
    privateKey: v.string(),
    createdAt: v.number(),
  }),

  organization: defineEnt({
    logo: v.optional(v.string()),
    createdAt: v.number(),
    metadata: v.optional(v.string()),
  })
    .field('slug', v.string(), { unique: true })
    .field('name', v.string(), { index: true })
    .edges('members', { to: 'member', ref: true })
    .edges('invitations', { to: 'invitation', ref: true }),
  member: defineEnt({
    createdAt: v.number(),
  })
    .field('role', v.string(), { index: true })
    .edge('organization', { to: 'organization', field: 'organizationId' })
    .edge('user', { to: 'user', field: 'userId' })
    .index('organizationId_userId', ['organizationId', 'userId'])
    .index('organizationId_role', ['organizationId', 'role']),
  
  invitation: defineEnt({
    role: v.optional(v.string()),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .field('email', v.string(), { index: true })
    .field('status', v.string(), { index: true })
    .edge('organization', { to: 'organization', field: 'organizationId' })
    .edge('inviter', { to: 'user', field: 'inviterId' })
    .index('email_organizationId_status', ['email', 'organizationId', 'status'])
    .index('organizationId_status', ['organizationId', 'status']),
});

export default schema;
export const entDefinitions = getEntDefinitions(schema);