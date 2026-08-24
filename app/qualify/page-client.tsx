"use client";
import { useSearchParams } from "next/navigation";
import { QualificationChat } from "@/components/leads/qualification-chat";
import { Suspense } from "react";

function QualifyContent() {
  const params = useSearchParams();
  const token = params?.get("token");
  const type = (params?.get("type") ?? "property") as "property" | "website";
  if (!token) return <p className="text-center text-gray-500 mt-20">Invalid qualification link.</p>;
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-2">Just a few quick questions</h1>
        <p className="text-gray-500 mb-8">Answer below to help us match you with the perfect property.</p>
        <QualificationChat sessionToken={token} leadType={type} />
      </div>
    </div>
  );
}

export default function QualifyPage() {
  return <Suspense><QualifyContent /></Suspense>;
}
