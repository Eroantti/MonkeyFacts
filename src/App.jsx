import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FrontPage from "./pages/frontpage";
import MonkeyQuiz from "./pages/monkeyquiz";
import RandomMonkey from "./pages/randommonkey";
import MonkeyInfo from "./pages/monkeyinfo";

function App() {
  return (
    <Router>
      <nav style={{ marginBottom: "1rem" }}>
              <Link to="/" style={{ marginRight: "1rem" }}> Home </Link>
              <Link to="/monkeyinfo"> Monkey Info </Link>
              <Link to="/monkeyquiz"> Monkey Quiz </Link>
              <Link to="/randommonkey"> Random Monkey </Link>
            </nav>

      <Routes>
        <Route path="/" element={<FrontPage/>} />
        <Route path="/monkeyinfo" element={<MonkeyInfo/>} />
        <Route path="/monkeyquiz" element={<MonkeyQuiz/>} />
        <Route path="/randommonkey" element={<RandomMonkey/>} />
      </Routes>
    </Router>
  );
}

export default App;