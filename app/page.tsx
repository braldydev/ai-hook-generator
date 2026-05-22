"use client";

import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [hook, setHook] = useState("");
  const [loading, setLoading] = useState(false);

async function generateHook() {
  setLoading(true);

  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic }),
  });

  const data = await response.json();

  setHook(data.hook);

  setLoading(false);
}

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-bold mb-8">
        AI Hook Generator 🚀
      </h1>

      <input
        type="text"
        placeholder="Enter video topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full max-w-md p-4 rounded-2xl bg-white text-black text-lg mb-4 shadow-2xl"
      />

      <button
        onClick={generateHook}
  className="bg-white text-black px-8 py-3 rounded-2xl font-bold hover:scale-105 hover:bg-gray-300 transition cursor-pointer shadow-xl"
>
  {loading ? "Generating..." : "Generate Hooks"}
      </button>

      {hook && (
        <div className="bg-zinc-900 p-6 rounded-2xl mt-4 max-w-3xl">
  <pre className="whitespace-pre-wrap text-xl font-semibold text-left">
    {hook}
  </pre>

  <button
    onClick={() => navigator.clipboard.writeText(hook)}
    className="mt-4 bg-white text-black px-4 py-2 rounded-xl font-bold hover:bg-gray-300 transition cursor-pointer"
  >
    Copy Hooks 📋
  </button>
</div>
      )}
    </main>
  );
}