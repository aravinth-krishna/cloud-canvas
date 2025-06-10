import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  FileItem: a
    .model({
      name: a.string(),
      type: a.string(),
      content: a.string(),
      parentId: a.string(),
    })
    .authorization((allow) => [allow.owner()]),

  File: a
    .model({
      name: a.string(),
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  ChatEntry: a
    .model({
      name: a.string(),
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Usage: a
    .model({
      month: a.string(),
      totalDuration: a.float(),
      runs: a.integer(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
  },
});
