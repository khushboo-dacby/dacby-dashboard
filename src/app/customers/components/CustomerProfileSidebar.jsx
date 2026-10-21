"use client";

import { useState } from "react";
import { BadgeCheck, Check, Copy, Hash, Mail, MessageCircle, Phone } from "lucide-react";

export default function CustomerProfileSidebar({ userData = {}, docId = "" }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const name = userData?.name || "Customer Profile";
  const email = userData?.email || "";
  const phone = userData?.phone_number ? String(userData.phone_number) : "";
  const profilePic = userData?.profile_pic;
  const isVendor = Boolean(
    userData?.vendor === true ||
      userData?.vendor === "true" ||
      userData?.role === "vendor"
  );

  const copyValue = (value, key) => {
    if (!value) return;
    navigator.clipboard.writeText(String(value));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <section className="rounded-2xl border border-[#DCE5F1] bg-white p-4 shadow-xs text-[#151D35] sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-center gap-4">
          <div className="relative h-20 w-20 shrink-0 rounded-full bg-[#DCE5F1] p-1">
            {profilePic ? (
              <img
                src={profilePic}
                alt={name}
                className="h-full w-full rounded-full border-2 border-white object-cover shadow-sm"
                onError={(event) => {
                  event.target.style.display = "none";
                  event.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`h-full w-full items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#102449] to-[#2A67EC] text-2xl font-bold text-white shadow-sm ${
                profilePic ? "hidden" : "flex"
              }`}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-2xl font-bold tracking-tight text-[#151D35]">
                {name}
              </h1>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                  isVendor
                    ? "bg-[#FFF8E9] text-[#A95D06]"
                    : "bg-[#F2F5FA] text-[#53647F]"
                }`}
              >
                {isVendor && <BadgeCheck className="h-3.5 w-3.5" />}
                {isVendor ? "Vendor" : "Customer"}
              </span>
              {userData?.source && (
                <span className="rounded-full border border-[#D5DCE8] bg-[#F8FAFC] px-3 py-1 text-sm font-semibold text-[#53647F]">
                  {userData.source}
                </span>
              )}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-[#53647F]">
              {email && (
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-5 w-5 shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-[#2A67EC]">
                    {email}
                  </a>
                  <button type="button" onClick={() => copyValue(email, "email")} title="Copy email" className="hover:text-[#2A67EC]">
                    {copiedKey === "email" ? <Check className="h-4 w-4 text-[#16B879]" /> : <Copy className="h-4 w-4" />}
                  </button>
                </span>
              )}
              {phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-5 w-5 shrink-0" />
                  <a href={`tel:${phone}`} className="hover:text-[#2A67EC]">{phone}</a>
                  <button type="button" onClick={() => copyValue(phone, "phone")} title="Copy phone number" className="hover:text-[#2A67EC]">
                    {copiedKey === "phone" ? <Check className="h-4 w-4 text-[#16B879]" /> : <Copy className="h-4 w-4" />}
                  </button>
                </span>
              )}
              {docId && (
                <span className="inline-flex min-w-0 items-center gap-1.5">
                  <Hash className="h-5 w-5 shrink-0" />
                  <span className="max-w-[220px] truncate font-mono">{docId}</span>
                  <button type="button" onClick={() => copyValue(docId, "docId")} title="Copy customer document ID" className="hover:text-[#2A67EC]">
                    {copiedKey === "docId" ? <Check className="h-4 w-4 text-[#16B879]" /> : <Copy className="h-4 w-4" />}
                  </button>
                </span>
              )}
              {phone && (
                <a
                  href={`https://wa.me/91${phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#157348] hover:text-[#0E9F60]"
                  title="Chat on WhatsApp"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
