import React, { useState, useEffect } from "react";

const DEFAULT_MONKEYS = [
  "Chimpanzee",
  "Baboon",
  "Capuchin monkey",
  "Howler monkey",
  "Spider monkey",
  "Rhesus macaque",
  "Tamarin"
];

export default function RandomMonkey() {
  const [monkey, setMonkey] = useState(null);
  const [summary, setSummary] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function pickRandom() {
    const m = DEFAULT_MONKEYS[Math.floor(Math.random() * DEFAULT_MONKEYS.length)];
    setMonkey(m);
  }

  useEffect(() => {
    if (!monkey) return;
    const controller = new AbortController();
    async function fetchSummary() {
      setLoading(true);
      setError(null);
      setSummary(null);
      setThumbnail(null);

      const title = encodeURIComponent(monkey);
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;

      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Wikipedia API error: ${res.status}`);
        }
        const data = await res.json();
        setSummary(data.extract || "No summary available.");
        // prefer thumbnail, fallback to original image
        setThumbnail(data.thumbnail?.source || data.originalimage?.source || null);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
    return () => controller.abort();
  }, [monkey]);

  return (
    <div style={{ padding: 16 }}>
      <h1>Random Monkey</h1>

      <div style={{ marginBottom: 12 }}>
        <button onClick={pickRandom} style={{ padding: "8px 12px", marginRight: 8 }}>
          Get random monkey
        </button>
        <button
          onClick={() => {
            setMonkey(null);
            setSummary(null);
            setThumbnail(null);
            setError(null);
          }}
          style={{ padding: "8px 12px" }}
        >
          Clear
        </button>
      </div>

      {loading && <p>Loading info...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!monkey && !loading && <p style={{ color: "#666" }}>Click "Get random monkey" to see a monkey with image and short summary.</p>}

      {monkey && !loading && !error && (
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          {thumbnail && (
            <img
              src={thumbnail}
              alt={monkey}
              style={{ width: 180, height: "auto", borderRadius: 6, objectFit: "cover" }}
            />
          )}
          <div>
            <h2 style={{ marginTop: 0 }}>{monkey}</h2>
            <p style={{ maxWidth: 560 }}>{summary}</p>
            <p style={{ fontSize: "0.9rem", color: "#555" }}>
              Source:{" "}
              <a
                href={`https://en.wikipedia.org/wiki/${encodeURIComponent(monkey)}`}
                target="_blank"
                rel="noreferrer"
              >
                Wikipedia — {monkey}
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
// ...existing code...