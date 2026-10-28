import { Fragment } from "react";

/** Renders text with "\n" as line breaks (titles are edited as multi-line text in the dashboard). */
export default function Lines({ text = "" }) {
  return String(text).split("\n").map((line, i) => (
    <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>
  ));
}
