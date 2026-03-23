"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function WebinarEditor() {
  const params = useParams();
  const id = String(params.id);

  const [script, setScript] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(`webinar-script:${id}`);
    if (saved) {
      setScript(saved);
    }
  }, [id]);

  return (
    <div className="p-10 text-white max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Webinar Script</h1>

      {!script && (
        <p className="text-gray-400">
          No script found. Go back and generate one first.
        </p>
      )}

      {script && (
        <textarea
          value={script}
          readOnly
          className="w-full h-[500px] bg-black border border-white/10 p-4 rounded-xl"
        />
      )}
    </div>
  );
}
