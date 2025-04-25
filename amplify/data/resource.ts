// amplify/data/resource.ts
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // New model for files/folders.
  FileItem: a
    .model({
      name: a.string(),
      type: a.string(), // "file" or "folder"
      content: a.string(), // only applicable for files
      parentId: a.string(), // for hierarchical structuring
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
