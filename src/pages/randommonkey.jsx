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
    <div>
      <div className="card-style mb-3 p-3">
        <h1>Random Monkey</h1>

        <div className="mb-3">
          <button className="btn btn-primary me-2" onClick={pickRandom}>Get random monkey</button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setMonkey(null);
              setSummary(null);
              setThumbnail(null);
              setError(null);
            }}
          >
            Clear
          </button>
        </div>

        {loading && <p>Loading info...</p>}
        {error && <p style={{ color: "#ff6b6b" }}>{error}</p>}

        {!monkey && !loading && <p className="muted">Click "Get random monkey" to see a monkey with image and short summary.</p>}

        {monkey && !loading && !error && (
          <div className="d-flex flex-column flex-md-row gap-3">
            {thumbnail && (
              <img
                src={thumbnail}
                alt={monkey}
                className="responsive"
                style={{ width: 320, maxWidth: '100%', borderRadius: 8, objectFit: 'cover' }}
              />
            )}
            <div>
              <h2 className="mb-1">{monkey}</h2>
              <p style={{ maxWidth: 640 }}>{summary}</p>
              <p className="muted small">
                Source: <a className="accent" href={`https://en.wikipedia.org/wiki/${encodeURIComponent(monkey)}`} target="_blank" rel="noreferrer">Wikipedia — {monkey}</a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
