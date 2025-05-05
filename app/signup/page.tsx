// app/signup/page.tsx
"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

export default function SignUpPage() {
  return (
    <Authenticator initialState="signUp">
      {({ signOut, user }) => (
        <main>
          <h1>Thanks for signing up, {user?.username}</h1>
          <button onClick={signOut}>Sign Out</button>
        </main>
      )}
    </Authenticator>
  );
}
