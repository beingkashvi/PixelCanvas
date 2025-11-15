// app/signup/page.tsx
"use client";

import React from "react";
import AuthForm from "../../components/AuthForm";

export default function SignupPage() {
  return (
    <main style={{ maxWidth: 720, margin: "48px auto", padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>Create an account</h1>
      <AuthForm mode="signup" />
    </main>
  );
}
