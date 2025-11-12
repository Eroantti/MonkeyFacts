import React, { useEffect, useState } from "react";

const ALL_QUESTIONS = [
  {
    monkey: "Chimpanzee",
    question: "Which of these is true about chimpanzees?",
    options: [
      "They use tools such as sticks to fish for termites.",
      "They are strictly nocturnal and never seen during daytime.",
      "They can fly short distances between trees."
    ],
    correct: 0
  },
  {
    monkey: "Baboon",
    question: "What is a notable baboon behavior?",
    options: [
      "They live in large, complex social troops with strict hierarchies.",
      "They build elaborate nests in tree hollows for hibernation.",
      "They migrate thousands of kilometers annually."
    ],
    correct: 0
  },
  {
    monkey: "Capuchin monkey",
    question: "Capuchin monkeys are well known for:",
    options: [
      "Using stones and sticks as tools to access food.",
      "Being the largest land primates.",
      "Having wings for gliding."
    ],
    correct: 0
  },
  {
    monkey: "Howler monkey",
    question: "Howler monkeys are famous for:",
    options: [
      "Producing very loud calls that can travel over long distances.",
      "Their ability to change color seasonally.",
      "Being primarily aquatic and hunting fish."
    ],
    correct: 0
  },
  {
    monkey: "Spider monkey",
    question: "Spider monkeys have a distinctive trait:",
    options: [
      "A prehensile tail used like an extra limb.",
      "Their diet consists only of insects.",
      "They hibernate during the dry season."
    ],
    correct: 0
  },
  {
    monkey: "Rhesus macaque",
    question: "Rhesus macaques are notable because:",
    options: [
      "They adapt well to human environments and are often found near cities.",
      "They are exclusively marine mammals.",
      "They only eat eucalyptus leaves."
    ],
    correct: 0
  },
  {
    monkey: "Tamarin",
    question: "Tamarins are small primates known for:",
    options: [
      "Being small, often brightly colored New World monkeys with twin births common.",
      "Building underground burrows like prairie dogs.",
      "Spending most of life underground and blind."
    ],
    correct: 0
  }
];

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MonkeyQuiz() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  // For monkey image
  const [monkeyImg, setMonkeyImg] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);

  useEffect(() => {
    const picked = shuffleArray(ALL_QUESTIONS).slice(0, 5).map((q) => {
      const opts = shuffleArray(q.options);
      const correctIndex = opts.indexOf(q.options[q.correct]);
      return { ...q, options: opts, correct: correctIndex };
    });
    setQuestions(picked);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }, []);

  // Fetch monkey image for current question
  useEffect(() => {
    if (!questions.length) return;
    const monkey = questions[index].monkey;
    setImgLoading(true);
    setMonkeyImg(null);
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(monkey)}`)
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(data => setMonkeyImg(data.thumbnail?.source || null))
      .catch(() => setMonkeyImg(null))
      .finally(() => setImgLoading(false));
  }, [questions, index]);

  if (questions.length === 0) {
    return <div className="card-style p-3">Loading quiz...</div>;
  }

  function handleSelect(i) {
    if (selected !== null) return;
    setSelected(i);
    const isCorrect = i === questions[index].correct;
    if (isCorrect) setScore((s) => s + 1);
  }

  function handleNext() {
    const next = index + 1;
    if (next >= questions.length) {
      setFinished(true);
    } else {
      setIndex(next);
      setSelected(null);
    }
  }

  function handleRestart() {
    const picked = shuffleArray(ALL_QUESTIONS).slice(0, 5).map((q) => {
      const opts = shuffleArray(q.options);
      const correctIndex = opts.indexOf(q.options[q.correct]);
      return { ...q, options: opts, correct: correctIndex };
    });
    setQuestions(picked);
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <div style={{ padding: 16 }}>
        <h1>Monkey Quiz — Results</h1>
        <div className="mb-3" style={{textAlign: 'center'}}>
          <img src="/monkeyparty.jpg" alt="Monkey party" style={{ width: 680, maxWidth: '100%', borderRadius: 10, marginBottom: 16 }} />
        </div>
        <p>
          Score: {score} / {questions.length}
        </p>
        <button onClick={handleRestart}>Play again</button>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div className="card-style p-3">
      <h1>Monkey Quiz</h1>
      <p className="muted">
        Question {index + 1} / {questions.length} — about: <strong>{q.monkey}</strong>
      </p>
      {imgLoading ? (
        <p>Loading image...</p>
      ) : monkeyImg ? (
        <div className="mb-3"><img src={monkeyImg} alt={q.monkey} style={{ width: 320, maxWidth: '100%', borderRadius: 8, objectFit: 'cover' }} /></div>
      ) : null}
      <p className="mt-2">{q.question}</p>

      <div className="d-flex flex-column gap-2 mt-3">
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = q.correct === i;
          const base = "list-group-item d-flex justify-content-between align-items-center";
          const variant =
            selected == null
              ? "bg-light"
              : isCorrect
              ? "bg-success"
              : isSelected
              ? "bg-danger"
              : "bg-light";

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`${base} ${variant}`}
                style={{ borderRadius: 6, border: '1px solid rgba(0,0,0,0.08)', textAlign: 'left', color: '#000' }}
            >
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3">
        {selected !== null ? (
          <>
            <p>
              {selected === q.correct ? "Correct!" : `Wrong — correct answer: ${q.options[q.correct]}`}
            </p>
            <button className="btn btn-primary me-2" onClick={handleNext}>
              {index + 1 === questions.length ? "Finish" : "Next"}
            </button>
            <button className="btn btn-outline-secondary" onClick={handleRestart}>Restart</button>
          </>
        ) : (
          <p className="muted">Select an answer to continue.</p>
        )}
      </div>
    </div>
  );
}
