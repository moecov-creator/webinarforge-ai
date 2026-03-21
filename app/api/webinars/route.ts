"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewWebinarPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [niche, setNiche] = useState("");
  const [corePromise, setCorePromise] = useState("");
  const [cta, setCta] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/webinars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          niche,
          corePromise,
          cta,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Failed");
      }

      // ✅ SUCCESS → redirect
      router.push("/dashboard/webinars");

    } catch (err) {
      console.error(err);
      setError("Failed to save webinar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-6">Create Webinar</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 p-3 bg-black border border-gray-700 rounded"
      />

      <input
        placeholder="Niche"
        value={niche}
        onChange={(e) => setNiche(e.target.value)}
        className="w-full mb-4 p-3 bg-black border border-gray-700 rounded"
      />

      <input
        placeholder="Core Promise"
        value={corePromise}
        onChange={(e) => setCorePromise(e.target.value)}
        className="w-full mb-4 p-3 bg-black border border-gray-700 rounded"
      />

      <input
        placeholder="CTA"
        value={cta}
        onChange={(e) => setCta(e.target.value)}
        className="w-full mb-4 p-3 bg-black border border-gray-700 rounded"
      />

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-purple-600 px-6 py-3 rounded-lg"
      >
        {loading ? "Creating..." : "Create Webinar"}
      </button>
    </div>
  );
}
