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

  // Business Email Config States (Configured for usama.buisness.usama@gmail.com)
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [emailProvider, setEmailProvider] = useState<"RESEND_API" | "GMAIL_SMTP" | "BREVO_API" | "CUSTOM_SMTP">("RESEND_API");
  const [resendApiKey, setResendApiKey] = useState("");
  const [brevoApiKey, setBrevoApiKey] = useState("");
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState(465);
  const [smtpUser, setSmtpUser] = useState("usama.buisness.usama@gmail.com");
  const [smtpPass, setSmtpPass] = useState("");
  const [senderEmail, setSenderEmail] = useState("usama.buisness.usama@gmail.com");
  const [senderName, setSenderName] = useState("Tauheed Textile Orders");
  const [subjectTemplate, setSubjectTemplate] = useState("🚨 NEW ORDER #{order_number} — Tauheed Textile");

  // Test states
  const [testPhone, setTestPhone] = useState("03400262732");
  const [testEmail, setTestEmail] = useState("usama.buisness.usama@gmail.com");
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
          setEmailEnabled(data.emailConfig.enabled ?? true);
          setEmailProvider(data.emailConfig.provider || (data.emailConfig.resendApiKey ? "RESEND_API" : "GMAIL_SMTP"));
          setResendApiKey(data.emailConfig.resendApiKey || "");
          setBrevoApiKey(data.emailConfig.brevoApiKey || "");
          setNotifyCustomer(data.emailConfig.notifyCustomer ?? true);
          setSmtpHost(data.emailConfig.smtpHost || "smtp.gmail.com");
          setSmtpPort(data.emailConfig.smtpPort || 465);
          setSmtpUser(data.emailConfig.smtpUser || "usama.buisness.usama@gmail.com");
          setSmtpPass(data.emailConfig.smtpPass || "");
          setSenderEmail(data.emailConfig.senderEmail || "usama.buisness.usama@gmail.com");
          setSenderName(data.emailConfig.senderName || "Tauheed Textile Orders");
          setSubjectTemplate(data.emailConfig.subjectTemplate || "🚨 NEW ORDER #{order_number} — Tauheed Textile");
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
          provider: emailProvider,
          resendApiKey: resendApiKey.trim(),
          brevoApiKey: brevoApiKey.trim(),
          notifyCustomer,
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
            /* BUSINESS EMAIL TAB (FREE AUTOMATION APIS) */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-950 text-xs">
                    Automated Order Email Notification & Customer Receipts
                  </h4>
                  <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed">
                    Instantly emails full order details, customer shipping address, phone number for courier dispatch, dress variants (Size, Color, Stitched), and payment receipts to <strong>usama.buisness.usama@gmail.com</strong>, plus an automated confirmation receipt to the customer!
                  </p>
                </div>
              </div>

              {/* Email Status Toggle & Customer Receipt Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-sand-50 border border-sand-200">
                  <div>
                    <span className="font-bold text-brand-950 text-xs block">Automated Dispatch Email</span>
                    <span className="text-[10px] text-brand-500 block">
                      Send order alerts to your Gmail
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailEnabled(!emailEnabled)}
                    className={`px-3 py-1.5 rounded-full font-bold text-xs transition-colors ${
                      emailEnabled
                        ? "bg-emerald-700 text-white"
                        : "bg-sand-300 text-brand-800"
                    }`}
                  >
                    {emailEnabled ? "Active" : "Disabled"}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-sand-50 border border-sand-200">
                  <div>
                    <span className="font-bold text-brand-950 text-xs block">Customer Receipt Email</span>
                    <span className="text-[10px] text-brand-500 block">
                      Auto-email receipt to buyer
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifyCustomer(!notifyCustomer)}
                    className={`px-3 py-1.5 rounded-full font-bold text-xs transition-colors ${
                      notifyCustomer
                        ? "bg-emerald-700 text-white"
                        : "bg-sand-300 text-brand-800"
                    }`}
                  >
                    {notifyCustomer ? "Enabled" : "Disabled"}
                  </button>
                </div>
              </div>

              {/* Free Email Provider Selector */}
              <div>
                <label className="block font-bold text-xs text-brand-900 mb-2">
                  Select Free Email Provider / API
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setEmailProvider("RESEND_API")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      emailProvider === "RESEND_API"
                        ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/20"
                        : "border-sand-300 bg-white hover:border-sand-400"
                    }`}
                  >
                    <span className="block text-xs font-bold text-brand-950">⚡ Resend API</span>
                    <span className="block text-[10px] text-emerald-800 font-medium mt-0.5">3,000 Free/Mo (Recommended)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEmailProvider("GMAIL_SMTP")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      emailProvider === "GMAIL_SMTP"
                        ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/20"
                        : "border-sand-300 bg-white hover:border-sand-400"
                    }`}
                  >
                    <span className="block text-xs font-bold text-brand-950">✉️ Gmail App Pass</span>
                    <span className="block text-[10px] text-brand-600 font-medium mt-0.5">500 Free/Day</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEmailProvider("BREVO_API")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      emailProvider === "BREVO_API"
                        ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/20"
                        : "border-sand-300 bg-white hover:border-sand-400"
                    }`}
                  >
                    <span className="block text-xs font-bold text-brand-950">📨 Brevo API</span>
                    <span className="block text-[10px] text-brand-600 font-medium mt-0.5">300 Free/Day</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEmailProvider("CUSTOM_SMTP")}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      emailProvider === "CUSTOM_SMTP"
                        ? "border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/20"
                        : "border-sand-300 bg-white hover:border-sand-400"
                    }`}
                  >
                    <span className="block text-xs font-bold text-brand-950">⚙️ Custom SMTP</span>
                    <span className="block text-[10px] text-brand-600 font-medium mt-0.5">Custom Server</span>
                  </button>
                </div>
              </div>

              {/* Provider 1: Resend REST API */}
              {emailProvider === "RESEND_API" && (
                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950">Resend API Configuration (100% Free)</span>
                    <a
                      href="https://resend.com/api-keys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-emerald-700 underline font-semibold hover:text-emerald-900"
                    >
                      Get Free API Key on resend.com ↗
                    </a>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-brand-900 mb-1">
                      Resend API Key (starts with re_...)
                    </label>
                    <input
                      type="password"
                      value={resendApiKey}
                      onChange={(e) => setResendApiKey(e.target.value)}
                      placeholder="re_123456789_abcdef..."
                      className="w-full px-3 py-2 bg-white border border-sand-300 rounded-xl font-mono text-xs text-brand-950 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <p className="text-[10px] text-brand-600 leading-relaxed">
                    💡 <strong>How to get free key:</strong> Visit <a href="https://resend.com" target="_blank" rel="noreferrer" className="underline font-bold">resend.com</a>, log in with Google, go to API Keys → Create API Key, and paste it here. No credit card required!
                  </p>
                </div>
              )}

              {/* Provider 2: Gmail SMTP App Password */}
              {emailProvider === "GMAIL_SMTP" && (
                <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-950">Gmail Free App Password (500 emails/day)</span>
                    <a
                      href="https://myaccount.google.com/apppasswords"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-blue-700 underline font-semibold hover:text-blue-900"
                    >
                      Generate 16-Letter App Password ↗
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-brand-900 mb-1">
                        Your Gmail Address
                      </label>
                      <input
                        type="email"
                        value={smtpUser}
                        onChange={(e) => setSmtpUser(e.target.value)}
                        placeholder="usama.buisness.usama@gmail.com"
                        className="w-full px-3 py-2 bg-white border border-sand-300 rounded-xl font-mono text-xs text-brand-950 focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-brand-900 mb-1">
                        16-Letter App Password
                      </label>
                      <input
                        type="password"
                        value={smtpPass}
                        onChange={(e) => setSmtpPass(e.target.value)}
                        placeholder="abcd efgh ijkl mnop"
                        className="w-full px-3 py-2 bg-white border border-sand-300 rounded-xl font-mono text-xs text-brand-950 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <p className="text-[10px] text-brand-600 leading-relaxed">
                    💡 <strong>30-Second Guide:</strong> Turn on 2-Step Verification in your Google Account, go to <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="underline font-bold">myaccount.google.com/apppasswords</a>, name it &quot;Tauheed Textile&quot;, and copy the generated 16-letter password here.
                  </p>
                </div>
              )}

              {/* Provider 3: Brevo API */}
              {emailProvider === "BREVO_API" && (
                <div className="p-4 bg-purple-50/50 border border-purple-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-950">Brevo API Configuration (300 Free/Day)</span>
                    <a
                      href="https://app.brevo.com/settings/keys/api"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-purple-700 underline font-semibold hover:text-purple-900"
                    >
                      Get Brevo Key ↗
                    </a>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-brand-900 mb-1">
                      Brevo API Key (starts with xkeysib-...)
                    </label>
                    <input
                      type="password"
                      value={brevoApiKey}
                      onChange={(e) => setBrevoApiKey(e.target.value)}
                      placeholder="xkeysib-12345..."
                      className="w-full px-3 py-2 bg-white border border-sand-300 rounded-xl font-mono text-xs text-brand-950 focus:outline-none focus:border-purple-600"
                    />
                  </div>
                </div>
              )}

              {/* Provider 4: Custom SMTP */}
              {emailProvider === "CUSTOM_SMTP" && (
                <div className="p-4 bg-sand-50 border border-sand-200 rounded-2xl space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-brand-900 mb-1">SMTP Host</label>
                      <input
                        type="text"
                        value={smtpHost}
                        onChange={(e) => setSmtpHost(e.target.value)}
                        placeholder="mail.tauheedtextile.com"
                        className="w-full px-3 py-2 bg-white border border-sand-300 rounded-xl font-mono text-xs text-brand-950"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-brand-900 mb-1">SMTP Port</label>
                      <input
                        type="number"
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(Number(e.target.value) || 465)}
                        placeholder="465"
                        className="w-full px-3 py-2 bg-white border border-sand-300 rounded-xl font-mono text-xs text-brand-950"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-brand-900 mb-1">Username / Email</label>
                      <input
                        type="text"
                        value={smtpUser}
                        onChange={(e) => setSmtpUser(e.target.value)}
                        placeholder="orders@tauheedtextile.com"
                        className="w-full px-3 py-2 bg-white border border-sand-300 rounded-xl font-mono text-xs text-brand-950"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-brand-900 mb-1">Password</label>
                      <input
                        type="password"
                        value={smtpPass}
                        onChange={(e) => setSmtpPass(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3 py-2 bg-white border border-sand-300 rounded-xl font-mono text-xs text-brand-950"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Target Notification Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-brand-900 mb-1">
                    Store Dispatch Receiver Gmail
                  </label>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="usama.buisness.usama@gmail.com"
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl font-mono text-xs text-brand-950 focus:outline-none focus:border-gold-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-brand-900 mb-1">
                    Sender Display Name
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Tauheed Textile Orders"
                    className="w-full px-3 py-2 bg-sand-50 border border-sand-300 rounded-xl text-xs text-brand-950 focus:outline-none focus:border-gold-600"
                  />
                </div>
              </div>

              {/* Test Email Row */}
              <div className="pt-2 border-t border-sand-200 flex items-center justify-between gap-3 bg-sand-50/50 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-brand-900">Send Test To:</span>
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="usama.buisness.usama@gmail.com"
                    className="px-2.5 py-1 bg-white border border-sand-300 rounded-lg font-mono text-xs w-48"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleTestEmail}
                  disabled={testing}
                  className="px-4 py-2 bg-brand-950 hover:bg-black text-sand-100 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{testing ? "Testing..." : "Send Test Order Email"}</span>
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
