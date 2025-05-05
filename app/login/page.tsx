// app/login/page.tsx
"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

export default function LoginPage() {
  return (
    <Authenticator initialState="signIn">
      {({ signOut, user }) => (
        <main>
          {/* you won’t hit this until after sign-in */}
          <h1>Welcome, {user?.username}</h1>
          <button onClick={signOut}>Sign Out</button>
        </main>
      )}
    </Authenticator>
  );
}
