"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-md p-10 shadow-2xl border border-purple-100">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-800" style={{ fontFamily: 'Comfortaa, sans-serif' }}>
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border-2 border-purple-200 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border-2 border-purple-200 bg-white px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-lg font-bold text-white shadow-xl transition-all hover:shadow-2xl hover:scale-105"
          >
            Login
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600">
          New customer?{' '}
          <Link href="/signup" className="font-semibold text-purple-600 hover:text-pink-600 transition-colors">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}