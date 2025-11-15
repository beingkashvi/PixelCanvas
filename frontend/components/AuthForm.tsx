"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { postJSON } from "../utils/api";

type Props = {
  mode: "login" | "signup";
};

export default function AuthForm({ mode }: Props) {
  const router = useRouter();

  // Common fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Signup-only fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (mode === "signup" && !firstName) {
      setError("Please enter your first name.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "login") {
        const res = await postJSON(
          "/api/auth/login",
          { email, password },
          { includeCredentials: true }
        );

        if (!res.ok) throw new Error(res.error || res.message || "Login failed.");
        setSuccess("Login successful!");
        setTimeout(() => router.push("/"), 700);

      } else {
        const body = {
          firstName,
          lastName,
          email,
          password,
        };

        const res = await postJSON(
          "/api/auth/signup",
          body,
          { includeCredentials: true }
        );

        if (!res.ok) throw new Error(res.error || res.message || "Signup failed.");
        setSuccess("Signup successful!");

        setTimeout(() => router.push("/"), 900);
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: 12,
        padding: 20,
        border: "1px solid #e6e6e6",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
      }}
    >
      {mode === "signup" && (
        <>
          <label style={{ display: "grid" }}>
            <span>First Name</span>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              required
              style={{ padding: 8, borderRadius: 6 }}
            />
          </label>

          <label style={{ display: "grid" }}>
            <span>Last Name</span>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              style={{ padding: 8, borderRadius: 6 }}
            />
          </label>
        </>
      )}

      <label style={{ display: "grid" }}>
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          style={{ padding: 8, borderRadius: 6 }}
        />
      </label>

      <label style={{ display: "grid" }}>
        <span>Password</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
          style={{ padding: 8, borderRadius: 6 }}
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "10px 14px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          background: "#0b66ff",
          color: "white",
          fontWeight: 700,
        }}
      >
        {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
      </button>

      {error && <div style={{ color: "crimson", fontSize: 14 }}>{error}</div>}
      {success && <div style={{ color: "green", fontSize: 14 }}>{success}</div>}
    </form>
  );
}
