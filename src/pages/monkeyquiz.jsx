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

  useEffect(() => {
    // prepare a random quiz of 5 questions
    const picked = shuffleArray(ALL_QUESTIONS).slice(0, 5).map((q) => {
      // shuffle options while keeping track of correct index
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

  if (questions.length === 0) {
    return <div style={{ padding: 16 }}>Loading quiz...</div>;
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
        <p>
          Score: {score} / {questions.length}
        </p>
        <button onClick={handleRestart}>Play again</button>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div style={{ padding: 16 }}>
      <h1>Monkey Quiz</h1>
      <p>
        Question {index + 1} / {questions.length} — about: <strong>{q.monkey}</strong>
      </p>
      <p style={{ marginTop: 8 }}>{q.question}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = q.correct === i;
          const background =
            selected == null
              ? "#f0f0f0"
              : isCorrect
              ? "#c8e6c9"
              : isSelected
              ? "#ffcdd2"
              : "#f0f0f0";
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              style={{
                padding: "10px 12px",
                textAlign: "left",
                background,
                color: "#000",            // changed: make answer text black
                border: "1px solid #ccc",
                borderRadius: 6,
                cursor: selected === null ? "pointer" : "default"
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 16 }}>
        {selected !== null ? (
          <>
            <p>
              {selected === q.correct ? "Correct!" : `Wrong — correct answer: ${q.options[q.correct]}`}
            </p>
            <button onClick={handleNext} style={{ marginRight: 8 }}>
              {index + 1 === questions.length ? "Finish" : "Next"}
            </button>
            <button onClick={handleRestart}>Restart</button>
          </>
        ) : (
          <p style={{ color: "#666" }}>Select an answer to continue.</p>
        )}
      </div>
    </div>
  );
}
// ...existing code...