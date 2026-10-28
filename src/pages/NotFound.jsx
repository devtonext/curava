import Button from "../components/Button";

export default function NotFound() {
  return (
    <section className="section center">
      <div className="container">
        <h1 className="display">404</h1>
        <p className="lead" style={{ margin: "20px auto 34px" }}>This page took a sick day. Let's get you back somewhere healthy.</p>
        <div style={{ display: "flex", justifyContent: "center" }}><Button to="/" variant="purple">Back home</Button></div>
      </div>
    </section>
  );
}
