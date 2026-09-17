"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, User, KeyRound, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
          pin: pin.trim(),
          rememberMe,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.locked) {
          setIsLocked(true);
        }
        throw new Error(data.error || "Authentication failed.");
      }

      toast.success("Welcome back, Usama Naseem! Access granted.", {
        icon: "✨",
        duration: 3500,
      });

      // Smooth redirection
      router.push(redirectUrl);
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials. Please verify your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0A09] text-sand-100 flex flex-col justify-between relative overflow-hidden selection:bg-gold-500 selection:text-brand-950">
      {/* Ambient Gold Radial Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-b from-gold-600/15 via-gold-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-gold-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Return Link */}
      <header className="w-full max-w-6xl mx-auto p-6 flex items-center justify-between z-10">
        <Link
          href="/"
          className="text-xs text-sand-400 hover:text-gold-400 transition-colors flex items-center gap-1.5 group"
        >
          <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
          <span>Return to Boutique Website</span>
        </Link>
        <div className="flex items-center gap-2 text-[11px] text-sand-300 font-mono tracking-wider bg-brand-900/80 border border-sand-800 px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>FORTRESS 2FA SECURITY</span>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-md bg-brand-950/90 border border-gold-500/25 rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-xl space-y-7 relative">
          
          {/* Subtle Top Gold Accent Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

          {/* Brand Logo & Header */}
          <div className="text-center space-y-2.5">
            <Link
              href="/"
              className="inline-block relative w-16 h-16 mx-auto drop-shadow-[0_4px_16px_rgba(197,160,89,0.35)] cursor-pointer hover:scale-105 transition-transform"
              title="Return to Original Website"
            >
              <Image
                src="/logo-calligraphy.png"
                alt="Tauheed Textile Calligraphy"
                fill
                className="object-contain"
                priority
              />
            </Link>
            <div>
              <Link href="/" title="Return to Original Website" className="hover:opacity-90 transition-opacity">
                <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-sand-50 uppercase hover:text-gold-300 transition-colors">
                  Tauheed Textile
                </h1>
              </Link>
              <p className="text-[10px] text-gold-400 font-sans tracking-[0.25em] uppercase font-semibold mt-0.5">
                Admin Management Portal
              </p>
            </div>
            <p className="text-xs text-sand-400 max-w-xs mx-auto leading-relaxed pt-0.5">
              Secure access for <strong className="text-sand-200">Usama Naseem</strong>. Please enter your username, password, and Master Security PIN.
            </p>
          </div>

          {/* Error / Lockout Alert */}
          {errorMsg && (
            <div className={`p-4 rounded-2xl border text-xs flex items-start gap-2.5 animate-shake ${
              isLocked
                ? "bg-rose-950/80 border-rose-500 text-rose-200"
                : "bg-rose-950/50 border-rose-700/50 text-rose-200"
            }`}>
              {isLocked ? (
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed">
                <strong className="block font-semibold mb-0.5">
                  {isLocked ? "SECURITY LOCKOUT TRIGGERED" : "Login Issue"}
                </strong>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Username Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-sand-300">
                Admin Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sand-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-4 py-3 bg-brand-900/80 border border-sand-800 rounded-xl text-sand-100 placeholder-sand-600 text-xs focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all font-mono"
                />
              </div>
            </div>

            {/* 2. Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-sand-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sand-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-3 bg-brand-900/80 border border-sand-800 rounded-xl text-sand-100 placeholder-sand-600 text-xs focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-sand-500 hover:text-gold-400 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 3. 2FA Master Security PIN */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-gold-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-gold-400" />
                  <span>Master Security PIN (2FA)</span>
                </label>
                <span className="text-[10px] text-sand-400 font-mono">6 Digits</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gold-500/70">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPin ? "text" : "password"}
                  required
                  maxLength={10}
                  autoComplete="one-time-code"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter 6-digit Master PIN (e.g. 786000)"
                  className="w-full pl-10 pr-11 py-3 bg-brand-900/80 border border-gold-500/40 rounded-xl text-gold-200 placeholder-sand-600 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-all font-mono tracking-widest text-center sm:text-left"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-sand-500 hover:text-gold-400 transition-colors"
                  aria-label={showPin ? "Hide PIN" : "Show PIN"}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-sand-400">
                Default Master PIN: <code className="bg-sand-900 text-gold-300 px-1 py-0.5 rounded font-mono font-bold">786000</code>
              </p>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-sand-700 bg-brand-900 text-gold-500 focus:ring-gold-500 focus:ring-offset-0 transition-colors cursor-pointer accent-gold-500"
                />
                <span className="text-xs text-sand-400 group-hover:text-sand-200 transition-colors">
                  Remember this device (30 days)
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isLocked}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-400 text-brand-950 font-bold text-xs uppercase tracking-widest shadow-lg shadow-gold-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-brand-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials & PIN...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-brand-950" />
                  <span>Unlock Admin Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-950" />
                </>
              )}
            </button>
          </form>

          {/* Security Features Info */}
          <div className="pt-4 border-t border-sand-900/80 space-y-1.5 text-center">
            <p className="text-[10px] text-sand-400 flex items-center justify-center gap-1.5">
              <span>🛡️</span>
              <span>Fortress Multi-Factor Protection • 3-Strike Lockout Active</span>
            </p>
            <p className="text-[9px] text-sand-500">
              Only authorized administrator (Usama Naseem) is permitted.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-4 text-center text-[10px] text-sand-600 z-10">
        © {new Date().getFullYear()} Tauheed Textile. All management activities are recorded in high-security audit logs.
      </footer>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0A09] flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-gold-400 font-mono tracking-widest uppercase">
            Loading Admin Security Gateway...
          </span>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
