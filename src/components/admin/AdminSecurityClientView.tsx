"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  Lock,
  Unlock,
  AlertTriangle,
  RefreshCw,
  Clock,
  Globe,
  UserCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronRight,
  Shield,
  Fingerprint
} from "lucide-react";
import toast from "react-hot-toast";

interface SecurityLog {
  id: string;
  timestamp: string;
  ip: string;
  username: string;
  action: string;
  details: string;
  location?: string;
  attemptedPassword?: string;
  attemptedPin?: string;
  userAgent?: string;
}

interface SecurityConfigData {
  emergencyLockdown: boolean;
  lockdownReason?: string;
  failedAttemptLimit: number;
  lockoutMinutes: number;
  masterPinMasked: string;
}

export default function AdminSecurityClientView() {
  const [config, setConfig] = useState<SecurityConfigData | null>(null);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Pin change form
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [savingPin, setSavingPin] = useState(false);

  // Lockdown toggle state
  const [togglingLockdown, setTogglingLockdown] = useState(false);
  const [clearingLockouts, setClearingLockouts] = useState(false);

  // Owner Code Shield Authentication
  const [ownerKeyInput, setOwnerKeyInput] = useState("");
  const [isOwnerAuthorized, setIsOwnerAuthorized] = useState(false);
  const [verifyingOwner, setVerifyingOwner] = useState(false);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/security");
      if (!res.ok) throw new Error("Failed to load security settings");
      const data = await res.json();
      setConfig(data.config);
      setLogs(data.logs || []);
    } catch (err: any) {
      toast.error(err.message || "Could not fetch security data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const handleToggleLockdown = async () => {
    const isActivating = !config?.emergencyLockdown;
    const confirmMsg = isActivating
      ? "Are you sure you want to ACTIVATE EMERGENCY LOCKDOWN? Nobody will be able to log in until you turn this off."
      : "Are you sure you want to deactivate Emergency Lockdown and allow admin logins again?";

    if (!window.confirm(confirmMsg)) return;

    setTogglingLockdown(true);
    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "TOGGLE_LOCKDOWN" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");

      toast.success(data.message, { icon: isActivating ? "🚨" : "✅", duration: 4000 });
      fetchSecurityData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update lockdown status");
    } finally {
      setTogglingLockdown(false);
    }
  };

  const handleClearLockouts = async () => {
    setClearingLockouts(true);
    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CLEAR_LOCKOUTS" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");

      toast.success("All locked devices and IP addresses have been cleared!", { icon: "🔓" });
      fetchSecurityData();
    } catch (err: any) {
      toast.error(err.message || "Failed to clear lockouts");
    } finally {
      setClearingLockouts(false);
    }
  };

  const handleVerifyOwnerKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerKeyInput.trim()) {
      toast.error("Please enter the Owner Authorization Password");
      return;
    }

    setVerifyingOwner(true);
    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "VERIFY_OWNER_KEY",
          ownerKey: ownerKeyInput.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Owner authentication failed");

      setIsOwnerAuthorized(true);
      toast.success("Owner Master Password verified! System & code modifications authorized.", {
        icon: "👑",
        duration: 4000,
      });
      fetchSecurityData();
    } catch (err: any) {
      toast.error(err.message || "Invalid Owner Password", { icon: "⛔" });
    } finally {
      setVerifyingOwner(false);
    }
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPin || !newPin) {
      toast.error("Please enter both current PIN and new PIN");
      return;
    }
    if (newPin !== confirmPin) {
      toast.error("New PIN and Confirm PIN do not match");
      return;
    }
    if (newPin.trim().length < 4) {
      toast.error("PIN must be at least 4 digits");
      return;
    }

    setSavingPin(true);
    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CHANGE_PIN",
          currentPin: currentPin.trim(),
          newPin: newPin.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update PIN");

      toast.success("Master Security PIN changed successfully!", { icon: "🔐" });
      setCurrentPin("");
      setNewPin("");
      setConfirmPin("");
      fetchSecurityData();
    } catch (err: any) {
      toast.error(err.message || "PIN update failed");
    } finally {
      setSavingPin(false);
    }
  };

  return (
    <div className="space-y-8 text-sand-950">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sand-300 pb-5 sm:pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Fortress 2FA Security
            </span>
            <span className="text-[10px] font-mono bg-brand-900 text-gold-300 px-2 py-0.5 rounded font-bold">
              SUPER ADMIN LEVEL
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950">
            Security & Portal Lockdown
          </h1>
          <p className="text-xs text-brand-600 mt-0.5">
            Keep your website completely safe. Control who can log in, view live login attempts, and use the Emergency Lockdown switch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSecurityData}
            disabled={loading}
            className="px-3.5 py-2.5 bg-white hover:bg-sand-50 border border-sand-300 text-brand-900 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-gold-700 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh Logs</span>
          </button>
        </div>
      </div>

      {/* Emergency Lockdown Notice Banner */}
      {config?.emergencyLockdown ? (
        <div className="p-6 rounded-3xl bg-rose-950 text-sand-50 border-2 border-rose-500 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-rose-600 text-white rounded-2xl shrink-0 mt-0.5 animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-rose-100">
                🚨 EMERGENCY LOCKDOWN IS CURRENTLY ACTIVE!
              </h2>
              <p className="text-xs text-rose-200 mt-0.5 max-w-xl">
                All login attempts from any device are currently <strong>completely blocked</strong>. The admin portal is totally sealed to prevent any outside access.
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleLockdown}
            disabled={togglingLockdown}
            className="px-5 py-3 rounded-xl bg-white text-rose-950 hover:bg-sand-100 font-bold text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95 shrink-0"
          >
            {togglingLockdown ? "Updating..." : "Turn Off Lockdown (Open Access)"}
          </button>
        </div>
      ) : null}

      {/* Real-Time Security Intrusion Alert Banner */}
      {(() => {
        const recentThreat = logs.find(
          (l) => l.action.startsWith("FAILED") || l.action === "IP_LOCKED_OUT"
        );
        if (!recentThreat) return null;
        return (
          <div className="p-5 rounded-3xl bg-amber-50 border-2 border-amber-400 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-amber-500 text-white rounded-2xl shrink-0 mt-0.5 shadow-sm">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-950 bg-amber-200 px-2 py-0.5 rounded font-mono">
                    ⚠️ Intrusion / Failed Attempt Alert
                  </span>
                  <span className="text-[11px] text-amber-800">
                    {new Date(recentThreat.timestamp).toLocaleString()}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-sm text-amber-950">
                  Someone attempted to log in from IP: <span className="font-mono underline">{recentThreat.ip}</span> ({recentThreat.location || "Pakistan"})
                </h3>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="bg-white px-2.5 py-1 rounded-lg border border-amber-300 font-mono text-amber-950 font-bold shadow-xs">
                    User: {recentThreat.username}
                  </span>
                  {recentThreat.attemptedPassword && (
                    <span className="bg-rose-100 text-rose-950 px-2.5 py-1 rounded-lg border border-rose-300 font-mono font-bold">
                      🔑 Password Tried: "{recentThreat.attemptedPassword}"
                    </span>
                  )}
                  {recentThreat.attemptedPin && (
                    <span className="bg-amber-100 text-amber-950 px-2.5 py-1 rounded-lg border border-amber-300 font-mono font-bold">
                      🔐 PIN Tried: "{recentThreat.attemptedPin}"
                    </span>
                  )}
                  <span className="bg-rose-600 text-white px-2.5 py-1 rounded-lg font-bold">
                    Status: {recentThreat.action === "IP_LOCKED_OUT" ? "🔒 LOCKED OUT (30 MIN)" : "REJECTED"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleToggleLockdown}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider shadow transition-colors"
              >
                🚨 Lock Down Portal
              </button>
            </div>
          </div>
        );
      })()}

      {/* Owner Code Shield & Website Encryption Vault */}
      <div className="bg-gradient-to-r from-brand-950 via-[#1C1A17] to-brand-950 text-sand-50 rounded-3xl border border-gold-500/40 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-800/80 pb-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-gold-500/20 text-gold-400 border border-gold-500/30 shrink-0">
              <Shield className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-sand-50">
                  Owner Code Shield &amp; Website Encryption Vault
                </h3>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                  isOwnerAuthorized
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                }`}>
                  {isOwnerAuthorized ? "👑 OWNER VERIFIED (Maham Naseem)" : "🔒 LOCKED BY OWNER PASSWORD"}
                </span>
              </div>
              <p className="text-xs text-sand-300 mt-1 max-w-2xl leading-relaxed">
                Source code protection is strictly enforced. Backend algorithms, payment keys, and database models are encrypted.
                Only the site owner (Maham Naseem) using the owner password can authorize code updates and security releases.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {isOwnerAuthorized ? (
              <span className="px-4 py-2 bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Code Modification Authorized</span>
              </span>
            ) : (
              <span className="px-3.5 py-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Locked by Owner Key</span>
              </span>
            )}
          </div>
        </div>

        {/* Verification Form */}
        {!isOwnerAuthorized && (
          <form onSubmit={handleVerifyOwnerKey} className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <input
                type="password"
                value={ownerKeyInput}
                onChange={(e) => setOwnerKeyInput(e.target.value)}
                placeholder="Enter Owner Authorization Password..."
                className="w-full px-4 py-2.5 bg-black/50 border border-sand-700 rounded-xl text-xs font-mono text-sand-100 placeholder-sand-500 focus:outline-none focus:border-gold-500"
              />
            </div>
            <button
              type="submit"
              disabled={verifyingOwner}
              className="px-6 py-2.5 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 hover:from-gold-500 hover:to-gold-400 text-brand-950 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 font-serif shrink-0 cursor-pointer"
            >
              {verifyingOwner ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-950" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 text-brand-950" />
                  <span>Authorize Code Shield</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Grid: Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Security Status */}
        <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-sand-500">Security Shield</span>
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-700 flex items-center gap-1.5">
              <span>Full Protection</span>
            </div>
            <p className="text-xs text-brand-600 mt-1">
              Protected with 2FA Master PIN, anti-brute force, and encrypted tokens.
            </p>
          </div>
        </div>

        {/* Card 2: Lockout Rules */}
        <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-sand-500">Anti-Hacking Lockout</span>
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-brand-950">
              3 Failed Attempts = 30 Min Lock
            </div>
            <p className="text-xs text-brand-600 mt-1">
              If someone enters the wrong password 3 times, their device is locked out for 30 minutes.
            </p>
          </div>
        </div>

        {/* Card 3: Master PIN */}
        <div className="bg-white p-5 rounded-3xl border border-sand-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-sand-500">Master Security PIN</span>
            <div className="p-2 bg-gold-100 text-gold-800 rounded-xl">
              <KeyRound className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold font-mono text-gold-700">
              {config?.masterPinMasked || "••••00"}
            </div>
            <p className="text-xs text-brand-600 mt-1">
              Required on login in addition to your username and password.
            </p>
          </div>
        </div>
      </div>

      {/* Middle Section: 1-Click Lockdown & Change PIN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Quick Actions (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Emergency Lockdown Action Card */}
          <div className="bg-white rounded-3xl border border-sand-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-sand-100 pb-3">
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-800">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-brand-950">
                  Emergency Master Lockdown
                </h3>
                <p className="text-xs text-brand-500">
                  Instantly shut down all login doors with 1 click if you suspect suspicious activity.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-brand-950 block">Current Status:</span>
                  <span className={`text-xs font-bold ${config?.emergencyLockdown ? "text-rose-600" : "text-emerald-700"}`}>
                    {config?.emergencyLockdown ? "🚨 LOCKED DOWN (No one can log in)" : "✅ NORMAL (Authorized logins allowed)"}
                  </span>
                </div>
                <button
                  onClick={handleToggleLockdown}
                  disabled={togglingLockdown}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm ${
                    config?.emergencyLockdown
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                      : "bg-rose-600 hover:bg-rose-500 text-white"
                  }`}
                >
                  {togglingLockdown ? (
                    "Processing..."
                  ) : config?.emergencyLockdown ? (
                    "🔓 Turn Off Lockdown"
                  ) : (
                    "🚨 Lock Down Portal Now"
                  )}
                </button>
              </div>
            </div>

            {/* Unblock Locked IPs */}
            <div className="pt-2 flex items-center justify-between border-t border-sand-100">
              <div>
                <h4 className="font-bold text-xs text-brand-950">Unblock Locked Devices</h4>
                <p className="text-[11px] text-brand-500">
                  Clear the lockout list if you or your device was accidentally locked out.
                </p>
              </div>
              <button
                onClick={handleClearLockouts}
                disabled={clearingLockouts}
                className="px-3 py-2 bg-sand-100 hover:bg-sand-200 text-brand-900 border border-sand-300 rounded-xl text-xs font-bold transition-colors"
              >
                {clearingLockouts ? "Clearing..." : "Reset All Lockouts"}
              </button>
            </div>
          </div>

          {/* Change Master PIN Card */}
          <div className="bg-white rounded-3xl border border-sand-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-sand-100 pb-3">
              <div className="p-2.5 rounded-xl bg-gold-100 text-gold-800">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-brand-950">
                  Change Master Security PIN
                </h3>
                <p className="text-xs text-brand-500">
                  Update the 6-digit security code needed to log into the admin portal.
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-brand-800 mb-1">
                  Current Master PIN
                </label>
                <input
                  type="password"
                  required
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  placeholder="Enter current PIN (default: 786000)"
                  className="w-full px-3.5 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-xs font-mono text-brand-950 focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-brand-800 mb-1">
                    New PIN (At least 4 digits)
                  </label>
                  <input
                    type="password"
                    required
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="e.g. 786000"
                    className="w-full px-3.5 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-xs font-mono text-brand-950 focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-brand-800 mb-1">
                    Confirm New PIN
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="Repeat new PIN"
                    className="w-full px-3.5 py-2.5 bg-sand-50 border border-sand-300 rounded-xl text-xs font-mono text-brand-950 focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={savingPin}
                className="w-full py-3 bg-brand-950 hover:bg-black text-sand-100 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
              >
                {savingPin ? "Updating PIN..." : "Save New Master PIN"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Security Audit Trail (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl border border-sand-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-sand-100 pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-brand-950 flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-gold-700" />
                  <span>Live Security Audit Logs</span>
                </h3>
                <p className="text-xs text-brand-500">
                  Every login attempt, successful or failed, is recorded here with timestamp & IP.
                </p>
              </div>
              <span className="text-xs text-brand-500 font-mono bg-sand-100 px-2 py-1 rounded-lg">
                {logs.length} Entries
              </span>
            </div>

            {/* Log Entries List */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {logs.length === 0 ? (
                <div className="p-8 text-center text-sand-400 text-xs">
                  No security incidents recorded yet. All systems secure.
                </div>
              ) : (
                logs.map((log) => {
                  const isSuccess = log.action === "LOGIN_SUCCESS";
                  const isLockout = log.action === "IP_LOCKED_OUT";
                  const isFail = log.action.startsWith("FAILED");
                  const isLockdown = log.action.includes("LOCKDOWN");

                  return (
                    <div
                      key={log.id}
                      className={`p-3.5 rounded-2xl border text-xs flex items-start gap-3 transition-colors ${
                        isSuccess
                          ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                          : isLockout
                          ? "bg-rose-100 border-rose-300 text-rose-950"
                          : isFail
                          ? "bg-amber-50 border-amber-200 text-amber-950"
                          : "bg-sand-50 border-sand-200 text-brand-950"
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isSuccess ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : isLockout ? (
                          <ShieldAlert className="w-4 h-4 text-rose-600" />
                        ) : isFail ? (
                          <XCircle className="w-4 h-4 text-amber-600" />
                        ) : (
                          <Shield className="w-4 h-4 text-brand-600" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <span className="font-bold font-mono text-[11px] truncate">
                            {log.action.replace(/_/g, " ")}
                          </span>
                          <span className="text-[10px] text-sand-500 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-[11px] leading-snug">{log.details}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5 pt-1.5 border-t border-black/5 text-[10px] font-mono">
                          <span className="bg-sand-100 text-brand-900 px-1.5 py-0.5 rounded font-bold">
                            IP: {log.ip}
                          </span>
                          {log.location && (
                            <span className="bg-blue-50 text-blue-900 border border-blue-200 px-1.5 py-0.5 rounded font-bold">
                              📍 {log.location}
                            </span>
                          )}
                          <span className="text-sand-600">User: {log.username}</span>
                          {log.attemptedPassword && (
                            <span className="bg-rose-100 text-rose-950 border border-rose-300 px-2 py-0.5 rounded font-bold">
                              🔑 Password Tried: "{log.attemptedPassword}"
                            </span>
                          )}
                          {log.attemptedPin && (
                            <span className="bg-amber-100 text-amber-950 border border-amber-300 px-2 py-0.5 rounded font-bold">
                              🔐 PIN Tried: "{log.attemptedPin}"
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
