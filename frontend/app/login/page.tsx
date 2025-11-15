// app/login/page.tsx
"use client";

import React from "react";
import AuthForm from "../../components/AuthForm";

export default function LoginPage() {
  return (
    <main style={{ maxWidth: 720, margin: "48px auto", padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>Login</h1>
      <AuthForm mode="login" />
    </main>
  );
}
