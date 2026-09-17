"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Mail,
  Save,
  CheckCircle2,
  X,
  Send,
  AlertCircle,
  HelpCircle,
  Phone,
  Key,
  Globe,
  Sliders,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminOrderNotificationConfigModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"WHATSAPP" | "EMAIL">("WHATSAPP");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // WhatsApp Config States
  const [waEnabled, setWaEnabled] = useState(true);
  const [waProvider, setWaProvider] = useState<"META_CLOUD_API" | "ULTRAMSG" | "TWILIO" | "CUSTOM_WEBHOOK">("META_CLOUD_API");
  const [waApiUrl, setWaApiUrl] = useState("https://graph.facebook.com/v18.0");
  const [waApiKeyToken, setWaApiKeyToken] = useState("");
  const [waPhoneNumberId, setWaPhoneNumberId] = useState("");
  const [waSenderNumber, setWaSenderNumber] = useState("0340 0262732");
  const [waTemplate, setWaTemplate] = useState("");

  // Business Email Config States (Editable - will provide later)
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smtpHost, setSmtpHost] = useState("mail.tauheedtextile.com");
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState("orders@tauheedtextile.com");
  const [smtpPass, setSmtpPass] = useState("");
  const [senderEmail, setSenderEmail] = useState("orders@tauheedtextile.com");
  const [senderName, setSenderName] = useState("Tauheed Textile Orders");
  const [subjectTemplate, setSubjectTemplate] = useState("Order Confirmation #{order_number} — Tauheed Textile");

  // Test states
  const [testPhone, setTestPhone] = useState("03400262732");
  const [testEmail, setTestEmail] = useState("care@tauheedtextile.com");
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchConfig = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/notifications/config");
        const data = await res.json();
        if (data.whatsappConfig) {
          setWaEnabled(data.whatsappConfig.enabled ?? true);
          setWaProvider(data.whatsappConfig.provider || "META_CLOUD_API");
          setWaApiUrl(data.whatsappConfig.apiUrl || "https://graph.facebook.com/v18.0");
          setWaApiKeyToken(data.whatsappConfig.apiKeyToken || "");
          setWaPhoneNumberId(data.whatsappConfig.phoneNumberId || "");
          setWaSenderNumber(data.whatsappConfig.senderNumber || "0340 0262732");
          setWaTemplate(data.whatsappConfig.messageTemplate || "");
        }
        if (data.emailConfig) {
          setEmailEnabled(data.emailConfig.enabled ?? false);
          setSmtpHost(data.emailConfig.smtpHost || "mail.tauheedtextile.com");
          setSmtpPort(data.emailConfig.smtpPort || 587);
          setSmtpUser(data.emailConfig.smtpUser || "orders@tauheedtextile.com");
          setSmtpPass(data.emailConfig.smtpPass || "");
          setSenderEmail(data.emailConfig.senderEmail || "orders@tauheedtextile.com");
          setSenderName(data.emailConfig.senderName || "Tauheed Textile Orders");
          setSubjectTemplate(data.emailConfig.subjectTemplate || "");
        }
      } catch (err) {
        console.error("Failed to load config:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [isOpen]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        whatsappConfig: {
          enabled: waEnabled,
          provider: waProvider,
          apiUrl: waApiUrl.trim(),
          apiKeyToken: waApiKeyToken.trim(),
          phoneNumberId: waPhoneNumberId.trim(),
          senderNumber: waSenderNumber.trim(),
          messageTemplate: waTemplate,
        },
        emailConfig: {
          enabled: emailEnabled,
          smtpHost: smtpHost.trim(),
          smtpPort: Number(smtpPort),
          smtpUser: smtpUser.trim(),
          smtpPass: smtpPass.trim(),
          senderEmail: senderEmail.trim(),
          senderName: senderName.trim(),
          subjectTemplate: subjectTemplate.trim(),
        },
      };

      const res = await fetch("/api/admin/notifications/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save configuration");

      toast.success("Order confirmation automation settings saved!");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleTestWhatsApp = async () => {
    setTesting(true);
    try {
      const res = await fetch("/api/admin/notifications/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "WHATSAPP", testPhone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to test WhatsApp");

      if (data.directUrl) {
        window.open(data.directUrl, "_blank");
      }
      toast.success("Test WhatsApp message generated!");
    } catch (err: any) {
      toast.error(err.message || "Test failed");
    } finally {
      setTesting(false);
    }
  };

  const handleTestEmail = async () => {
    setTesting(true);
    try {
      const res = await fetch("/api/admin/notifications/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "EMAIL", testEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to test email");

      toast.success(data.message || "Email test completed");
    } catch (err: any) {
      toast.error(err.message || "Test failed");
    } finally {
      setTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-sand-300 shadow-2xl overflow-hidden animate-scaleUp flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-sand-200 bg-sand-50/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-gold-700">
                Order Notifications
              </span>
              <h2 className="font-serif text-lg font-bold text-brand-950">
                Automatic Order Confirmation API Hub
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-brand-400 hover:text-brand-950 rounded-xl hover:bg-sand-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-sand-200 bg-white px-6 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab("WHATSAPP")}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "WHATSAPP"
                ? "border-[#128C7E] text-[#128C7E]"
                : "border-transparent text-sand-500 hover:text-brand-900"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Automatic WhatsApp API</span>
          </button>

          <button
            onClick={() => setActiveTab("EMAIL")}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "EMAIL"
                ? "border-gold-600 text-gold-700"
                : "border-transparent text-sand-500 hover:text-brand-900"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Business Email (Editable Option)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {loading ? (
            <div className="p-10 text-center text-brand-500">Loading configurations...</div>
          ) : activeTab === "WHATSAPP" ? (
            /* WHATSAPP CONFIG TAB */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-950 text-xs">
                    Automatic WhatsApp Order Confirmation is Active
                  </h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Whenever a customer places an order on Tauheed Textile, a pre-filled or API-dispatched confirmation is instantly triggered with item details, total amount, and live tracking link.
                  </p>
                </div>
              </div>

              {/* Provider Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-900 mb-1">
                    API Provider / Protocol
                  </label>
                  <select
                    value={waProvider}
                    onChange={(e) => setWaProvider(e.target.value as any)}
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs font-bold text-brand-950 focus:outline-none focus:border-gold-600"
                  >
                    <option value="META_CLOUD_API">Meta WhatsApp Cloud API (Official)</option>
                    <option value="ULTRAMSG">UltraMsg WhatsApp Gateway</option>
                    <option value="TWILIO">Twilio for WhatsApp</option>
                    <option value="CUSTOM_WEBHOOK">Custom Pakistani SMS/WA Gateway Webhook</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-brand-900 mb-1">
                    Business WhatsApp Helpline Number
                  </label>
                  <input
                    type="text"
                    value={waSenderNumber}
                    onChange={(e) => setWaSenderNumber(e.target.value)}
                    placeholder="0340 0262732"
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl font-mono text-brand-950 focus:outline-none focus:border-gold-600"
                  />
                </div>
              </div>

              {/* Endpoint & Phone ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-900 mb-1">
                    API Base Endpoint URL
                  </label>
                  <input
                    type="text"
                    value={waApiUrl}
                    onChange={(e) => setWaApiUrl(e.target.value)}
                    placeholder="https://graph.facebook.com/v18.0"
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl font-mono text-brand-950 focus:outline-none focus:border-gold-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-900 mb-1">
                    Phone Number ID / Instance ID
                  </label>
                  <input
                    type="text"
                    value={waPhoneNumberId}
                    onChange={(e) => setWaPhoneNumberId(e.target.value)}
                    placeholder="e.g. 109847291837482"
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl font-mono text-brand-950 focus:outline-none focus:border-gold-600"
                  />
                </div>
              </div>

              {/* API Key / Token */}
              <div>
                <label className="block font-semibold text-brand-900 mb-1">
                  API Key / Permanent Access Token
                </label>
                <input
                  type="password"
                  value={waApiKeyToken}
                  onChange={(e) => setWaApiKeyToken(e.target.value)}
                  placeholder="Paste your WhatsApp Cloud API or UltraMsg token here..."
                  className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl font-mono text-brand-950 focus:outline-none focus:border-gold-600"
                />
                <span className="text-[10px] text-brand-500 mt-0.5 block">
                  * Even without an API token, Tauheed Textile automatically generates 1-click WhatsApp confirmation links directly to customers.
                </span>
              </div>

              {/* Editable Message Template */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-brand-900">
                    Editable Confirmation Message Template
                  </label>
                  <span className="text-[10px] text-gold-700 font-mono">
                    Available tags: &#123;customer_name&#125;, &#123;order_number&#125;, &#123;total_amount&#125;, &#123;items_list&#125;, &#123;delivery_address&#125;, &#123;delivery_city&#125;, &#123;payment_method&#125;, &#123;tracking_link&#125;
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={waTemplate}
                  onChange={(e) => setWaTemplate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-sand-50 border border-sand-300 rounded-xl font-mono text-xs text-brand-950 focus:outline-none focus:border-gold-600 leading-relaxed"
                />
              </div>

              {/* Test WhatsApp Button */}
              <div className="pt-2 border-t border-sand-200 flex items-center justify-between gap-3 bg-sand-50/50 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brand-900">Test Number:</span>
                  <input
                    type="text"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="03400262732"
                    className="px-2.5 py-1 bg-white border border-sand-300 rounded-lg font-mono text-xs w-36"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleTestWhatsApp}
                  disabled={testing}
                  className="px-4 py-2 bg-[#128C7E] hover:bg-[#075E54] text-white font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{testing ? "Testing..." : "Send Test WhatsApp"}</span>
                </button>
              </div>
            </div>
          ) : (
            /* BUSINESS EMAIL TAB (EDITABLE OPTION - WILL PROVIDE LATER) */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-950 text-xs">
                    Business Email Integration (Editable Option — Provide Later)
                  </h4>
                  <p className="text-[11px] text-amber-900 mt-0.5">
                    As requested, this business email confirmation section is fully editable. You can enter your official business email domain (e.g. <code>orders@tauheedtextile.com</code>) and SMTP details now or update them later at any time.
                  </p>
                </div>
              </div>

              {/* Email Status Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-sand-50 border border-sand-200">
                <div>
                  <span className="font-bold text-brand-950 block">Activate Email Dispatch</span>
                  <span className="text-[11px] text-brand-500 block">
                    Turn on once your business email domain and password are ready
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailEnabled(!emailEnabled)}
                  className={`px-4 py-1.5 rounded-full font-bold text-xs transition-colors ${
                    emailEnabled
                      ? "bg-emerald-700 text-white"
                      : "bg-sand-300 text-brand-800"
                  }`}
                >
                  {emailEnabled ? "Active" : "Disabled (Waiting for Credentials)"}
                </button>
              </div>

              {/* SMTP Host & Port */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-900 mb-1">
                    SMTP Host / Server
                  </label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    placeholder="mail.tauheedtextile.com"
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl font-mono text-brand-950 focus:outline-none focus:border-gold-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-900 mb-1">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(Number(e.target.value) || 587)}
                    placeholder="587 or 465"
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl font-mono text-brand-950 focus:outline-none focus:border-gold-600"
                  />
                </div>
              </div>

              {/* Username & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-900 mb-1">
                    SMTP Username / Email
                  </label>
                  <input
                    type="text"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    placeholder="orders@tauheedtextile.com"
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl font-mono text-brand-950 focus:outline-none focus:border-gold-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-900 mb-1">
                    SMTP Password (Will Provide Later)
                  </label>
                  <input
                    type="password"
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl font-mono text-brand-950 focus:outline-none focus:border-gold-600"
                  />
                </div>
              </div>

              {/* Sender Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-900 mb-1">
                    Sender Display Name
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Tauheed Textile Orders"
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-brand-950 focus:outline-none focus:border-gold-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-900 mb-1">
                    Sender From Email
                  </label>
                  <input
                    type="email"
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    placeholder="orders@tauheedtextile.com"
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl font-mono text-brand-950 focus:outline-none focus:border-gold-600"
                  />
                </div>
              </div>

              {/* Subject Template */}
              <div>
                <label className="block font-semibold text-brand-900 mb-1">
                  Email Subject Line Template
                </label>
                <input
                  type="text"
                  value={subjectTemplate}
                  onChange={(e) => setSubjectTemplate(e.target.value)}
                  placeholder="Order Confirmation #{order_number} — Tauheed Textile"
                  className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-brand-950 focus:outline-none focus:border-gold-600"
                />
              </div>

              {/* Test Email Row */}
              <div className="pt-2 border-t border-sand-200 flex items-center justify-between gap-3 bg-sand-50/50 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brand-900">Test Recipient:</span>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="care@tauheedtextile.com"
                    className="px-2.5 py-1 bg-white border border-sand-300 rounded-lg font-mono text-xs w-48"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleTestEmail}
                  disabled={testing}
                  className="px-4 py-2 bg-brand-950 hover:bg-black text-sand-100 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{testing ? "Testing..." : "Test Business Email"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-sand-200 bg-sand-50/50 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-brand-500">
            Changes will take effect immediately for all new store checkouts.
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-sand-300 text-brand-700 hover:bg-sand-100 font-bold uppercase tracking-wider text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-brand-950 hover:bg-black text-sand-100 font-bold uppercase tracking-wider text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-gold-400" />
              <span>{saving ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
