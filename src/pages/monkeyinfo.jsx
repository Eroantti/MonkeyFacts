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

export default function MonkeyInfo() {
  const [query, setQuery] = useState(DEFAULT_MONKEYS[0]);
  const [summary, setSummary] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();
    async function fetchSummary() {
      setLoading(true);
      setError(null);
      setSummary(null);
      setThumbnail(null);

      const title = encodeURIComponent(query);
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;

      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("No Wikipedia page found for this term.");
          }
          throw new Error(`Wikipedia API error: ${res.status}`);
        }
        const data = await res.json();
        setSummary(data.extract || "No summary available.");
        setThumbnail(data.thumbnail?.source || null);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
    return () => controller.abort();
  }, [query]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Monkey Info</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "0.5rem" }}>
          Choose a monkey:
        </label>
        <select
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ marginRight: "1rem" }}
        >
          {DEFAULT_MONKEYS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <label style={{ marginRight: "0.5rem" }}>
          or search:
        </label>
        <input
          type="text"
          placeholder="Type species name and press Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter") setQuery(e.target.value.trim());
          }}
          style={{ width: 220 }}
        />
      </div>

      {loading && <p>Loading summary...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && summary && (
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
          {thumbnail && (
            <img
              src={thumbnail}
              alt={query}
              style={{ width: 180, height: "auto", borderRadius: 6 }}
            />
          )}
          <div>
            <h2>{query}</h2>
            <p>{summary}</p>
            <p style={{ fontSize: "0.9rem", color: "#555" }}>
              Source: <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`} target="_blank" rel="noreferrer">Wikipedia</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}