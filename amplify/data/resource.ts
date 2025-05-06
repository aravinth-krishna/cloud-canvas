// amplify/data/resource.ts
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // Don't care about this model, just ignore it completely
  FileItem: a
    .model({
      name: a.string(),
      type: a.string(), // "file" or "folder"
      content: a.string(), // only applicable for files
      parentId: a.string(), // for hierarchical structuring
    })
    .authorization((allow) => [allow.owner()]),

  File: a
    .model({
      name: a.string(),
      content: a.string(), // file content
    })
    .authorization((allow) => [allow.publicApiKey()]),

  Usage: a
    .model({
      month: a.string(), // e.g., "2025-05"
      totalDuration: a.float(), // seconds used
      runs: a.integer(), // number of code runs
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
  },
});
