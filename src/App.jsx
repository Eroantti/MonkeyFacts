import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FrontPage from "./pages/frontpage";
import MonkeyQuiz from "./pages/monkeyquiz";
import RandomMonkey from "./pages/randommonkey";
import MonkeyInfo from "./pages/monkeyinfo";
import { Container, Navbar, Nav } from "react-bootstrap";

function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="md" className="mb-4">
        <Container>
          <Navbar.Brand>Monkey Facts</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/monkeyinfo">Monkey Info</Nav.Link>
              <Nav.Link as={Link} to="/monkeyquiz">Monkey Quiz</Nav.Link>
              <Nav.Link as={Link} to="/randommonkey">Random Monkey</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="page-container">
        <Routes>
          <Route path="/" element={<FrontPage/>} />
          <Route path="/monkeyinfo" element={<MonkeyInfo/>} />
          <Route path="/monkeyquiz" element={<MonkeyQuiz/>} />
          <Route path="/randommonkey" element={<RandomMonkey/>} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;