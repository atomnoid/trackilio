"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SpinnerIcon, CheckIcon } from "@/components/icons/Icons";

interface ListInviteAcceptProps {
  token: string;
  isLoggedIn: boolean;
  listTitle: string;
}

export function ListInviteAccept({ token, isLoggedIn, listTitle }: ListInviteAcceptProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoggedIn) {
    return (
      <div className="space-y-3">
        <p className="text-xs text-[#6B6862] font-medium">Log in to join this travel list.</p>
        <a
          href={`/auth/login?redirect=/l/invite/${token}`}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5841] to-[#C53678] text-white font-extrabold px-6 py-3.5 text-sm shadow-sm hover:opacity-90 transition-all"
        >
          Log in to Join
        </a>
        <a
          href={`/auth/signup?redirect=/l/invite/${token}`}
          className="w-full inline-flex items-center justify-center rounded-2xl bg-[#FAF3E1] border border-[#E8DECA] text-[#222222] font-bold px-6 py-3 text-sm hover:bg-[#F5E7C6] transition-all"
        >
          Sign up — it is free!
        </a>
      </div>
    );
  }

  const handleAccept = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/members/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Failed to join list.");
        setLoading(false);
        return;
      }
      if (data.listSlug) router.push(`/l/${data.listSlug}`);
      else router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">{error}</p>
      )}
      <button
        onClick={handleAccept}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF5841] to-[#C53678] hover:opacity-95 disabled:opacity-60 text-white font-extrabold px-6 py-3.5 text-sm shadow-sm transition-all active-press"
      >
        {loading ? (
          <><SpinnerIcon className="h-4 w-4 animate-spin" /><span>Joining list...</span></>
        ) : (
          <><CheckIcon className="h-4 w-4" /><span>Join {listTitle}</span></>
        )}
      </button>
    </div>
  );
}