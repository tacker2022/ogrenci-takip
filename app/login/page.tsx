"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../_lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Kayıt başarılı! Giriş yapabilirsiniz.");
        setIsSignUp(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center">
          {isSignUp ? "Kayıt Ol" : "Giriş Yap"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full rounded-md border border-black/[.1] dark:border-white/[.145] px-3 py-2 bg-transparent"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              required
              minLength={6}
              className="w-full rounded-md border border-black/[.1] dark:border-white/[.145] px-3 py-2 bg-transparent"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md border border-black/[.08] dark:border-white/[.145] px-4 py-2 hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] disabled:opacity-50"
          >
            {loading ? "Yükleniyor..." : isSignUp ? "Kayıt Ol" : "Giriş Yap"}
          </button>
        </form>
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-sm text-black/60 dark:text-white/60 hover:underline"
        >
          {isSignUp ? "Zaten hesabınız var mı? Giriş yapın" : "Hesabınız yok mu? Kayıt olun"}
        </button>
      </div>
    </main>
  );
}

