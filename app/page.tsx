"use client";

import { useEffect, useState } from "react";

type HistoryItem = {
  topic: string;
  style: string;
  hooks: string;
};

export default function Home() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("TikTok");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem("hook-history");

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("hook-history", JSON.stringify(history));
  }, [history]);

  async function generateHook() {
    if (cooldown || !topic.trim()) return;

    setCooldown(true);

    setTimeout(() => {
      setCooldown(false);
    }, 5000);

    setLoading(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic, style }),
    });

    const data = await response.json();

    setHistory((prev) => [
      {
        topic,
        style,
        hooks: data.hook,
      },
      ...prev,
    ]);

    setLoading(false);
  }

  const copyHooks = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);

    setCopiedIndex(index);

    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("hook-history");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white flex flex-col items-center p-6">
      <h1 className="text-5xl font-bold mb-8 text-center mt-10">
        AI Hook Generator 🚀
      </h1>

      <input
        type="text"
        placeholder="Enter video topic..."
        maxLength={100}
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            generateHook();
          }
        }}
        className="w-full max-w-md p-4 rounded-2xl bg-white text-black text-lg mb-4 shadow-2xl"
      />

      <select
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        className="w-full max-w-md p-4 rounded-2xl bg-white text-black text-lg mb-4 shadow-2xl"
      >
        <option>TikTok</option>
        <option>YouTube</option>
        <option>Gaming</option>
        <option>Funny</option>
        <option>Drama</option>
        <option>Sales</option>
      </select>

      <button
        onClick={generateHook}
        disabled={loading || cooldown || !topic.trim()}
        className="bg-white text-black px-8 py-3 rounded-2xl font-bold hover:scale-105 hover:bg-gray-300 transition cursor-pointer shadow-xl disabled:opacity-50"
      >
        {loading
          ? "Generating..."
          : cooldown
          ? "Wait 5s..."
          : "Generate Hooks"}
      </button>

      {history.length > 0 && (
        <button
          onClick={clearHistory}
          className="mt-4 text-sm text-red-400 hover:text-red-300 transition"
        >
          Clear History
        </button>
      )}

      <div className="w-full max-w-3xl mt-8 space-y-6">
        {history.map((item, index) => (
          <div
            key={index}
            className="bg-zinc-900 p-6 rounded-2xl shadow-2xl"
          >
            <div className="mb-4">
              <p className="text-sm text-zinc-400">
                Topic: <span className="text-white">{item.topic}</span>
              </p>

              <p className="text-sm text-zinc-400">
                Style: <span className="text-white">{item.style}</span>
              </p>
            </div>

            <pre className="whitespace-pre-wrap text-xl font-semibold text-left">
              {item.hooks}
            </pre>

            <button
              onClick={() => copyHooks(item.hooks, index)}
              className="mt-4 bg-white text-black px-4 py-2 rounded-xl font-bold hover:bg-gray-300 transition cursor-pointer"
            >
              {copiedIndex === index
                ? "Copied! ✅"
                : "Copy Hooks 📋"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}