import { Container, Row, Col, Card, Button } from "react-bootstrap";

function FrontPage() {
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="card-style mb-4 p-4 text-start">
            <h1 className="mb-2">Welcome to Monkey Facts!</h1>
            <p className="muted">
              On this site, we showcase some of our favorite monkeys and apes. You'll find pictures and information, a random monkey picker and a small trivia quiz.
            </p>
            <div className="text-center my-3">
              <img className="responsive" src="/twocapuchins.jpg" alt="Two Capuchin monkeys" />
              <p className="muted small mt-2">Pictured: two lovely capuchin monkeys.</p>
            </div>
            
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default FrontPage;