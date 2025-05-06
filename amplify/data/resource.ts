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

  ChatEntry: a
    .model({
      name: a.string(), // a title or label, searchable in sidebar
      content: a.string(), // the chat message text
    })
    .authorization((allow) => [allow.publicApiKey()]), // or owner(), if you want private history

  Usage: a
    .model({
      month: a.string(), // e.g., "2025-05"
      totalDuration: a.float(), // seconds used
      runs: a.integer(), // number of code runs
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
