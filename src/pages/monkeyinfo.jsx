import React, { useState, useEffect } from "react";

const DEFAULT_MONKEYS = [
  "Chimpanzee",
  "Baboon",
  "Capuchin monkey",
  "Howler monkey",
  "Spider monkey",
  "Rhesus macaque",
  "Tamarin",
  "Orangutan",
  "Gibbon",
  "Squirrel monkey",
  "Proboscis monkey",
  "Colobus monkey",
  "Golden lion tamarin",
  "Marmoset",
  "Mandrill",
  "Gelada",
  "Pygmy marmoset",
  "Uakari"
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
    <div>
      <div className="card-style mb-4">
        <h1>Monkey Info</h1>

        <div className="d-flex flex-wrap align-items-center mb-3 gap-2">
          <label className="me-2">Choose a monkey:</label>
          <select
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-select w-auto me-3"
          >
            {DEFAULT_MONKEYS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <label className="me-2">or search:</label>
          <input
            type="text"
            placeholder="Type species name and press Enter"
            onKeyDown={(e) => {
              if (e.key === "Enter") setQuery(e.target.value.trim());
            }}
            className="form-control w-auto"
            style={{ minWidth: 180 }}
          />
        </div>

        {loading && <p>Loading summary...</p>}
        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

        {!loading && !error && summary && (
          <div className="d-flex flex-column flex-md-row gap-3">
            {thumbnail && (
                <img
                  src={thumbnail}
                  alt={query}
                  className="responsive"
                  style={{ width: 320, maxWidth: '100%', height: "auto", borderRadius: 8, objectFit: 'cover' }}
                />
              )}
            <div>
              <h2 className="mb-1">{query}</h2>
              <p>{summary}</p>
              <p className="muted small">
                Source: <a className="accent" href={`https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`} target="_blank" rel="noreferrer">Wikipedia</a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}